/**
 * Cloudflare Worker Backend for NETD IT Management Web App (v3.2)
 * Features:
 * - True Deletion Sync (deletes removed records in D1, preventing zombie data)
 * - Safe Auto-Mapper with Fallbacks (prevents NOT NULL / UNIQUE rollback)
 * - Auto-Schema Initializer (db.exec)
 * - Bidirectional CamelCase <-> SnakeCase field normalization
 * - Direct Delete Endpoint (/api/delete/:table/:id)
 */

// Helper to convert camelCase to snake_case
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// Helper to convert snake_case to camelCase
function snakeToCamel(str) {
  return str.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase());
}

// Convert object keys to snake_case
function objectToSnake(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
  const newObj = {};
  for (const [k, v] of Object.entries(obj)) {
    newObj[camelToSnake(k)] = v;
  }
  return newObj;
}

// Convert object keys to camelCase
function objectToCamel(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
  const newObj = {};
  for (const [k, v] of Object.entries(obj)) {
    newObj[snakeToCamel(k)] = v;
  }
  return newObj;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "*";

    // Standard CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Serve Static Assets directly if running with [assets] binding and not an API route
    if (!url.pathname.startsWith("/api/")) {
      if (env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
    }

    // Response helper
    const json = (data, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          ...corsHeaders,
        },
      });
    };

    try {
      const db = env.DB;
      if (!db && url.pathname.startsWith("/api/")) {
        return json({
          success: false,
          error: "Cloudflare D1 binding 'DB' is not configured in wrangler.toml or environment.",
          status: "binding_missing"
        }, 500);
      }

      // 1. Health check & Ping test endpoint
      if (url.pathname === "/api/ping" || url.pathname === "/api/health") {
        try {
          const result = await db.prepare("SELECT datetime('now') as server_time").first();
          return json({
            success: true,
            status: "online",
            message: "Cloudflare D1 Database Connected Successfully!",
            server_time: result.server_time,
            sqlite_version: "Cloudflare D1 Engine",
            timestamp: new Date().toISOString()
          });
        } catch (dbErr) {
          return json({
            success: false,
            status: "offline",
            error: dbErr.message
          }, 500);
        }
      }

      // Auto-initialize schema if not exists
      const ensureSchema = async () => {
        try {
          await db.exec(`
            CREATE TABLE IF NOT EXISTS settings (id TEXT PRIMARY KEY DEFAULT 'setting_01', shop_name TEXT NOT NULL DEFAULT 'NETD IT Solutions & Services', shop_subtitle TEXT, phone TEXT, email TEXT, address TEXT, tax_id TEXT, currency TEXT DEFAULT 'LAK', currency_symbol TEXT DEFAULT '₭', tax_rate REAL DEFAULT 7.0, logo_url TEXT, bank_name TEXT, bank_account_no TEXT, bank_account_name TEXT, bank_qr_url TEXT, d1_worker_url TEXT, theme TEXT DEFAULT 'dark', updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS employees (id TEXT PRIMARY KEY, name TEXT NOT NULL, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'technician', role_name TEXT, position TEXT, phone TEXT, email TEXT, avatar TEXT, address TEXT, joined_date DATE, salary REAL DEFAULT 0, status TEXT DEFAULT 'active', notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, type TEXT, name TEXT, company TEXT, contact_person TEXT, phone TEXT, email TEXT, address TEXT, tax_id TEXT, notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT, code TEXT, description TEXT, icon TEXT DEFAULT 'fa-box', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS brands (id TEXT PRIMARY KEY, name TEXT, logo_url TEXT, category_id TEXT, contact_info TEXT, warranty_policy TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS suppliers (id TEXT PRIMARY KEY, name TEXT, contact_person TEXT, phone TEXT, email TEXT, address TEXT, payment_terms TEXT, notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, sku TEXT, name TEXT, model TEXT, sn_or_mac TEXT, category_id TEXT, brand_id TEXT, supplier_id TEXT, supplier_name TEXT, cost_price REAL DEFAULT 0, selling_price REAL DEFAULT 0, sale_price REAL DEFAULT 0, stock_qty INTEGER DEFAULT 0, min_stock_alert INTEGER DEFAULT 3, min_stock INTEGER DEFAULT 3, unit TEXT DEFAULT 'ເຄື່ອງ', warranty_period TEXT DEFAULT '1 ປີ', location TEXT, image_url TEXT, barcode TEXT, specifications TEXT, description TEXT, has_sn INTEGER DEFAULT 0, profit_margin REAL DEFAULT 0, status TEXT DEFAULT 'in_stock', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS product_serials (id TEXT PRIMARY KEY, product_id TEXT, serial_number TEXT, mac_address TEXT, status TEXT DEFAULT 'in_stock', purchase_order_id TEXT, invoice_id TEXT, warranty_months INTEGER DEFAULT 12, customer_id TEXT, customer_name TEXT, sold_date DATE, warranty_expire DATE, location TEXT, received_date DATE, notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS inventory_logs (id TEXT PRIMARY KEY, product_id TEXT, product_name TEXT, type TEXT, qty INTEGER DEFAULT 0, prev_qty INTEGER DEFAULT 0, new_qty INTEGER DEFAULT 0, ref_doc_id TEXT, notes TEXT, performed_by TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS purchase_orders (id TEXT PRIMARY KEY, po_number TEXT, supplier_id TEXT, supplier_name TEXT, order_date DATE, expected_date DATE, status TEXT DEFAULT 'draft', subtotal REAL DEFAULT 0, shipping_cost REAL DEFAULT 0, total_amount REAL DEFAULT 0, notes TEXT, items_json TEXT, created_by TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, doc_number TEXT, type TEXT, doc_type TEXT, customer_id TEXT, customer_name TEXT, customer_phone TEXT, customer_address TEXT, date DATE, due_date DATE, ref_doc_id TEXT, ref_quotation_no TEXT, subtotal REAL DEFAULT 0, tax_rate REAL DEFAULT 0, tax_amount REAL DEFAULT 0, discount_amount REAL DEFAULT 0, discount REAL DEFAULT 0, total_amount REAL DEFAULT 0, grand_total REAL DEFAULT 0, paid_amount REAL DEFAULT 0, balance_amount REAL DEFAULT 0, payment_method TEXT DEFAULT 'transfer', status TEXT NOT NULL DEFAULT 'draft', notes TEXT, terms_conditions TEXT, items_json TEXT, created_by TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS document_items (id TEXT PRIMARY KEY, document_id TEXT, product_id TEXT, item_code TEXT, item_name TEXT, item_model TEXT, item_sn TEXT, qty INTEGER NOT NULL DEFAULT 1, unit TEXT DEFAULT 'ເຄື່ອງ', unit_price REAL NOT NULL DEFAULT 0, discount REAL DEFAULT 0, total_price REAL NOT NULL DEFAULT 0, warranty TEXT DEFAULT '1 ປີ', notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, project_code TEXT, code TEXT, name TEXT, title TEXT, customer_id TEXT, customer_name TEXT, customer_phone TEXT, service_type TEXT DEFAULT 'cctv', category TEXT, category_id TEXT, category_name TEXT, status TEXT DEFAULT 'survey', start_date DATE, target_date DATE, deadline DATE, completion_date DATE, budget REAL DEFAULT 0, cost_actual REAL DEFAULT 0, profit REAL DEFAULT 0, progress INTEGER DEFAULT 0, lead_technician_id TEXT, lead_technician_name TEXT, leader_id TEXT, leader_name TEXT, quotation_doc_number TEXT, invoice_doc_number TEXT, assigned_team TEXT, scope_of_work TEXT, location TEXT, notes TEXT, milestones_json TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS project_tasks (id TEXT PRIMARY KEY, project_id TEXT, title TEXT, description TEXT, assigned_to TEXT, assigned_name TEXT, due_date DATE, deadline DATE, priority TEXT DEFAULT 'medium', status TEXT DEFAULT 'pending', sort_order INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS project_categories (id TEXT PRIMARY KEY, name TEXT, code TEXT, color TEXT DEFAULT 'sky', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS it_job_categories (id TEXT PRIMARY KEY, key TEXT, name TEXT, description TEXT, color TEXT DEFAULT 'sky', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS it_jobs (id TEXT PRIMARY KEY, job_code TEXT, customer_name TEXT, customer_phone TEXT, job_type TEXT DEFAULT 'onsite', device_model TEXT, serial_or_mac TEXT, issue_description TEXT, resolution TEXT, technician_id TEXT, technician_name TEXT, service_fee REAL DEFAULT 0, parts_replaced TEXT, status TEXT DEFAULT 'pending', received_date DATE DEFAULT CURRENT_TIMESTAMP, completed_date DATE, notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS transactions (id TEXT PRIMARY KEY, type TEXT, category TEXT, amount REAL DEFAULT 0, date DATE, ref_doc TEXT, ref_doc_id TEXT, description TEXT, payment_method TEXT DEFAULT 'transfer', recorded_by TEXT, notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS client_systems (id TEXT PRIMARY KEY, system_name TEXT, customer_id TEXT, domain_url TEXT, hosting_provider TEXT, launch_date DATE, expiry_date DATE, sla_type TEXT DEFAULT 'SLA Gold 24/7', status TEXT DEFAULT 'active', price REAL DEFAULT 0, tech_stack TEXT, notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS activity_logs (id TEXT PRIMARY KEY, user TEXT, action TEXT, module TEXT, details TEXT, time TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
          `);
        } catch (e) {
          console.warn("Schema init error:", e.message);
        }
      };

      // Helper: get valid column names for a table in SQLite
      const getTableColumns = async (tableName) => {
        try {
          let { results } = await db.prepare(`PRAGMA table_info(${tableName})`).all();
          if (!results || results.length === 0) {
            await ensureSchema();
            const recheck = await db.prepare(`PRAGMA table_info(${tableName})`).all();
            results = recheck.results;
          }
          return (results || []).map(r => r.name);
        } catch (e) {
          return [];
        }
      };

      // 2. Direct Delete endpoint: /api/delete/:table/:id
      const deleteMatch = url.pathname.match(/^\/api\/delete\/([^/]+)\/([^/]+)$/);
      if (deleteMatch && (request.method === "DELETE" || request.method === "POST")) {
        const targetTable = deleteMatch[1];
        const targetId = deleteMatch[2];
        try {
          await db.prepare(`DELETE FROM ${targetTable} WHERE id = ?`).bind(targetId).run();
          return json({ success: true, message: `Deleted ${targetId} from ${targetTable}` });
        } catch (e) {
          return json({ success: false, error: e.message }, 500);
        }
      }

      // 3. Full Database Sync endpoint: /api/sync-all (Client -> D1)
      if (url.pathname === "/api/sync-all" && request.method === "POST") {
        const payload = await request.json();
        const fullData = payload.data || {};
        let syncedCount = 0;

        const tableMap = {
          settings: fullData.settings ? [fullData.settings] : [],
          employees: fullData.employees || [],
          customers: fullData.customers || [],
          categories: fullData.categories || [],
          brands: fullData.brands || [],
          suppliers: fullData.suppliers || [],
          products: fullData.products || [],
          product_serials: fullData.productSerials || [],
          purchase_orders: fullData.purchaseOrders || [],
          documents: fullData.documents || [],
          project_categories: fullData.projectCategories || [],
          projects: fullData.projects || [],
          project_tasks: fullData.tasks || [],
          it_job_categories: fullData.itJobCategories || [],
          it_jobs: fullData.itJobs || [],
          transactions: fullData.transactions || [],
          client_systems: fullData.clientSystems || [],
          activity_logs: fullData.activityLogs || []
        };

        for (const [table, rows] of Object.entries(tableMap)) {
          const validCols = await getTableColumns(table);
          if (!validCols || validCols.length === 0) continue;

          // 1. Synchronize deletions: delete rows in D1 that no longer exist in client snapshot
          if (Array.isArray(rows)) {
            const clientIds = rows.map(r => r.id).filter(Boolean);
            if (clientIds.length > 0 && table !== 'settings') {
              try {
                const placeholders = clientIds.map(() => '?').join(', ');
                await db.prepare(`DELETE FROM ${table} WHERE id NOT IN (${placeholders})`).bind(...clientIds).run();
              } catch (delErr) {
                console.warn(`Delete sync warning for ${table}:`, delErr.message);
              }
            } else if (clientIds.length === 0 && table !== 'settings') {
              try {
                await db.prepare(`DELETE FROM ${table}`).run();
              } catch (delErr) {}
            }
          }

          if (!rows || rows.length === 0) continue;

          const stmts = [];
          for (const rawRow of rows) {
            const row = objectToSnake(rawRow);
            if (table === "settings" && !row.id) row.id = "setting_01";
            if (!row.id) row.id = "row_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);

            // Safe field fallbacks & mappings
            if (table === "documents") {
              if (!row.type) row.type = rawRow.docType || rawRow.type || 'quotation';
              if (!row.doc_type) row.doc_type = row.type;
              if (!row.customer_name) row.customer_name = rawRow.customerName || 'ລູກຄ້າ';
              if (!row.doc_number) row.doc_number = rawRow.docNumber || ('DOC-' + row.id);
              if (!row.date) row.date = rawRow.date || new Date().toISOString().substring(0, 10);
              if (row.total_amount === undefined) row.total_amount = rawRow.grandTotal !== undefined ? rawRow.grandTotal : (rawRow.totalAmount || 0);
              if (row.grand_total === undefined) row.grand_total = row.total_amount;
              if (row.discount_amount === undefined) row.discount_amount = rawRow.discount !== undefined ? rawRow.discount : (rawRow.discountAmount || 0);
              if (rawRow.items && !row.items_json) row.items_json = JSON.stringify(rawRow.items);
            }

            if (table === "products") {
              if (!row.name) row.name = rawRow.name || 'ສິນຄ້າ';
              if (!row.sku) row.sku = rawRow.sku || ('SKU-' + row.id);
              if (!row.category_id) row.category_id = rawRow.categoryId || 'cat_cctv';
              if (row.cost_price === undefined) row.cost_price = rawRow.costPrice || 0;
              if (row.selling_price === undefined) row.selling_price = rawRow.salePrice !== undefined ? rawRow.salePrice : (rawRow.sellingPrice || 0);
              if (row.sale_price === undefined) row.sale_price = row.selling_price;
              if (row.min_stock_alert === undefined) row.min_stock_alert = rawRow.minStock !== undefined ? rawRow.minStock : 3;
              if (row.min_stock === undefined) row.min_stock = row.min_stock_alert;
            }

            if (table === "purchase_orders") {
              if (!row.po_number) row.po_number = rawRow.poNumber || ('PO-' + row.id);
              if (rawRow.items && !row.items_json) row.items_json = JSON.stringify(rawRow.items);
            }

            if (table === "projects") {
              if (!row.project_code) row.project_code = rawRow.code || rawRow.projectCode || ('PRJ-' + row.id);
              if (!row.code) row.code = row.project_code;
              if (!row.name) row.name = rawRow.title || rawRow.name || 'ໂຄງການ';
              if (!row.title) row.title = row.name;
              if (!row.target_date) row.target_date = rawRow.deadline || rawRow.targetDate || null;
              if (rawRow.milestones && !row.milestones_json) row.milestones_json = JSON.stringify(rawRow.milestones);
            }

            if (table === "customers") {
              if (!row.name) row.name = rawRow.name || 'ລູກຄ້າ';
              if (!row.phone) row.phone = rawRow.phone || '';
              if (!row.type) row.type = rawRow.type || 'individual';
            }

            if (table === "it_jobs") {
              if (!row.job_code) row.job_code = rawRow.jobCode || ('JOB-' + row.id);
              if (!row.customer_name) row.customer_name = rawRow.customerName || 'ລູກຄ້າ';
              if (!row.issue_description) row.issue_description = rawRow.issueDescription || 'ກວດເຊັກລະບົບ';
            }

            if (table === "project_tasks") {
              if (!row.due_date && rawRow.deadline) row.due_date = rawRow.deadline;
              if (!row.deadline && rawRow.deadline) row.deadline = rawRow.deadline;
            }

            if (table === "transactions") {
              if (!row.ref_doc_id && rawRow.refDoc) row.ref_doc_id = rawRow.refDoc;
              if (!row.ref_doc && rawRow.refDoc) row.ref_doc = rawRow.refDoc;
              if (!row.description) row.description = rawRow.description || 'ລາຍການ';
              if (row.amount === undefined) row.amount = rawRow.amount || 0;
              if (!row.date) row.date = rawRow.date || new Date().toISOString().substring(0, 10);
              if (!row.type) row.type = rawRow.type || 'income';
              if (!row.category) row.category = rawRow.category || 'other';
            }

            // General itemsJson fallback
            if (rawRow.items && !row.items_json) {
              row.items_json = JSON.stringify(rawRow.items);
            }

            const filteredKeys = Object.keys(row).filter(k => validCols.includes(k));
            if (filteredKeys.length === 0) continue;

            const cols = filteredKeys.join(", ");
            const placeholders = filteredKeys.map(() => "?").join(", ");
            const sql = `INSERT OR REPLACE INTO ${table} (${cols}) VALUES (${placeholders})`;
            const values = filteredKeys.map(k => typeof row[k] === "object" ? JSON.stringify(row[k]) : row[k]);
            stmts.push(db.prepare(sql).bind(...values));
            syncedCount++;
          }

          if (stmts.length > 0) {
            try {
              const chunkSize = 50;
              for (let i = 0; i < stmts.length; i += chunkSize) {
                await db.batch(stmts.slice(i, i + chunkSize));
              }
            } catch (batchErr) {
              console.warn(`Batch failed for ${table}, falling back to single execution:`, batchErr.message);
              for (const stmt of stmts) {
                try {
                  await stmt.run();
                } catch (singleErr) {
                  console.error(`Single insert failed for ${table}:`, singleErr.message);
                }
              }
            }
          }
        }

        return json({
          success: true,
          message: "All entities successfully synchronized with Cloudflare D1",
          syncedCount,
          timestamp: new Date().toISOString()
        });
      }

      // 4. Full Database Pull endpoint: /api/pull-all (D1 -> Client)
      if (url.pathname === "/api/pull-all" && request.method === "GET") {
        const pullMap = {
          settings: "settings",
          employees: "employees",
          customers: "customers",
          categories: "categories",
          brands: "brands",
          suppliers: "suppliers",
          products: "products",
          productSerials: "product_serials",
          purchaseOrders: "purchase_orders",
          documents: "documents",
          projectCategories: "project_categories",
          projects: "projects",
          tasks: "project_tasks",
          itJobCategories: "it_job_categories",
          itJobs: "it_jobs",
          transactions: "transactions",
          clientSystems: "client_systems",
          activityLogs: "activity_logs"
        };

        const resultData = {};
        await ensureSchema();

        for (const [clientKey, dbTable] of Object.entries(pullMap)) {
          try {
            const { results } = await db.prepare(`SELECT * FROM ${dbTable}`).all();
            if (clientKey === "settings") {
              const settingRow = results && results.length > 0 ? results[0] : null;
              resultData.settings = settingRow ? objectToCamel(settingRow) : {};
            } else {
              resultData[clientKey] = (results || []).map(r => {
                const camel = objectToCamel(r);

                // Documents mapping
                if (clientKey === "documents") {
                  if (!camel.docType && camel.type) camel.docType = camel.type;
                  if (!camel.type && camel.docType) camel.type = camel.docType;
                  if (camel.grandTotal === undefined && camel.totalAmount !== undefined) camel.grandTotal = camel.totalAmount;
                  if (camel.discount === undefined && camel.discountAmount !== undefined) camel.discount = camel.discountAmount;
                  if (camel.itemsJson) {
                    try { camel.items = JSON.parse(camel.itemsJson); } catch (e) {}
                  }
                }

                // Products mapping
                if (clientKey === "products") {
                  if (camel.salePrice === undefined && camel.sellingPrice !== undefined) camel.salePrice = camel.sellingPrice;
                  if (camel.minStock === undefined && camel.minStockAlert !== undefined) camel.minStock = camel.minStockAlert;
                }

                // Purchase orders mapping
                if (clientKey === "purchaseOrders") {
                  if (camel.itemsJson) {
                    try { camel.items = JSON.parse(camel.itemsJson); } catch (e) {}
                  }
                }

                // Projects mapping
                if (clientKey === "projects") {
                  if (!camel.code && camel.projectCode) camel.code = camel.projectCode;
                  if (!camel.title && camel.name) camel.title = camel.name;
                  if (!camel.deadline && camel.targetDate) camel.deadline = camel.targetDate;
                  if (camel.milestonesJson) {
                    try { camel.milestones = JSON.parse(camel.milestonesJson); } catch (e) {}
                  }
                }

                // Project tasks mapping
                if (clientKey === "tasks") {
                  if (!camel.deadline && camel.dueDate) camel.deadline = camel.dueDate;
                }

                // Transactions mapping
                if (clientKey === "transactions") {
                  if (!camel.refDoc && camel.refDocId) camel.refDoc = camel.refDocId;
                }

                if (camel.itemsJson && !camel.items) {
                  try { camel.items = JSON.parse(camel.itemsJson); } catch (e) {}
                }

                return camel;
              });
            }
          } catch (e) {
            resultData[clientKey] = clientKey === "settings" ? {} : [];
          }
        }

        return json({
          success: true,
          data: resultData,
          timestamp: new Date().toISOString()
        });
      }

      return json({ success: false, error: "Not Found", status: 404 }, 404);

    } catch (err) {
      return json({
        success: false,
        error: err.message,
        stack: err.stack
      }, 500);
    }
  }
};
