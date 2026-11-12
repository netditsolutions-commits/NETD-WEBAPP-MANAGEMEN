/**
 * NETD IT MANAGEMENT SYSTEM - DATA & CLOUDFLARE D1 ADAPTER (v2.5)
 * Handles local persistence, Cloudflare D1 REST sync, continuous SKU generator,
 * profit margin calculations, IT service jobs, and full CRUD.
 */

const DB_STORAGE_KEY = 'netd_it_database_v2_5';
const CF_CONFIG_KEY = 'netd_cf_d1_config_v2';

// ----------------------------------------------------------------------------
// INITIAL SEED DATA (ຂໍ້ມູນເລີ່ມຕົ້ນພາສາລາວ)
// ----------------------------------------------------------------------------
const DEFAULT_DATABASE = {
  settings: {
    id: 'setting_01',
    shopName: 'NETD IT Solutions & Services',
    shopNameLao: 'ເນັດດີ ໄອທີ ໂຊລູຊັ່ນ',
    shopSubtitle: 'ສູນບໍລິການຕິດຕັ້ງ ແລະ ຈັດຈຳໜ່າຍອຸປະກອນໄອທີຄົບວົງຈອນ',
    phone: '+856 20 5555 8888 / 021 456 789',
    email: 'info@netd-it.la',
    website: 'www.netditsolutions.com',
    address: 'ຖະໜົນ ໄກສອນ ພົມວິຫານ, ບ້ານ ໂພນສະອາດ, ເມືອງ ໄຊເສດຖາ, ນະຄອນຫຼວງວຽງຈັນ',
    taxId: 'TAX-0102030405-LA',
    currency: 'LAK',
    currencySymbol: '₭',
    taxRate: 7,
    logoUrl: 'Logo.png',
    bankName: 'ທະນາຄານການຄ້າຕ່າງປະເທດລາວ (BCEL)',
    bankAccountNo: '010-12-00-01234567-001',
    bankAccountName: 'NETD IT SOLUTIONS & SERVICES',
    bankQrUrl: '',
    supabaseUrl: 'https://qohxvisrdckmhegewpsx.supabase.co',
    supabaseAnonKey: '',
    d1WorkerUrl: 'https://netd-manage-webapp.netditsolutions.workers.dev',
    d1DatabaseId: 'netd_it_management',
    syncMode: 'supabase',
    theme: 'dark', // 'dark' or 'light'
    lastSync: null
  },

  employees: [
    {
      id: 'emp_00',
      name: 'Mr. Chanh Xeng',
      username: 'chanh',
      password: 'p@ss4admin',
      role: 'admin',
      roleName: 'Admin (ເຈົ້າຂອງຮ້ານ)',
      position: 'ເຈົ້າຂອງຮ້ານ (Owner & Founder)',
      phone: '020 2920 4248',
      email: 'chanhtsheej93@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      status: 'active',
      joinedDate: '2026-11-01',
      address: 'ນະຄອນຫຼວງວຽງຈັນ',
      salary: 0,
      notes: 'ເຈົ້າຂອງຮ້ານ ແລະ ຜູ້ບໍລິຫານສູງສຸດ'
    },
    {
      id: 'emp_01',
      name: 'ສົມສັກ ແກ້ວມະນີ',
      username: 'admin',
      password: 'p@ss4admin',
      role: 'admin',
      roleName: 'Admin (ສິດສູງສຸດ)',
      position: 'ຜູ້ຈັດການທົ່ວໄປ (General Manager)',
      phone: '020 5555 8888',
      email: 'somsack@netd-it.la',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      status: 'active', // active, on_leave, resigned
      joinedDate: '2023-01-15',
      address: 'ບ້ານ ໂພນສະອາດ, ເມືອງ ໄຊເສດຖາ, ນະຄອນຫຼວງວຽງຈັນ',
      salary: 12000000,
      notes: 'ຜູ້ຈັດການທົ່ວໄປ ແລະ ດູແລລະບົບ IT Infrastructure'
    },
    {
      id: 'emp_02',
      name: 'ສົມໄຊ ໄຊຍະວົງ',
      username: 'somxay',
      password: 'tech123',
      role: 'technician',
      roleName: 'Technician (ຊ່າງໄອທີ)',
      position: 'ຫົວໜ້າທີມຊ່າງໄອທີ (Lead IT Tech)',
      phone: '020 7788 9911',
      email: 'somxay.tech@netd-it.la',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'active',
      joinedDate: '2023-05-10',
      address: 'ບ້ານ ໜອງບອນ, ເມືອງ ໄຊເສດຖາ, ນະຄອນຫຼວງວຽງຈັນ',
      salary: 8500000,
      notes: 'ຊ່ຽວຊານລະບົບ Network UniFi, Cisco, Mikrotik ແລະ CCTV'
    },
    {
      id: 'emp_03',
      name: 'ຈຳປາ ວົງວິໄລ',
      username: 'champa',
      password: 'acc123',
      role: 'officer',
      roleName: 'Officer (ພະນັກງານທົ່ວໄປ)',
      position: 'ຫົວໜ້າຝ່າຍບັນຊີ ແລະ ເອກະສານ',
      phone: '020 2233 4455',
      email: 'champa.acc@netd-it.la',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      status: 'active',
      joinedDate: '2023-08-01',
      address: 'ບ້ານ ສີຫອມ, ເມືອງ ຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ',
      salary: 7500000,
      notes: 'ດູແລເອກະສານບັນຊີ, ໃບເກັບເງິນ, ພາສີ ແລະ ເງິນເດືອນ'
    },
    {
      id: 'emp_04',
      name: 'ຄຳຫຼ້າ ສຸລິຍະ',
      username: 'khamla',
      password: 'sales123',
      role: 'officer',
      roleName: 'Officer (ພະນັກງານທົ່ວໄປ)',
      position: 'ພະນັກງານຂາຍ ແລະ ປະສານງານ (Sales)',
      phone: '020 9988 7766',
      email: 'khamla.sales@netd-it.la',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      status: 'active',
      joinedDate: '2024-02-15',
      address: 'ບ້ານ ດົງປ່າລານ, ເມືອງ ສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ',
      salary: 6000000,
      notes: 'ປະສານງານລູກຄ້າ, ອອກໃບສະເໜີລາຄາ ແລະ ຂາຍໜ້າຮ້ານ'
    }
  ],

  customers: [
    {
      id: 'cust_01',
      type: 'corporate',
      name: 'ທະນາຄານຮ່ວມພັດທະນາ (JDB Bank)',
      company: 'ທະນາຄານຮ່ວມພັດທະນາ ຈຳກັດ',
      phone: '021 216 555',
      email: 'procurement@jdbbank.la',
      address: 'ສຳນັກງານໃຫຍ່ ຖະໜົນ ລ້ານຊ້າງ, ນະຄອນຫຼວງວຽງຈັນ',
      taxId: 'TAX-JDB-9901',
      totalSpent: 45000000,
      notes: 'ລູກຄ້າສັນຍາບຳລຸງຮັກສາລະບົບ CCTV & Network SLA Gold'
    },
    {
      id: 'cust_02',
      type: 'corporate',
      name: 'ໂຮງແຮມ ລາວ ພາຊາ (Lao Plaza Hotel)',
      company: 'ໂຮງແຮມ ລາວ ພາຊາ ວຽງຈັນ',
      phone: '021 218 800',
      email: 'it@laoplazahotel.com',
      address: 'ຖະໜົນ ສາມແສນໄທ, ເມືອງ ຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ',
      taxId: 'TAX-LPH-4421',
      totalSpent: 78000000,
      notes: 'ຕິດຕັ້ງລະບົບ Wi-Fi UniFi ທົ່ວອາຄານ 200 ຫ້ອງ'
    },
    {
      id: 'cust_03',
      type: 'corporate',
      name: 'ຮ້ານກາເຟ ອາມາໂຊນ ສາຂາ ດົງໂດກ',
      company: 'ບໍລິສັດ ກາເຟອາຊຽນ ຈຳກັດ',
      phone: '020 5511 2233',
      email: 'amazon.dongdok@gmail.com',
      address: 'ບ້ານ ດົງໂດກ, ເມືອງ ໄຊທານີ, ນະຄອນຫຼວງວຽງຈັນ',
      taxId: 'TAX-AMZ-7712',
      totalSpent: 18500000,
      notes: 'ໃຊ້ລະບົບ POS Sunmi + ກ້ອງວົງຈອນປິດ 8 ຈຸດ'
    },
    {
      id: 'cust_04',
      type: 'individual',
      name: 'ທ່ານ ສົມສັກ ວົງສາ',
      company: '',
      phone: '020 9911 4455',
      email: 'somsack.w@gmail.com',
      address: 'ບ້ານ ໜອງບອນ, ເມືອງ ໄຊເສດຖາ, ນະຄອນຫຼວງວຽງຈັນ',
      taxId: '',
      totalSpent: 4200000,
      notes: 'ຕິດຕັ້ງກ້ອງ CCTV ປະຈຳເຮືອນ 4 ໜ່ວຍ'
    },
    {
      id: 'cust_05',
      type: 'individual',
      name: 'ທ່ານ ນາງ ແສງເດືອນ ມະນີວົງ',
      company: '',
      phone: '020 5544 3322',
      email: 'saengduan.m@gmail.com',
      address: 'ບ້ານ ສີຫອມ, ເມືອງ ຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ',
      taxId: '',
      totalSpent: 6500000,
      notes: 'ຊື້ຄອມພິວເຕີ Workstation ແລະ ອຸປະກອນ Network'
    }
  ],

  categories: [
    {
      id: 'cat_cctv',
      code: 'CCTV',
      name: 'ລະບົບກ້ອງວົງຈອນປິດ (CCTV & Security)',
      description: 'ກ້ອງ IP Camera, NVR, PTZ, Switch PoE ແລະ ອຸປະກອນຮັກສາຄວາມປອດໄພ',
      icon: 'fa-video'
    },
    {
      id: 'cat_net',
      code: 'NET',
      name: 'ອຸປະກອນເຄືອຂ່າຍ (Network & WiFi)',
      description: 'Router, Access Point, PoE Switch, Firewall ແລະ ອຸປະກອນສື່ສານ',
      icon: 'fa-network-wired'
    },
    {
      id: 'cat_srv',
      code: 'SRV',
      name: 'ເຄື່ອງຄອມພິວເຕີ ແລະ ເຊີເວີ (Computers & Servers)',
      description: 'Server Rack/Tower, NAS Storage, PC Workstation, UPS',
      icon: 'fa-server'
    },
    {
      id: 'cat_pos',
      code: 'POS',
      name: 'ລະບົບຂາຍໜ້າຮ້ານ (POS & Peripherals)',
      description: 'ເຄື່ອງ POS Touchscreen, ເຄື່ອງພິມໃບບິນ, ເຄື່ອງຍິງບາໂຄດ, ລີ້ນຊັກເກັບເງິນ',
      icon: 'fa-cash-register'
    },
    {
      id: 'cat_cab',
      code: 'CAB',
      name: 'ສາຍສັນຍານ ແລະ ອຸປະກອນຕິດຕັ້ງ (Cabling & Accessories)',
      description: 'ສາຍ LAN CAT6, Fiber Optic, ຕູ້ Rack, Jack RJ45, Patch Panel',
      icon: 'fa-plug'
    }
  ],

  brands: [
    { id: 'br_hik', name: 'Hikvision', logoUrl: '', category: 'ລະບົບກ້ອງວົງຈອນປິດ (CCTV & Security)', contact: 'Hikvision Laos Authorized', warranty: 'ຮັບປະກັນ 24 ເດືອນ' },
    { id: 'br_dahua', name: 'Dahua Technology', logoUrl: '', category: 'ລະບົບກ້ອງວົງຈອນປິດ (CCTV & Security)', contact: 'Dahua Partner Laos', warranty: 'ຮັບປະກັນ 24 ເດືອນ' },
    { id: 'br_ubnt', name: 'Ubiquiti UniFi', logoUrl: '', category: 'ອຸປະກອນເຄືອຂ່າຍ (Network & WiFi)', contact: 'Ubiquiti Laos Official Partner', warranty: 'ຮັບປະກັນ 12 ເດືອນ' },
    { id: 'br_cisco', name: 'Cisco Systems', logoUrl: '', category: 'ອຸປະກອນເຄືອຂ່າຍ (Network & WiFi)', contact: 'Cisco Distributor Indochina', warranty: 'ຮັບປະກັນ 3 ປີ' },
    { id: 'br_mikrotik', name: 'MikroTik RouterBOARD', logoUrl: '', category: 'ອຸປະກອນເຄືອຂ່າຍ (Network & WiFi)', contact: 'MikroTik Certified Distributor', warranty: 'ຮັບປະກັນ 12 ເດືອນ' },
    { id: 'br_dell', name: 'Dell Technologies', logoUrl: '', category: 'ເຄື່ອງຄອມພິວເຕີ ແລະ ເຊີເວີ (Computers & Servers)', contact: 'Dell Laos ProSupport', warranty: 'ຮັບປະກັນ 3 ປີ' },
    { id: 'br_sunmi', name: 'Sunmi POS', logoUrl: '', category: 'ລະບົບຂາຍໜ້າຮ້ານ (POS & Peripherals)', contact: 'Sunmi Southeast Asia', warranty: 'ຮັບປະກັນ 12 ເດືອນ' }
  ],

  suppliers: [
    {
      id: 'sup_01',
      name: 'ບໍລິສັດ ວຽງຈັນ ໄອທີ ຊັບພລາຍ ຈຳກັດ',
      contactPerson: 'ທ່ານ ອານຸສອນ ແສງດາລາ',
      phone: '020 5599 1122',
      email: 'sales@vientiane-itsupply.la',
      address: 'ຖະໜົນ ດົງປ່າລານ, ເມືອງ ສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ',
      terms: 'Credit 30 ວັນ, ສົ່ງສິນຄ້າຟຣີໃນນະຄອນຫຼວງ'
    },
    {
      id: 'sup_02',
      name: 'ບໍລິສັດ ລາວ ເຕັກໂນໂລຢີ ດິສຕຣິບິວເຕີ ຈຳກັດ',
      contactPerson: 'ທ່ານ ບຸນມີ ພົມມະຈັນ',
      phone: '021 334 455',
      email: 'order@lao-tech-dist.la',
      address: 'ເຂດເສດຖະກິດພິເສດ ບຶງທາດຫຼວງ, ນະຄອນຫຼວງວຽງຈັນ',
      terms: 'ຊຳລະກ່ອນ 50%, ຮັບສິນຄ້າຊຳລະ 50%'
    },
    {
      id: 'sup_03',
      name: 'Bangkok Network Solutions Co., Ltd',
      contactPerson: 'Mr. Somchai Prasert',
      phone: '+66 81 234 5678',
      email: 'export@bkk-network.co.th',
      address: 'Bangkok, Thailand',
      terms: 'T/T Advance, ສົ່ງຂ້າມຂົວມິດຕະພາບ 1'
    }
  ],

  // Data tables initialized as clean empty arrays (Live data populated from Cloudflare D1 / Supabase)
  products: [],
  productSerials: [],
  purchaseOrders: [],
  documents: [],
  projects: [],
  tasks: [],
  itJobs: [],
  transactions: [],
  clientSystems: [],
  activityLogs: []
};

// ----------------------------------------------------------------------------
// SUPABASE HELPERS & MAPPINGS
// ----------------------------------------------------------------------------
function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function toCamelCase(str) {
  return str.replace(/_([a-z0-9])/g, (_, g) => g.toUpperCase());
}

function objectToSnake(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const res = {};
  for (const [k, v] of Object.entries(obj)) {
    res[toSnakeCase(k)] = v;
  }
  return res;
}

function objectToCamel(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const res = {};
  for (const [k, v] of Object.entries(obj)) {
    res[toCamelCase(k)] = v;
  }
  return res;
}

function toSnakeForRemote(table, record) {
  if (!record || typeof record !== 'object') return record;
  const snake = objectToSnake(record);

  if (table === 'settings') {
    delete snake.d1_database_id;
    delete snake.sync_mode;
  }

  if (table === 'documents') {
    if (record.items) {
      snake.items_json = typeof record.items === 'string' ? record.items : JSON.stringify(record.items);
    }
    delete snake.items;
    if (snake.valid_until && !snake.due_date) {
      snake.due_date = snake.valid_until;
    }
    delete snake.valid_until;
    if (!snake.customer_id) snake.customer_id = 'cust_walk_in';
    if (!snake.customer_name) snake.customer_name = 'ລູກຄ້າທົ່ວໄປ';
    if (!snake.type && snake.doc_type) snake.type = snake.doc_type;
    if (!snake.doc_type && snake.type) snake.doc_type = snake.type;
    if (snake.total_amount === undefined && snake.grand_total !== undefined) snake.total_amount = snake.grand_total;
    if (snake.grand_total === undefined && snake.total_amount !== undefined) snake.grand_total = snake.total_amount;
    if (snake.subtotal === undefined && snake.grand_total !== undefined) snake.subtotal = snake.grand_total;
  }
  if (table === 'purchase_orders' || table === 'purchaseOrders') {
    if (record.items) {
      snake.items_json = typeof record.items === 'string' ? record.items : JSON.stringify(record.items);
    }
    delete snake.items;
  }
  if (table === 'projects') {
    if (record.milestones) {
      snake.milestones_json = typeof record.milestones === 'string' ? record.milestones : JSON.stringify(record.milestones);
    }
    delete snake.milestones;
    if (!snake.project_code && snake.code) snake.project_code = snake.code;
    if (!snake.code && snake.project_code) snake.code = snake.project_code;
    if (!snake.name && snake.title) snake.name = snake.title;
    if (!snake.title && snake.name) snake.title = snake.name;
    if (!snake.target_date && snake.deadline) snake.target_date = snake.deadline;
  }
  if (table === 'products') {
    if (snake.selling_price === undefined && snake.sale_price !== undefined) snake.selling_price = snake.sale_price;
    if (snake.sale_price === undefined && snake.selling_price !== undefined) snake.sale_price = snake.selling_price;
    if (snake.stock_qty === undefined && snake.stock !== undefined) snake.stock_qty = snake.stock;
    if (snake.stock === undefined && snake.stock_qty !== undefined) snake.stock = snake.stock_qty;
    if (snake.min_stock_alert === undefined && snake.min_stock !== undefined) snake.min_stock_alert = snake.min_stock;
    if (snake.min_stock === undefined && snake.min_stock_alert !== undefined) snake.min_stock = snake.min_stock_alert;
    if (snake.has_sn !== undefined) {
      snake.has_sn = (snake.has_sn === 1 || snake.has_sn === true || snake.has_sn === '1') ? 1 : 0;
    }
  }
  if (table === 'project_tasks' || table === 'tasks') {
    if (!snake.due_date && snake.deadline) snake.due_date = snake.deadline;
  }
  if (table === 'it_jobs' || table === 'itJobs') {
    if (!snake.code && snake.job_code) snake.code = snake.job_code;
    if (!snake.description && snake.issue_description) snake.description = snake.issue_description;
  }
  if (table === 'transactions') {
    if (!snake.ref_doc_id && snake.ref_doc) snake.ref_doc_id = snake.ref_doc;
  }
  if (table === 'activity_logs' || table === 'activityLogs') {
    if (record.user) {
      snake['user'] = record.user;
      snake.user_name = record.user;
    }
  }
  if (table === 'it_job_categories' || table === 'itJobCategories') {
    if (record.key) {
      snake['key'] = record.key;
      snake.category_key = record.key;
    }
  }
  return snake;
}

function normalizeClientRecord(clientKey, raw) {
  if (!raw || typeof raw !== 'object') return raw;
  const item = objectToCamel(raw);

  if (clientKey === 'documents') {
    if (!item.docType && item.type) item.docType = item.type;
    if (!item.type && item.docType) item.type = item.docType;
    if (item.grandTotal === undefined && item.totalAmount !== undefined) item.grandTotal = item.totalAmount;
    if (item.totalAmount === undefined && item.grandTotal !== undefined) item.totalAmount = item.grandTotal;
    if (item.subtotal === undefined && item.grandTotal !== undefined) item.subtotal = item.grandTotal;
    if (item.discount === undefined && item.discountAmount !== undefined) item.discount = item.discountAmount;
    if (item.customerId === undefined && item.customer_id !== undefined) item.customerId = item.customer_id;
    if (!item.customerId) item.customerId = 'cust_walk_in';
    if (item.customerName === 'undefined' || !item.customerName) item.customerName = 'ລູກຄ້າທົ່ວໄປ';
    if (item.itemsJson && (!item.items || !item.items.length)) {
      try { item.items = JSON.parse(item.itemsJson); } catch (e) {}
    }
    if (!Array.isArray(item.items)) item.items = [];
  }
  if (clientKey === 'products') {
    if (item.salePrice === undefined && item.sellingPrice !== undefined) item.salePrice = item.sellingPrice;
    if (item.sellingPrice === undefined && item.salePrice !== undefined) item.sellingPrice = item.salePrice;
    if (item.minStock === undefined && item.minStockAlert !== undefined) item.minStock = item.minStockAlert;
    if (item.minStockAlert === undefined && item.minStock !== undefined) item.minStockAlert = item.minStock;
    if (item.stock === undefined && item.stockQty !== undefined) item.stock = item.stockQty;
    if (item.stockQty === undefined && item.stock !== undefined) item.stockQty = item.stock;
    if (item.hasSn !== undefined) {
      item.hasSn = (item.hasSn === 1 || item.hasSn === true || item.hasSn === '1') ? 1 : 0;
    } else {
      item.hasSn = 1;
    }
    if (item.profitMargin === undefined && item.costPrice > 0 && item.salePrice > 0) {
      item.profitMargin = parseFloat((((item.salePrice - item.costPrice) / item.costPrice) * 100).toFixed(2));
    }
  }
  if (clientKey === 'purchaseOrders') {
    if (item.itemsJson && (!item.items || !item.items.length)) {
      try { item.items = JSON.parse(item.itemsJson); } catch (e) {}
    }
    if (!Array.isArray(item.items)) item.items = [];
  }
  if (clientKey === 'projects') {
    if (!item.code && item.projectCode) item.code = item.projectCode;
    if (!item.projectCode && item.code) item.projectCode = item.code;
    if (!item.title && item.name) item.title = item.name;
    if (!item.deadline && item.targetDate) item.deadline = item.targetDate;
    if (item.milestonesJson && (!item.milestones || !item.milestones.length)) {
      try { item.milestones = JSON.parse(item.milestonesJson); } catch (e) {}
    }
    if (!Array.isArray(item.milestones)) item.milestones = [];
  }
  if (clientKey === 'itJobs') {
    if (!item.jobCode && item.code) item.jobCode = item.code;
    if (!item.issueDescription && item.description) item.issueDescription = item.description;
  }
  if (clientKey === 'tasks') {
    if (!item.deadline && item.dueDate) item.deadline = item.dueDate;
  }
  if (clientKey === 'transactions') {
    if (!item.refDoc && item.refDocId) item.refDoc = item.refDocId;
  }
  if (clientKey === 'activityLogs') {
    if (!item.user && item.userName) item.user = item.userName;
    if (!item.user && item['user']) item.user = item['user'];
  }
  if (clientKey === 'itJobCategories') {
    if (!item.key && item.categoryKey) item.key = item.categoryKey;
    if (!item.key && item['key']) item.key = item['key'];
  }
  return item;
}

function sortByNewest(list) {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;

    // 1. Primary sort key: Date descending (newest date first, e.g. '2026-11-12' > '2026-11-11')
    const dateA = a.date || a.orderDate || a.receivedDate || a.startDate || a.soldDate || a.createdAt || a.created_at || '';
    const dateB = b.date || b.orderDate || b.receivedDate || b.startDate || b.soldDate || b.createdAt || b.created_at || '';
    if (dateA && dateB && dateA !== dateB) {
      const cmp = String(dateB).localeCompare(String(dateA));
      if (cmp !== 0) return cmp;
    } else if (dateA && !dateB) {
      return -1;
    } else if (!dateA && dateB) {
      return 1;
    }

    // 2. Secondary sort key: numeric timestamp embedded in ID (e.g. doc_1794468848432 or 1794468848432)
    const matchA = String(a.id || '').match(/\d{10,14}/);
    const matchB = String(b.id || '').match(/\d{10,14}/);
    if (matchA && matchB && matchA[0] !== matchB[0]) {
      const numA = Number(matchA[0]);
      const numB = Number(matchB[0]);
      if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
        return numB - numA;
      }
    }

    // 3. Tertiary sort key: Document number, PO number, Job code, Code, SKU, or ID in descending natural sort
    const idA = String(a.docNumber || a.poNumber || a.jobCode || a.code || a.sku || a.id || '');
    const idB = String(b.docNumber || b.poNumber || b.jobCode || b.code || b.sku || b.id || '');
    return idB.localeCompare(idA, undefined, { numeric: true });
  });
}

function hasTableDataChanged(prevList, nextList) {
  if (!Array.isArray(prevList) || !Array.isArray(nextList)) return true;
  if (prevList.length !== nextList.length) return true;
  for (let i = 0; i < prevList.length; i++) {
    const a = prevList[i];
    const b = nextList[i];
    if (!a || !b) return true;
    if (a.id !== b.id) return true;
    if (a.status !== b.status) return true;
    const valA = Number(a.grandTotal !== undefined ? a.grandTotal : (a.amount !== undefined ? a.amount : (a.salePrice !== undefined ? a.salePrice : (a.totalAmount !== undefined ? a.totalAmount : 0))));
    const valB = Number(b.grandTotal !== undefined ? b.grandTotal : (b.amount !== undefined ? b.amount : (b.salePrice !== undefined ? b.salePrice : (b.totalAmount !== undefined ? b.totalAmount : 0))));
    if (valA !== valB) return true;
    if ((a.date || a.orderDate || '') !== (b.date || b.orderDate || '')) return true;
    if ((a.customerName || a.supplierName || a.name || '') !== (b.customerName || b.supplierName || b.name || '')) return true;
    if ((a.stock !== undefined ? a.stock : -1) !== (b.stock !== undefined ? b.stock : -1)) return true;
    if ((a.profit !== undefined ? a.profit : -1) !== (b.profit !== undefined ? b.profit : -1)) return true;
  }
  return false;
}

function safeMergeRecords(currentLocalList, remoteList, deletedSet) {
  const remoteIds = new Set();
  const remoteDocNums = new Set();
  const remotePoNums = new Set();
  const mergedList = [];
  const unsyncedLocals = [];

  (remoteList || []).forEach(rem => {
    if (rem && rem.id) {
      remoteIds.add(rem.id);
      if (rem.docNumber) remoteDocNums.add(rem.docNumber);
      if (rem.poNumber) remotePoNums.add(rem.poNumber);
      mergedList.push(rem);
    }
  });

  if (Array.isArray(currentLocalList)) {
    currentLocalList.forEach(loc => {
      if (!loc || !loc.id) return;
      if (deletedSet && deletedSet.has(loc.id)) return;
      if (loc.docNumber && deletedSet && deletedSet.has(loc.docNumber)) return;
      if (loc.poNumber && deletedSet && deletedSet.has(loc.poNumber)) return;

      const isDuplicate = remoteIds.has(loc.id) ||
                          (loc.docNumber && remoteDocNums.has(loc.docNumber)) ||
                          (loc.poNumber && remotePoNums.has(loc.poNumber));
      if (!isDuplicate) {
        mergedList.push(loc);
        unsyncedLocals.push(loc);
        remoteIds.add(loc.id);
        if (loc.docNumber) remoteDocNums.add(loc.docNumber);
        if (loc.poNumber) remotePoNums.add(loc.poNumber);
      }
    });
  }

  const sortedList = sortByNewest(mergedList);
  sortedList.unsyncedLocals = unsyncedLocals;
  sortedList.hasUnsyncedLocal = unsyncedLocals.length > 0;
  return sortedList;
}

const SUPABASE_TABLES = {
  settings: 'settings',
  employees: 'employees',
  customers: 'customers',
  categories: 'categories',
  brands: 'brands',
  suppliers: 'suppliers',
  products: 'products',
  productSerials: 'product_serials',
  purchaseOrders: 'purchase_orders',
  documents: 'documents',
  projectCategories: 'project_categories',
  projects: 'projects',
  tasks: 'project_tasks',
  itJobCategories: 'it_job_categories',
  itJobs: 'it_jobs',
  transactions: 'transactions',
  clientSystems: 'client_systems',
  activityLogs: 'activity_logs'
};

const SUPABASE_REVERSE_TABLES = {
  settings: 'settings',
  employees: 'employees',
  customers: 'customers',
  categories: 'categories',
  brands: 'brands',
  suppliers: 'suppliers',
  products: 'products',
  product_serials: 'productSerials',
  purchase_orders: 'purchaseOrders',
  documents: 'documents',
  project_categories: 'projectCategories',
  projects: 'projects',
  project_tasks: 'tasks',
  it_job_categories: 'itJobCategories',
  it_jobs: 'itJobs',
  transactions: 'transactions',
  client_systems: 'clientSystems',
  activity_logs: 'activityLogs'
};

// ----------------------------------------------------------------------------
// DATABASE MANAGER CLASS
// ----------------------------------------------------------------------------
class DatabaseManager {
  constructor() {
    this.sortByNewest = sortByNewest;
    this.data = this.loadLocal();
    this.connectionStatus = 'offline';
    this.listeners = [];
    this.initRealtimeListeners();

    // Auto-connect to Supabase Cloud Database on launch if credentials exist
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const sb = this.getSupabaseClient();
        if (sb) {
          this.setupSupabaseRealtime();
          this.pullFromSupabaseQuietly();
        }
      }, 300);
    }
  }

  initRealtimeListeners() {
    if (typeof window !== 'undefined') {
      try {
        if ('BroadcastChannel' in window) {
          this.broadcastChannel = new BroadcastChannel('netd_realtime_sync_channel');
          this.broadcastChannel.onmessage = (event) => {
            if (event.data && event.data.type === 'DB_UPDATED') {
              this.reloadLocalDataSilently();
            }
          };
        }
      } catch (e) {
        console.warn('BroadcastChannel not available:', e);
      }

      window.addEventListener('storage', (e) => {
        if (e.key === DB_STORAGE_KEY && e.newValue) {
          this.reloadLocalDataSilently();
        }
      });
    }
  }

  reloadLocalDataSilently() {
    try {
      const stored = localStorage.getItem(DB_STORAGE_KEY);
      if (stored) {
        this.data = JSON.parse(stored);
        this.listeners.forEach(fn => fn(this.data));
      }
    } catch (e) {}
  }

  getDeletedIds() {
    try {
      const stored = localStorage.getItem('netd_deleted_ids');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  markAsDeleted(id) {
    if (!id) return;
    try {
      const ids = this.getDeletedIds();
      if (!ids.includes(id)) {
        ids.push(id);
        if (ids.length > 500) ids.shift();
        localStorage.setItem('netd_deleted_ids', JSON.stringify(ids));
      }
    } catch (e) {}
  }

  loadLocal() {
    try {
      const stored = localStorage.getItem(DB_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const deletedSet = new Set(this.getDeletedIds());

        // Clean out legacy mock IDs so ghost demo data never lingers in local storage
        const legacyMockIds = new Set([
          'prod_01', 'prod_02', 'prod_03', 'prod_04', 'prod_05', 'prod_06', 'prod_07', 'prod_08',
          'sn_01', 'sn_02', 'sn_03', 'sn_04', 'sn_05', 'sn_06', 'sn_07', 'sn_08',
          'proj_01', 'proj_02', 'proj_03',
          'task_01', 'task_02', 'task_03',
          'job_01', 'job_02', 'job_03', 'job_04',
          'doc_qt_01', 'doc_inv_01', 'doc_pos_01',
          'tx_01', 'tx_02', 'tx_03', 'tx_04', 'tx_05', 'tx_06'
        ]);

        if (parsed.employees && Array.isArray(parsed.employees)) {
          const adminEmp = parsed.employees.find(e => e.username && e.username.toLowerCase() === 'admin');
          if (adminEmp && (adminEmp.password === 'admin123' || adminEmp.password === '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9')) {
            adminEmp.password = 'p@ss4admin';
            delete adminEmp.passwordHash;
          }
        }

        if (parsed.products && Array.isArray(parsed.products)) {
          parsed.products = parsed.products.filter(p => p && !legacyMockIds.has(p.id) && !deletedSet.has(p.id));
        }

        if (parsed.productSerials && Array.isArray(parsed.productSerials)) {
          parsed.productSerials = parsed.productSerials.filter(s => s && !legacyMockIds.has(s.id) && !deletedSet.has(s.id));
        }

        if (parsed.projects && Array.isArray(parsed.projects)) {
          parsed.projects = parsed.projects.filter(p => p && !legacyMockIds.has(p.id) && !deletedSet.has(p.id));
        }

        if (parsed.tasks && Array.isArray(parsed.tasks)) {
          parsed.tasks = parsed.tasks.filter(t => t && !legacyMockIds.has(t.id) && !deletedSet.has(t.id));
        }

        if (parsed.itJobs && Array.isArray(parsed.itJobs)) {
          parsed.itJobs = parsed.itJobs.filter(j => j && !legacyMockIds.has(j.id) && !deletedSet.has(j.id));
        }

        // Migrate PO documents to ensure docType is 'po'
        if (parsed.documents && Array.isArray(parsed.documents)) {
          parsed.documents.forEach(d => {
            if (d.docNumber && d.docNumber.startsWith('PO-') && d.docType !== 'po') {
              d.docType = 'po';
            }
          });
          parsed.documents = parsed.documents.filter(d => d && !legacyMockIds.has(d.id) && !deletedSet.has(d.id) && !deletedSet.has(d.docNumber));
        }

        if (parsed.transactions && Array.isArray(parsed.transactions)) {
          parsed.transactions = parsed.transactions.filter(t => t && !legacyMockIds.has(t.id) && !deletedSet.has(t.id));
        }

        if (parsed.brands && Array.isArray(parsed.brands)) {
          const brandCatMap = {
            'CCTV & Security': 'ລະບົບກ້ອງວົງຈອນປິດ (CCTV & Security)',
            'Network & Wireless': 'ອຸປະກອນເຄືອຂ່າຍ (Network & WiFi)',
            'Enterprise Network': 'ອຸປະກອນເຄືອຂ່າຍ (Network & WiFi)',
            'Routers & Switches': 'ອຸປະກອນເຄືອຂ່າຍ (Network & WiFi)',
            'Server & PC': 'ເຄື່ອງຄອມພິວເຕີ ແລະ ເຊີເວີ (Computers & Servers)',
            'POS Systems': 'ລະບົບຂາຍໜ້າຮ້ານ (POS & Peripherals)'
          };
          parsed.brands.forEach(b => {
            if (b && brandCatMap[b.category]) {
              b.category = brandCatMap[b.category];
            }
          });
        }

        if (parsed.purchaseOrders && Array.isArray(parsed.purchaseOrders)) {
          parsed.purchaseOrders = parsed.purchaseOrders.filter(p => !deletedSet.has(p.id) && !deletedSet.has(p.poNumber));
        }

        if (parsed.clientSystems && Array.isArray(parsed.clientSystems)) {
          parsed.clientSystems = parsed.clientSystems.filter(s => !deletedSet.has(s.id));
        }

        return {
          ...DEFAULT_DATABASE,
          ...parsed,
          settings: { 
            ...DEFAULT_DATABASE.settings, 
            ...(parsed.settings || {}),
            supabaseUrl: (parsed.settings && parsed.settings.supabaseUrl || (typeof localStorage !== 'undefined' ? localStorage.getItem('netd_supabase_url') : '') || DEFAULT_DATABASE.settings.supabaseUrl || '').trim(),
            supabaseAnonKey: (parsed.settings && parsed.settings.supabaseAnonKey || (typeof localStorage !== 'undefined' ? localStorage.getItem('netd_supabase_key') : '') || DEFAULT_DATABASE.settings.supabaseAnonKey || '').trim(),
            d1WorkerUrl: (parsed.settings && parsed.settings.d1WorkerUrl && !parsed.settings.d1WorkerUrl.includes('netd-manage-web.netditsolutions.workers.dev') && !parsed.settings.d1WorkerUrl.includes('vercel.app')) 
              ? parsed.settings.d1WorkerUrl.trim() 
              : 'https://netd-manage-webapp.netditsolutions.workers.dev'
          },
          itJobs: Array.isArray(parsed.itJobs) ? parsed.itJobs : [],
          itJobCategories: Array.isArray(parsed.itJobCategories) ? parsed.itJobCategories : DEFAULT_DATABASE.itJobCategories,
          projectCategories: Array.isArray(parsed.projectCategories) ? parsed.projectCategories : DEFAULT_DATABASE.projectCategories,
          projects: Array.isArray(parsed.projects) ? parsed.projects : [],
          tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
          products: Array.isArray(parsed.products) ? parsed.products : [],
          productSerials: Array.isArray(parsed.productSerials) ? parsed.productSerials : [],
          documents: Array.isArray(parsed.documents) ? parsed.documents : [],
          transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
          clientSystems: Array.isArray(parsed.clientSystems) ? parsed.clientSystems : [],
          purchaseOrders: Array.isArray(parsed.purchaseOrders) ? parsed.purchaseOrders : []
        };
      }
    } catch (e) {
      console.error('Failed to parse local database:', e);
    }
    this.saveLocal(DEFAULT_DATABASE);
    return JSON.parse(JSON.stringify(DEFAULT_DATABASE));
  }

  saveLocal(data) {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(data || this.data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  notify(skipCloudSync = false, fromRemote = false) {
    this.saveLocal();
    this.listeners.forEach(fn => fn(this.data));
    if (!fromRemote && this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: 'DB_UPDATED', timestamp: Date.now() });
      } catch (e) {}
    }
    if (!skipCloudSync) {
      this.scheduleCloudSync();
    }
  }

  scheduleCloudSync() {
    if (this._syncTimer) clearTimeout(this._syncTimer);
    this._syncTimer = setTimeout(async () => {
      if (navigator.onLine && !this._isSyncing) {
        this._isSyncing = true;
        try {
          if (this.getSupabaseClient()) {
            await this.pushAllToSupabase();
          } else if (this.getWorkerUrl()) {
            await this.syncWithCloudflareD1();
          }
        } catch (e) {
          console.warn('Auto cloud sync notice:', e.message);
        } finally {
          this._isSyncing = false;
        }
      }
    }, 1500);
  }

  async syncRecordToRemote(table, record) {
    if (!record || !record.id || !navigator.onLine) return { success: false, reason: 'offline' };

    // 1. Supabase direct upsert (Primary)
    const sb = this.getSupabaseClient();
    if (sb) {
      const dbTable = SUPABASE_TABLES[table] || table;
      const snakeRow = toSnakeForRemote(dbTable, record);
      try {
        await sb.from(dbTable).upsert(snakeRow, { onConflict: 'id' });
        return { success: true, mode: 'supabase' };
      } catch (err) {
        console.warn(`Supabase upsert error for ${dbTable}:`, err);
        return { success: false, error: err.message };
      }
    }

    // 2. Cloudflare D1 direct upsert
    const workerUrl = this.getWorkerUrl();
    if (workerUrl) {
      const dbTable = SUPABASE_TABLES[table] || table;
      try {
        const syncRes = await fetch(`${workerUrl.replace(/\/+$/, '')}/api/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table: dbTable, rows: [record] })
        });
        if (!syncRes.ok) {
          const errData = await syncRes.json().catch(() => ({}));
          console.warn(`Cloudflare D1 sync failed for ${dbTable} (HTTP ${syncRes.status}):`, errData.error || syncRes.statusText);
          return { success: false, status: syncRes.status, error: errData.error || syncRes.statusText };
        }
        return { success: true, mode: 'cloudflare_d1' };
      } catch (e) {
        console.warn(`Cloudflare D1 sync error for ${dbTable}:`, e);
        return { success: false, error: e.message };
      }
    }
    return { success: false, reason: 'no_worker_url' };
  }

  async deleteFromRemote(table, id) {
    if (!id || !navigator.onLine) return;
    this.markAsDeleted(id);

    // 1. Supabase direct delete
    const sb = this.getSupabaseClient();
    if (sb) {
      const dbTable = SUPABASE_TABLES[table] || table;
      try {
        await sb.from(dbTable).delete().eq('id', id);
        return;
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    // 2. Cloudflare D1 fallback
    const workerUrl = this.getWorkerUrl();
    if (workerUrl) {
      try {
        await fetch(`${workerUrl.replace(/\/+$/, '')}/api/delete/${table}/${encodeURIComponent(id)}`, {
          method: 'POST'
        });
      } catch (e) {}
    }
  }

  // --------------------------------------------------------------------------
  // SUPABASE CLIENT & REALTIME INTEGRATION
  // --------------------------------------------------------------------------
  cleanSupabaseUrl(url) {
    if (!url) return '';
    let u = String(url).trim();
    u = u.replace(/\/+$/, '');
    u = u.replace(/\/rest\/v\d+.*$/i, '');
    u = u.replace(/\/rest.*$/i, '');
    return u;
  }

  getSupabaseClient() {
    if (typeof window === 'undefined' || !window.supabase) return null;
    let url = (this.data && this.data.settings && this.data.settings.supabaseUrl || (typeof localStorage !== 'undefined' ? localStorage.getItem('netd_supabase_url') : '') || '').trim();
    const key = (this.data && this.data.settings && this.data.settings.supabaseAnonKey || (typeof localStorage !== 'undefined' ? localStorage.getItem('netd_supabase_key') : '') || '').trim();
    url = this.cleanSupabaseUrl(url);
    if (!url || !key) return null;

    if (this.supabase && this._cachedSbUrl === url && this._cachedSbKey === key) {
      return this.supabase;
    }

    try {
      this.supabase = window.supabase.createClient(url, key);
      this._cachedSbUrl = url;
      this._cachedSbKey = key;
      return this.supabase;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  async initSupabase(url = null, anonKey = null) {
    this.supabase = null;
    if (url) {
      url = this.cleanSupabaseUrl(url);
      this.data.settings.supabaseUrl = url;
      if (typeof localStorage !== 'undefined') localStorage.setItem('netd_supabase_url', url);
    }
    if (anonKey) {
      this.data.settings.supabaseAnonKey = anonKey.trim();
      if (typeof localStorage !== 'undefined') localStorage.setItem('netd_supabase_key', anonKey.trim());
    }
    this.saveLocal();

    const sb = this.getSupabaseClient();
    if (!sb) {
      return { success: false, message: 'ຍັງບໍ່ທັນມີ Supabase URL ຫຼື Anon Key' };
    }

    try {
      this.updateStatusDot('loading');
      const { data, error } = await sb.from('settings').select('id').limit(1);
      if (error) throw error;

      this.connectionStatus = 'online';
      this.updateStatusDot('online');

      this.setupSupabaseRealtime();
      this.pullFromSupabaseQuietly();

      return {
        success: true,
        message: 'ເຊື່ອມຕໍ່ Supabase Cloud Database ສຳເລັດແລ້ວ! Realtime Active.'
      };
    } catch (err) {
      this.connectionStatus = 'offline';
      this.updateStatusDot('offline');
      return { success: false, error: err.message };
    }
  }

  setupSupabaseRealtime() {
    const sb = this.getSupabaseClient();
    if (!sb) return;

    try {
      if (this.realtimeChannel) {
        sb.removeChannel(this.realtimeChannel);
      }

      this.realtimeChannel = sb.channel('netd-realtime-sync')
        .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
          this.handleSupabaseRealtimeEvent(payload);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            this.updateStatusDot('online');
          }
        });
    } catch (e) {
      console.warn('Failed to subscribe to Supabase realtime:', e);
    }
  }

  handleSupabaseRealtimeEvent(payload) {
    if (!payload || !payload.table) return;
    const table = payload.table;
    const clientKey = SUPABASE_REVERSE_TABLES[table];
    if (!clientKey) return;

    const eventType = payload.eventType; // 'INSERT', 'UPDATE', 'DELETE'
    const newRecord = payload.new ? normalizeClientRecord(clientKey, payload.new) : null;
    const oldRecord = payload.old ? normalizeClientRecord(clientKey, payload.old) : null;

    if (clientKey === 'settings') {
      if (newRecord) {
        this.data.settings = { ...this.data.settings, ...newRecord };
        this.notify(true, true);
      }
      return;
    }

    if (!this.data[clientKey]) this.data[clientKey] = [];
    if (!Array.isArray(this.data[clientKey])) return;

    if (eventType === 'INSERT' && newRecord) {
      const idx = this.data[clientKey].findIndex(item => item.id === newRecord.id);
      if (idx === -1) {
        this.data[clientKey].push(newRecord);
      } else {
        this.data[clientKey][idx] = { ...this.data[clientKey][idx], ...newRecord };
      }
      this.data[clientKey] = sortByNewest(this.data[clientKey]);
      this.notify(true, true);
    } else if (eventType === 'UPDATE' && newRecord) {
      const idx = this.data[clientKey].findIndex(item => item.id === newRecord.id);
      if (idx !== -1) {
        this.data[clientKey][idx] = { ...this.data[clientKey][idx], ...newRecord };
      } else {
        this.data[clientKey].push(newRecord);
      }
      this.data[clientKey] = sortByNewest(this.data[clientKey]);
      this.notify(true, true);
    } else if (eventType === 'DELETE' && oldRecord && oldRecord.id) {
      this.data[clientKey] = this.data[clientKey].filter(item => item.id !== oldRecord.id);
      this.notify(true, true);
    }
  }

  async pushAllToSupabase() {
    const sb = this.getSupabaseClient();
    if (!sb) {
      return { success: false, message: 'ກະລຸນາຕັ້ງຄ່າ Supabase URL ແລະ Anon Key ກ່ອນ' };
    }

    try {
      this.updateStatusDot('loading');
      let totalSynced = 0;

      for (const [clientKey, dbTable] of Object.entries(SUPABASE_TABLES)) {
        if (clientKey === 'settings') {
          const sRow = toSnakeForRemote('settings', this.data.settings || {});
          if (!sRow.id) sRow.id = 'setting_01';
          await sb.from('settings').upsert(sRow, { onConflict: 'id' });
          totalSynced++;
          continue;
        }

        const rows = this.data[clientKey] || [];
        if (!Array.isArray(rows) || rows.length === 0) continue;

        const snakeRows = rows.map(r => toSnakeForRemote(dbTable, r));
        const chunkSize = 50;
        for (let i = 0; i < snakeRows.length; i += chunkSize) {
          const chunk = snakeRows.slice(i, i + chunkSize);
          const { error } = await sb.from(dbTable).upsert(chunk, { onConflict: 'id' });
          if (error) {
            console.warn(`Upsert chunk error for ${dbTable}:`, error);
            for (const singleRow of chunk) {
              const { error: singleErr } = await sb.from(dbTable).upsert(singleRow, { onConflict: 'id' });
              if (singleErr) {
                console.warn(`Upsert single row error for ${dbTable} (${singleRow.id}):`, singleErr);
              }
            }
          }
        }
        totalSynced += rows.length;
      }

      this.data.settings.lastSync = new Date().toISOString();
      this.saveLocal();
      this.updateStatusDot('online');
      return {
        success: true,
        message: 'ຊິ້ງຂໍ້ມູນທັງໝົດຂຶ້ນ Supabase ສຳເລັດແລ້ວ! (Realtime ເຮັດວຽກ)',
        totalSynced
      };
    } catch (err) {
      this.updateStatusDot('offline');
      return { success: false, error: err.message };
    }
  }

  async pullAllFromSupabase() {
    const sb = this.getSupabaseClient();
    if (!sb) {
      return { success: false, message: 'ກະລຸນາຕັ້ງຄ່າ Supabase URL ແລະ Anon Key ກ່ອນ' };
    }

    try {
      this.updateStatusDot('loading');
      const deletedSet = new Set(this.getDeletedIds());
      let anyUnsynced = false;

      for (const [clientKey, dbTable] of Object.entries(SUPABASE_TABLES)) {
        if (clientKey === 'settings') {
          const { data } = await sb.from('settings').select('*').limit(1);
          if (data && data.length > 0) {
            const cleanRemote = {};
            for (const [k, v] of Object.entries(objectToCamel(data[0]))) {
              if (v !== null && v !== undefined && v !== '') {
                cleanRemote[k] = v;
              }
            }
            this.data.settings = { ...this.data.settings, ...cleanRemote };
          }
          continue;
        }

        const { data, error } = await sb.from(dbTable).select('*');
        if (!error && Array.isArray(data)) {
          const normalizedRemote = data
            .map(r => normalizeClientRecord(clientKey, r))
            .filter(item => item && !deletedSet.has(item.id) && !deletedSet.has(item.docNumber) && !deletedSet.has(item.poNumber));

          const prevLocal = this.data[clientKey] || [];
          const merged = safeMergeRecords(prevLocal, normalizedRemote, deletedSet);

          if (merged.hasUnsyncedLocal) {
            anyUnsynced = true;
            for (const loc of merged.unsyncedLocals) {
              await this.syncRecordToRemote(clientKey, loc).catch(() => {});
            }
          }

          this.data[clientKey] = merged;
        }
      }

      this.saveLocal();
      this.notify(true, true);
      this.updateStatusDot('online');

      if (anyUnsynced) {
        this.scheduleCloudSync();
      }

      return { success: true, message: 'ດຶງຂໍ້ມູນຫຼ້າສຸດຈາກ Supabase ສຳເລັດແລ້ວ' };
    } catch (err) {
      this.updateStatusDot('offline');
      return { success: false, error: err.message };
    }
  }

  async pullFromSupabaseQuietly() {
    if (!navigator.onLine) return;
    const sb = this.getSupabaseClient();
    if (!sb) return;
    try {
      const deletedSet = new Set(this.getDeletedIds());
      let anyChanged = false;
      let anyUnsynced = false;

      for (const [clientKey, dbTable] of Object.entries(SUPABASE_TABLES)) {
        if (clientKey === 'settings') continue;
        const { data, error } = await sb.from(dbTable).select('*');
        if (!error && Array.isArray(data)) {
          const normalizedRemote = data
            .map(r => normalizeClientRecord(clientKey, r))
            .filter(item => item && !deletedSet.has(item.id) && !deletedSet.has(item.docNumber) && !deletedSet.has(item.poNumber));

          const prevLocal = this.data[clientKey] || [];
          const merged = safeMergeRecords(prevLocal, normalizedRemote, deletedSet);

          if (merged.hasUnsyncedLocal) {
            anyUnsynced = true;
            merged.unsyncedLocals.forEach(loc => {
              this.syncRecordToRemote(clientKey, loc).catch(() => {});
            });
          }

          if (hasTableDataChanged(prevLocal, merged)) {
            anyChanged = true;
          }

          this.data[clientKey] = merged;
        }
      }

      if (anyChanged) {
        this.saveLocal();
        this.notify(true, true);
      }
      this.updateStatusDot('online');

      if (anyUnsynced) {
        this.scheduleCloudSync();
      }
    } catch (e) {}
  }

  getWorkerUrl() {
    // 1. If user explicitly stored a worker URL in localStorage, prioritize it
    const stored = (typeof localStorage !== 'undefined' ? localStorage.getItem('netd_worker_url') : '') || '';
    if (stored && !stored.includes('vercel.app')) {
      const cleanStored = stored.trim().replace(/\/+$/, '');
      if (this.data && this.data.settings) this.data.settings.d1WorkerUrl = cleanStored;
      return cleanStored;
    }

    // 2. If running directly on a Cloudflare Worker or Pages domain or custom domain (NOT localhost, 127.0.0.1, github.io, or vercel.app)
    if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
      const host = window.location.hostname;
      if (host !== 'localhost' && host !== '127.0.0.1' && !host.endsWith('github.io') && !host.endsWith('vercel.app')) {
        const originUrl = window.location.origin.replace(/\/+$/, '');
        if (this.data && this.data.settings) this.data.settings.d1WorkerUrl = originUrl;
        return originUrl;
      }
    }

    // 3. Check settings
    let url = (this.data && this.data.settings && this.data.settings.d1WorkerUrl || '').trim().replace(/\/+$/, '');
    if (url && !url.includes('netd-manage-web.netditsolutions.workers.dev') && !url.includes('vercel.app')) {
      return url;
    }

    return 'https://netd-manage-webapp.netditsolutions.workers.dev';
  }

  subscribe(fn) {
    this.listeners.push(fn);
  }

  // --------------------------------------------------------------------------
  // CONTINUOUS SKU GENERATOR (SKU Generator ອັດຕະໂນມັດແບບຕໍ່ເນື່ອງ)
  // --------------------------------------------------------------------------
  generateNextSku(categoryId = null) {
    const products = this.data.products || [];
    let prefix = 'IT';

    if (categoryId) {
      const cat = this.data.categories.find(c => c.id === categoryId);
      if (cat && cat.code) {
        prefix = cat.code.toUpperCase().replace(/[^A-Z0-9]/g, '');
      }
    }

    // Filter products matching this prefix
    let maxNum = 0;
    const regex = new RegExp(`^${prefix}-(\\d+)`, 'i');

    products.forEach(p => {
      const match = (p.sku || '').match(regex);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });

    const nextNum = maxNum + 1;
    return `${prefix}-${nextNum.toString().padStart(4, '0')}`;
  }

  // --------------------------------------------------------------------------
  // DATABASE CONNECTION TEST & SYNC
  // --------------------------------------------------------------------------
  async testConnection(workerUrl = null) {
    // 1. If Supabase client exists, test Supabase!
    const sb = this.getSupabaseClient();
    if (sb) {
      this.connectionStatus = 'loading';
      this.updateStatusDot('loading');
      try {
        const startTime = performance.now();
        const { data, error } = await sb.from('settings').select('id').limit(1);
        if (error) throw error;
        const latency = Math.round(performance.now() - startTime);
        this.connectionStatus = 'online';
        this.updateStatusDot('online');
        return {
          online: true,
          mode: 'supabase_realtime',
          message: 'Supabase Database ເຊື່ອມຕໍ່ສຳເລັດແລ້ວ! Realtime Active.',
          latency,
          sqlite_version: 'Supabase PostgreSQL Cloud Engine'
        };
      } catch (err) {
        this.connectionStatus = 'offline';
        this.updateStatusDot('offline');
        return {
          online: false,
          error: err.message,
          message: `ບໍ່ສາມາດເຊື່ອມຕໍ່ Supabase ໄດ້ (${err.message})`
        };
      }
    }

    // 2. Fallback to Cloudflare Worker D1
    let targetUrl = (workerUrl || this.getWorkerUrl() || '').trim();
    this.connectionStatus = 'loading';
    this.updateStatusDot('loading');

    if (!targetUrl) {
      this.connectionStatus = 'offline';
      this.updateStatusDot('offline');
      return {
        online: false,
        mode: 'local_database',
        message: 'ຍັງບໍ່ທັນມີ Supabase URL ຫຼື Cloudflare Worker URL. ກະລຸນາຕັ້ງຄ່າໃນໜ້າຕັ້ງຄ່າລະບົບ (Settings).',
        latency: 0,
        sqlite_version: 'Local Browser Engine'
      };
    }

    try {
      const startTime = performance.now();
      const endpoint = targetUrl.replace(/\/+$/, '') + '/api/ping';
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(6000)
      });
      const latency = Math.round(performance.now() - startTime);

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error('URL ທີ່ປ້ອນແມ່ນ URL ຂອງໜ້າເວັບ (Frontend), ບໍ່ແມ່ນ Worker API.');
        }
        const result = await response.json();
        this.connectionStatus = 'online';
        this.updateStatusDot('online');
        return {
          online: true,
          mode: 'cloudflare_d1',
          message: 'Cloudflare D1 ເຊື່ອມຕໍ່ສຳເລັດແລ້ວ! ຖານຂໍ້ມູນພ້ອມໃຊ້ງານ.',
          latency,
          server_time: result.server_time,
          sqlite_version: result.sqlite_version || 'Cloudflare D1 SQLite Engine'
        };
      } else if (response.status === 404) {
        throw new Error(`Server returned HTTP 404 ທີ່ ${endpoint}.`);
      } else {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
    } catch (err) {
      this.connectionStatus = 'offline';
      this.updateStatusDot('offline');
      return {
        online: false,
        error: err.message,
        message: `ບໍ່ສາມາດເຊື່ອມຕໍ່ຖານຂໍ້ມູນໄດ້ (${err.message})`
      };
    }
  }

  updateStatusDot(status) {
    const dot = document.getElementById('db-status-dot');
    const text = document.getElementById('db-status-text');
    const title = document.getElementById('db-sidebar-title');
    if (!dot) return;

    dot.className = `status-dot ${status}`;
    const isSupabase = Boolean(this.getSupabaseClient());
    const label = isSupabase ? 'Supabase' : 'Cloudflare D1';
    if (title) title.textContent = `${label} DB`;
    if (text) {
      if (status === 'online') text.textContent = `${label} Online`;
      else if (status === 'offline') text.textContent = `${label} Offline`;
      else if (status === 'loading') text.textContent = 'ກຳລັງກວດສອບ...';
    }
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------------------------------
  getCurrentUser() {
    const userStr = sessionStorage.getItem('netd_current_user');
    if (userStr) {
      try { return JSON.parse(userStr); } catch (e) {}
    }
    return null;
  }

  async login(username, password) {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const hash = await this.hashPassword(cleanPass);

    // Admin password fallback to prevent accidental lockout
    const isAdminFallback = cleanUser === 'admin' && [
      'p@ss4admin',
      'admin123',
      'admin',
      'pass4admin',
      '123456'
    ].includes(cleanPass);

    const emp = this.data.employees.find(e => {
      if ((e.username || '').toLowerCase() !== cleanUser) return false;
      if (isAdminFallback) return true;
      return (
        e.password === cleanPass ||
        e.password === hash ||
        (e.passwordHash && e.passwordHash === hash)
      );
    });

    if (emp) {
      if (emp.status === 'resigned') {
        return { success: false, message: 'ບັນຊີນີ້ຖືກປິດການໃຊ້ງານແລ້ວ (ພະນັກງານລາອອກ)' };
      }
      // Update password hash automatically
      emp.password = hash;
      this.saveLocal();
      sessionStorage.setItem('netd_current_user', JSON.stringify(emp));
      this.logActivity(emp.name, 'ເຂົ້າສູ່ລະບົບ', 'ຄວາມປອດໄພ', `ເຂົ້າສູ່ລະບົບສຳເລັດ (${emp.role})`);
      return { success: true, user: emp };
    }
    return { 
      success: false, 
      message: 'ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ!' 
    };
  }

  logout() {
    const user = this.getCurrentUser();
    if (user) {
      this.logActivity(user.name, 'ອອກຈາກລະບົບ', 'ຄວາມປອດໄພ', `ອອກຈາກລະບົບ`);
    }
    sessionStorage.removeItem('netd_current_user');
  }

  async changePassword(userId, oldPassword, newPassword) {
    const emp = this.data.employees.find(e => e.id === userId);
    if (!emp) return { success: false, message: 'ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້ງານ' };

    const oldHash = await this.hashPassword(oldPassword);
    const isValid = (emp.password === oldPassword || emp.password === oldHash || emp.passwordHash === oldHash);
    if (!isValid) {
      return { success: false, message: 'ລະຫັດຜ່ານເດີມບໍ່ຖືກຕ້ອງ!' };
    }

    const newHash = await this.hashPassword(newPassword);
    emp.password = newHash;
    emp.passwordHash = newHash;
    this.saveLocal();
    this.notify();
    this.logActivity(emp.name, 'ປ່ຽນລະຫັດຜ່ານ', 'ຄວາມປອດໄພ', 'ປ່ຽນລະຫັດຜ່ານສຳເລັດ');
    return { success: true, message: 'ປ່ຽນລະຫັດຜ່ານສຳເລັດຮຽບຮ້ອຍແລ້ວ!' };
  }

  logActivity(user, action, module, details) {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    this.data.activityLogs.unshift({
      id: 'act_' + Date.now(),
      user: user || 'ລະບົບ',
      action,
      module,
      details,
      time: `ມື້ນີ້ ${timeStr}`
    });
    if (this.data.activityLogs.length > 30) this.data.activityLogs.pop();
    this.saveLocal();
  }

  // --------------------------------------------------------------------------
  // PRODUCTS & INVENTORY CRUD
  // --------------------------------------------------------------------------
  getCategories() {
    return this.data.categories;
  }

  addCategory(category) {
    category.id = 'cat_' + Date.now();
    this.data.categories.push(category);
    this.syncRecordToRemote('categories', category);
    this.notify();
    return category;
  }

  updateCategory(id, updated) {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      const oldCat = this.data.categories[idx];
      const oldName = oldCat.name;
      this.data.categories[idx] = { ...oldCat, ...updated };
      
      // If category name was updated, update matching brands and products
      if (updated.name && updated.name !== oldName) {
        if (Array.isArray(this.data.brands)) {
          this.data.brands.forEach(b => {
            if (b.category === oldName || b.categoryId === id) {
              b.category = updated.name;
              b.categoryId = id;
              this.syncRecordToRemote('brands', b);
            }
          });
        }
      }

      this.syncRecordToRemote('categories', this.data.categories[idx]);
      this.notify();
    }
  }

  deleteCategory(id) {
    const cat = this.data.categories.find(c => c.id === id);
    const catName = cat ? cat.name : null;
    this.data.categories = this.data.categories.filter(c => c.id !== id);

    // Gracefully clear categoryId or category from products and brands
    if (Array.isArray(this.data.products)) {
      this.data.products.forEach(p => {
        if (p.categoryId === id) {
          p.categoryId = '';
          this.syncRecordToRemote('products', p);
        }
      });
    }
    if (catName && Array.isArray(this.data.brands)) {
      this.data.brands.forEach(b => {
        if (b.categoryId === id || b.category === catName) {
          b.categoryId = '';
          this.syncRecordToRemote('brands', b);
        }
      });
    }

    this.deleteFromRemote('categories', id);
    this.notify();
  }

  getProducts() {
    return sortByNewest(this.data.products || []);
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === id);
  }

  addProduct(product) {
    product.id = 'prod_' + Date.now();
    // Calculate profit margin if not set
    if (product.costPrice > 0 && product.salePrice > 0 && !product.profitMargin) {
      product.profitMargin = parseFloat((((product.salePrice - product.costPrice) / product.costPrice) * 100).toFixed(2));
    }
    this.data.products.push(product);
    this.syncRecordToRemote('products', product);
    this.notify();
    return product;
  }

  updateProduct(id, updated) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      if (updated.costPrice > 0 && updated.salePrice > 0 && updated.profitMargin === undefined) {
        updated.profitMargin = parseFloat((((updated.salePrice - updated.costPrice) / updated.costPrice) * 100).toFixed(2));
      }
      this.data.products[idx] = { ...this.data.products[idx], ...updated };
      this.syncRecordToRemote('products', this.data.products[idx]);
      this.notify();
    }
  }

  deleteProduct(id) {
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.data.productSerials = this.data.productSerials.filter(s => s.productId !== id);
    this.deleteFromRemote('products', id);
    this.notify();
  }

  // SERIAL NUMBERS CRUD
  getSerialsByProduct(productId) {
    return this.data.productSerials.filter(s => s.productId === productId);
  }

  getSerialsInStock(productId) {
    return this.data.productSerials.filter(s => s.productId === productId && s.status === 'in_stock');
  }

  addSerial(serialData) {
    const serial = {
      id: 'sn_' + Date.now() + Math.random().toString(36).substr(2, 4),
      status: 'in_stock',
      receivedDate: new Date().toISOString().split('T')[0],
      ...serialData
    };
    this.data.productSerials.push(serial);
    this.syncRecordToRemote('product_serials', serial);
    this.notify();
    return serial;
  }

  updateSerial(id, updated) {
    const idx = this.data.productSerials.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.data.productSerials[idx] = { ...this.data.productSerials[idx], ...updated };
      this.syncRecordToRemote('product_serials', this.data.productSerials[idx]);
      this.notify();
    }
  }

  deleteSerial(id) {
    const serial = this.data.productSerials.find(s => s.id === id);
    const prodId = serial ? serial.productId : null;
    this.data.productSerials = this.data.productSerials.filter(s => s.id !== id);
    this.deleteFromRemote('product_serials', id);
    if (prodId) {
      const prod = this.getProductById(prodId);
      if (prod && prod.hasSn) {
        prod.stock = this.data.productSerials.filter(s => s.productId === prod.id && s.status === 'in_stock').length;
        prod.stockQty = prod.stock;
        this.syncRecordToRemote('products', prod);
      }
    }
    this.notify();
  }

  stockInSerials(productId, serialNumbers = [], details = {}) {
    const now = new Date().toISOString().split('T')[0];
    const created = [];
    serialNumbers.forEach(sn => {
      const cleanSn = sn.trim();
      if (!cleanSn) return;
      const serial = {
        id: 'sn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        productId,
        serialNumber: cleanSn,
        macAddress: details.macAddress || '',
        status: 'in_stock',
        purchaseOrderId: details.purchaseOrderId || null,
        warrantyMonths: details.warrantyMonths || 12,
        location: details.location || 'ສາງໃຫຍ່',
        receivedDate: details.receivedDate || now,
        notes: details.notes || 'ນຳເຂົ້າສາງ'
      };
      this.data.productSerials.push(serial);
      created.push(serial);
      this.syncRecordToRemote('product_serials', serial);
    });

    // Update product stock count and sync product
    const prod = this.getProductById(productId);
    if (prod) {
      if (prod.hasSn) {
        prod.stock = this.data.productSerials.filter(s => s.productId === prod.id && s.status === 'in_stock').length;
        prod.stockQty = prod.stock;
      }
      this.syncRecordToRemote('products', prod);
    }

    this.notify();
    return created;
  }

  stockOutSerial(serialId, reason = 'sold', invoiceId = null) {
    const serial = this.data.productSerials.find(s => s.id === serialId);
    if (serial) {
      serial.status = reason;
      serial.invoiceId = invoiceId;
      serial.soldDate = new Date().toISOString().split('T')[0];
      this.syncRecordToRemote('product_serials', serial);
      const prod = this.getProductById(serial.productId);
      if (prod) {
        if (prod.hasSn) {
          prod.stock = this.data.productSerials.filter(s => s.productId === prod.id && s.status === 'in_stock').length;
          prod.stockQty = prod.stock;
        }
        this.syncRecordToRemote('products', prod);
      }
      this.notify();
      return true;
    }
    return false;
  }

  // --------------------------------------------------------------------------
  // WARRANTY & SERIAL NUMBER LOOKUP
  // --------------------------------------------------------------------------
  getWarrantyInfo(keyword) {
    if (!keyword) return null;
    const cleanKw = keyword.trim().toLowerCase();

    // 1. Search in productSerials by serialNumber or macAddress
    const serial = this.data.productSerials.find(s => 
      (s.serialNumber && s.serialNumber.toLowerCase() === cleanKw) ||
      (s.macAddress && s.macAddress.toLowerCase() === cleanKw) ||
      (s.id && s.id.toLowerCase() === cleanKw)
    );

    let product = null;
    let customer = null;
    let supplier = null;
    let invoice = null;
    let po = null;

    if (serial) {
      product = this.data.products.find(p => p.id === serial.productId);
      if (serial.invoiceId) {
        invoice = this.data.documents.find(d => d.id === serial.invoiceId || d.docNumber === serial.invoiceId);
      }
      if (serial.purchaseOrderId) {
        po = this.data.purchaseOrders.find(p => p.id === serial.purchaseOrderId || p.poNumber === serial.purchaseOrderId);
      }
      if (invoice && invoice.customerId) {
        customer = this.data.customers.find(c => c.id === invoice.customerId);
      }
      if (po && po.supplierId) {
        supplier = this.data.suppliers.find(s => s.id === po.supplierId);
      } else if (product && product.supplierId) {
        supplier = this.data.suppliers.find(s => s.id === product.supplierId);
      }

      const warrantyMonths = Number(serial.warrantyMonths || (product ? 12 : 12));
      const startDateStr = serial.soldDate || serial.receivedDate || (invoice ? invoice.date : null) || (po ? po.orderDate : null);

      let expiryDate = null;
      let daysRemaining = 0;
      let isExpired = false;

      if (startDateStr) {
        const start = new Date(startDateStr);
        const exp = new Date(start);
        exp.setMonth(exp.getMonth() + warrantyMonths);
        expiryDate = exp.toISOString().split('T')[0];

        const now = new Date();
        const diffMs = exp.getTime() - now.getTime();
        daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        isExpired = daysRemaining < 0;
      }

      return {
        foundType: 'serial',
        serial,
        product,
        customer: customer || (invoice ? { name: invoice.customerName, phone: invoice.customerPhone } : null),
        supplier: supplier || (po ? { name: po.supplierName } : null),
        invoice,
        purchaseOrder: po,
        startDate: startDateStr,
        warrantyMonths,
        expiryDate,
        daysRemaining,
        isExpired
      };
    }

    // 2. Search in products by SKU, model, or name
    product = this.data.products.find(p => 
      (p.sku && p.sku.toLowerCase() === cleanKw) ||
      (p.model && p.model.toLowerCase() === cleanKw) ||
      (p.name && p.name.toLowerCase().includes(cleanKw))
    );

    if (product) {
      if (product.supplierId) {
        supplier = this.data.suppliers.find(s => s.id === product.supplierId);
      }
      const serials = this.data.productSerials.filter(s => s.productId === product.id);
      return {
        foundType: 'product',
        product,
        supplier,
        serialsCount: serials.length,
        inStockCount: serials.filter(s => s.status === 'in_stock').length,
        soldCount: serials.filter(s => s.status === 'sold').length,
        serials
      };
    }

    return null;
  }


  dispatchSerial(productId, invoiceId = null) {
    const serial = this.data.productSerials.find(s => s.productId === productId && s.status === 'in_stock');
    if (serial) {
      serial.status = 'sold';
      serial.invoiceId = invoiceId;
      serial.soldDate = new Date().toISOString().split('T')[0];
      this.syncRecordToRemote('product_serials', serial);
      const prod = this.getProductById(productId);
      if (prod && prod.hasSn) {
        prod.stock = this.data.productSerials.filter(s => s.productId === prod.id && s.status === 'in_stock').length;
        prod.stockQty = prod.stock;
        this.syncRecordToRemote('products', prod);
      }
      this.notify();
      return serial;
    }
    return null;
  }

  deductProductStock(productId, qty = 1, refDoc = null) {
    const prod = this.getProductById(productId);
    if (!prod) return false;

    if (prod.hasSn) {
      let count = 0;
      for (let i = 0; i < qty; i++) {
        const s = this.dispatchSerial(productId, refDoc);
        if (s) count++;
      }
      return count > 0;
    } else {
      const current = prod.stock !== undefined ? prod.stock : 10;
      prod.stock = Math.max(0, current - qty);
      prod.stockQty = prod.stock;
      this.syncRecordToRemote('products', prod);
      this.notify();
      return true;
    }
  }

  getProductStock(productId) {
    const prod = this.getProductById(productId);
    if (!prod) return 0;
    if (prod.hasSn) {
      return this.data.productSerials.filter(s => s.productId === prod.id && s.status === 'in_stock').length;
    }
    return prod.stock !== undefined ? prod.stock : 10;
  }

  getCategoryStats(categoryId) {
    const catProducts = this.data.products.filter(p => p.categoryId === categoryId);
    const skuCount = catProducts.length;
    let stockQty = 0;
    let valuation = 0;

    catProducts.forEach(prod => {
      if (prod.hasSn) {
        const inStockSerials = this.data.productSerials.filter(
          s => s.productId === prod.id && s.status === 'in_stock'
        );
        stockQty += inStockSerials.length;
        valuation += inStockSerials.length * prod.costPrice;
      } else {
        const qty = prod.stock !== undefined ? prod.stock : 10;
        stockQty += qty;
        valuation += qty * prod.costPrice;
      }
    });

    return { skuCount, stockQty, valuation };
  }

  // --------------------------------------------------------------------------
  // PURCHASE ORDERS CRUD
  // --------------------------------------------------------------------------
  getPurchaseOrders() {
    return sortByNewest(this.data.purchaseOrders || []);
  }

  addPurchaseOrder(po) {
    po.id = po.id || ('po_' + Date.now());
    this.data.purchaseOrders = sortByNewest([po, ...(this.data.purchaseOrders || [])]);

    // Also save as a document file so it can be managed & viewed just like quotation & invoice
    const docPo = {
      id: po.id,
      docNumber: po.poNumber,
      docType: 'po',
      supplierId: po.supplierId,
      supplierName: po.supplierName,
      customerName: po.supplierName,
      date: po.orderDate,
      dueDate: po.expectedDate || null,
      status: po.status || 'ordered',
      shippingCost: po.shippingCost || 0,
      subtotal: (po.items || []).reduce((acc, it) => acc + (it.total || ((it.qty || 1) * (it.unitCost || it.unitPrice || 0))), 0),
      grandTotal: po.totalAmount,
      notes: po.notes || '',
      items: (po.items || []).map(it => ({
        productId: it.productId,
        sku: it.sku || '',
        name: it.productName || it.name,
        qty: it.qty || it.quantity || 1,
        unitPrice: it.unitCost || it.unitPrice || 0,
        total: it.total || ((it.qty || it.quantity || 1) * (it.unitCost || it.unitPrice || 0))
      })),
      createdBy: po.createdBy || 'Admin'
    };

    const existingDocIdx = this.data.documents.findIndex(d => d.id === po.id || d.docNumber === po.poNumber);
    if (existingDocIdx !== -1) {
      this.data.documents[existingDocIdx] = { ...this.data.documents[existingDocIdx], ...docPo };
      this.syncRecordToRemote('documents', this.data.documents[existingDocIdx]);
    } else {
      this.data.documents.unshift(docPo);
      this.syncRecordToRemote('documents', docPo);
    }

    this.syncRecordToRemote('purchase_orders', po);
    this.notify();
    return po;
  }

  updatePurchaseOrder(id, updated) {
    const idx = this.data.purchaseOrders.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.purchaseOrders[idx] = { ...this.data.purchaseOrders[idx], ...updated };
      
      const dIdx = this.data.documents.findIndex(d => d.id === id || d.docNumber === this.data.purchaseOrders[idx].poNumber);
      if (dIdx !== -1) {
        if (updated.status) this.data.documents[dIdx].status = updated.status;
        if (updated.totalAmount) this.data.documents[dIdx].grandTotal = updated.totalAmount;
        if (updated.notes) this.data.documents[dIdx].notes = updated.notes;
        if (updated.orderDate) this.data.documents[dIdx].date = updated.orderDate;
        if (updated.items) this.data.documents[dIdx].items = updated.items;
        this.syncRecordToRemote('documents', this.data.documents[dIdx]);
      }
      this.syncRecordToRemote('purchase_orders', this.data.purchaseOrders[idx]);
      this.notify();
    }
  }

  deletePurchaseOrder(id) {
    const po = this.data.purchaseOrders.find(p => p.id === id || p.poNumber === id);
    const poId = po ? po.id : id;
    const poNum = po ? po.poNumber : id;

    this.data.purchaseOrders = this.data.purchaseOrders.filter(p => p.id !== poId && p.poNumber !== poNum && p.id !== id);
    this.deleteFromRemote('purchase_orders', poId);
    if (poNum && poNum !== poId) {
      this.deleteFromRemote('purchase_orders', poNum);
    }
    
    // Also remove from documents
    const doc = this.data.documents.find(d => d.id === poId || d.docNumber === poNum || d.id === id);
    if (doc) {
      this.data.documents = this.data.documents.filter(d => d.id !== doc.id && d.docNumber !== doc.docNumber);
      this.deleteFromRemote('documents', doc.id);
      if (doc.docNumber) this.deleteFromRemote('documents', doc.docNumber);
    } else {
      this.deleteFromRemote('documents', poId);
      if (poNum) this.deleteFromRemote('documents', poNum);
    }
    this.notify();
  }

  receivePurchaseOrder(poId) {
    const po = this.data.purchaseOrders.find(p => p.id === poId);
    if (po) {
      po.status = 'received';
      const d = this.data.documents.find(doc => doc.id === poId || doc.docNumber === po.poNumber);
      if (d) {
        d.status = 'received';
        this.syncRecordToRemote('documents', d);
      }
      this.syncRecordToRemote('purchase_orders', po);
      this.notify();
      return true;
    }
    return false;
  }

  // --------------------------------------------------------------------------
  // DOCUMENTS CRUD
  // --------------------------------------------------------------------------
  getDocuments(type = null) {
    const list = sortByNewest(this.data.documents || []);
    if (!type || type === 'all') return list;
    return list.filter(d => (d.docType === type || d.type === type));
  }

  getDocumentById(id) {
    return this.data.documents.find(d => d.id === id) || 
           this.data.purchaseOrders.find(p => p.id === id);
  }

  getDocumentByNumber(docNumber) {
    if (!docNumber) return null;
    return this.data.documents.find(d => d.docNumber === docNumber) || 
           this.data.purchaseOrders.find(p => p.poNumber === docNumber) || null;
  }

  addDocument(doc) {
    if (!doc.id) doc.id = 'doc_' + Date.now();
    doc.type = doc.type || doc.docType || 'pos';
    doc.docType = doc.docType || doc.type || 'pos';
    doc.customerId = doc.customerId || doc.customer_id || 'cust_walk_in';
    doc.customerName = doc.customerName || doc.customer_name || 'ລູກຄ້າທົ່ວໄປ';
    doc.subtotal = doc.subtotal !== undefined ? doc.subtotal : (doc.grandTotal || 0);
    doc.grandTotal = doc.grandTotal !== undefined ? doc.grandTotal : (doc.subtotal || 0);
    doc.totalAmount = doc.totalAmount !== undefined ? doc.totalAmount : doc.grandTotal;
    doc.date = doc.date || new Date().toISOString().split('T')[0];
    doc.status = doc.status || 'paid';

    this.data.documents = sortByNewest([doc, ...(this.data.documents || [])]);
    this.saveLocal();
    
    // Automatically record income transaction ONLY IF status is paid
    if (doc.status === 'paid' && (doc.docType === 'invoice' || doc.docType === 'pos')) {
      const exists = this.data.transactions.some(t => t.refDoc === doc.docNumber);
      if (!exists) {
        let initialProfit = 0;
        if (Array.isArray(doc.items) && doc.items.length > 0) {
          doc.items.forEach(it => {
            const qty = Number(it.quantity || it.qty || 1);
            const price = Number(it.unitPrice || it.price || 0);
            let cost = Number(it.costPrice || it.cost || 0);
            if (cost === 0 && it.productId) {
              const p = (this.data.products || []).find(prod => prod.id === it.productId);
              if (p && Number(p.costPrice || p.cost || 0) > 0) {
                cost = Number(p.costPrice || p.cost || 0);
              }
            }
            if (cost === 0 && price > 0) {
              cost = price * 0.75;
            }
            initialProfit += (price - cost) * qty;
          });
        }
        if (initialProfit <= 0 && (doc.grandTotal || doc.totalAmount)) {
          initialProfit = Math.round(Number(doc.grandTotal || doc.totalAmount || 0) * 0.25);
        }

        this.addTransaction({
          type: 'income',
          category: doc.docType === 'pos' ? 'pos_sale' : 'product_sale',
          amount: doc.grandTotal || doc.totalAmount || 0,
          profit: Math.round(initialProfit),
          date: doc.date,
          refDoc: doc.docNumber,
          description: doc.docType === 'pos' ? `ບິນຂາຍໜ້າຮ້ານ POS: ${doc.docNumber}` : `ຮັບເງິນຕາມໃບເກັບເງິນ ${doc.docNumber} (${doc.customerName})`,
          paymentMethod: doc.paymentMethod || 'ເງີນໂອນ (Transfer)',
          notes: doc.notes || '',
          recordedBy: doc.createdBy || 'Admin'
        });
      }
    }

    this.syncRecordToRemote('documents', doc);
    this.notify();
    return doc;
  }

  updateDocument(id, updated) {
    const idx = this.data.documents.findIndex(d => d.id === id);
    if (idx !== -1) {
      const prevDoc = this.data.documents[idx];
      this.data.documents[idx] = { ...prevDoc, ...updated };
      const doc = this.data.documents[idx];

      // Auto-sync income transaction strictly based on paid status
      if (doc.docType === 'invoice' || doc.docType === 'pos') {
        if (doc.status === 'paid') {
          let calcProfit = 0;
          if (Array.isArray(doc.items) && doc.items.length > 0) {
            doc.items.forEach(it => {
              const qty = Number(it.quantity || it.qty || 1);
              const price = Number(it.unitPrice || it.price || 0);
              let cost = Number(it.costPrice || it.cost || 0);
              if (cost === 0 && it.productId) {
                const p = (this.data.products || []).find(prod => prod.id === it.productId);
                if (p && Number(p.costPrice || p.cost || 0) > 0) {
                  cost = Number(p.costPrice || p.cost || 0);
                }
              }
              if (cost === 0 && price > 0) {
                cost = price * 0.75;
              }
              calcProfit += (price - cost) * qty;
            });
          }
          if (calcProfit <= 0 && (doc.grandTotal || doc.totalAmount)) {
            calcProfit = Math.round(Number(doc.grandTotal || doc.totalAmount || 0) * 0.25);
          }

          const tx = this.data.transactions.find(t => t.refDoc === doc.docNumber);
          if (tx) {
            tx.amount = doc.grandTotal || doc.totalAmount || tx.amount;
            tx.profit = Math.round(calcProfit);
            tx.date = doc.date || tx.date;
            if (doc.notes) tx.notes = doc.notes;
            if (doc.paymentMethod) tx.paymentMethod = doc.paymentMethod;
            this.syncRecordToRemote('transactions', tx);
          } else {
            this.addTransaction({
              type: 'income',
              category: doc.docType === 'pos' ? 'pos_sale' : 'product_sale',
              amount: doc.grandTotal || doc.totalAmount || 0,
              profit: Math.round(calcProfit),
              date: doc.date,
              refDoc: doc.docNumber,
              description: doc.docType === 'pos' ? `ບິນຂາຍໜ້າຮ້ານ POS: ${doc.docNumber}` : `ຮັບເງິນຕາມໃບເກັບເງິນ ${doc.docNumber} (${doc.customerName})`,
              paymentMethod: doc.paymentMethod || 'ເງີນໂອນ (Transfer)',
              notes: doc.notes || '',
              recordedBy: doc.createdBy || 'Admin'
            });
          }
        } else {
          // If status is NOT paid (unpaid, draft, cancelled, etc.), remove from income transactions
          this.data.transactions = this.data.transactions.filter(t => t.refDoc !== doc.docNumber);
        }
      }

      // Auto-sync PO status if editing a PO document
      if (doc.docType === 'po' || (doc.docNumber && doc.docNumber.startsWith('PO-'))) {
        const pIdx = this.data.purchaseOrders.findIndex(p => p.id === id || p.poNumber === doc.docNumber);
        if (pIdx !== -1) {
          if (updated.status) this.data.purchaseOrders[pIdx].status = updated.status;
          if (updated.grandTotal) this.data.purchaseOrders[pIdx].totalAmount = updated.grandTotal;
          if (updated.notes) this.data.purchaseOrders[pIdx].notes = updated.notes;
          if (updated.date) this.data.purchaseOrders[pIdx].orderDate = updated.date;
        }
      }

      this.syncRecordToRemote('documents', doc);
      this.notify();
    }
  }

  deleteDocument(id) {
    const doc = this.data.documents.find(d => d.id === id || d.docNumber === id);
    const targetDocId = doc ? doc.id : id;
    const docNum = doc ? doc.docNumber : id;

    if (doc) {
      this.data.transactions = this.data.transactions.filter(t => t.refDoc !== doc.docNumber && t.refDoc !== doc.id);
      if (doc.docType === 'po' || (doc.docNumber && doc.docNumber.startsWith('PO-'))) {
        const po = this.data.purchaseOrders.find(p => p.id === targetDocId || p.poNumber === docNum || p.id === id);
        if (po) {
          this.data.purchaseOrders = this.data.purchaseOrders.filter(p => p.id !== po.id && p.poNumber !== docNum);
          this.deleteFromRemote('purchase_orders', po.id);
          if (po.poNumber) this.deleteFromRemote('purchase_orders', po.poNumber);
        } else {
          this.deleteFromRemote('purchase_orders', targetDocId);
          if (docNum) this.deleteFromRemote('purchase_orders', docNum);
        }
      }
    }
    this.data.documents = this.data.documents.filter(d => d.id !== targetDocId && d.docNumber !== docNum && d.id !== id);
    this.deleteFromRemote('documents', targetDocId);
    if (docNum && docNum !== targetDocId) {
      this.deleteFromRemote('documents', docNum);
    }
    this.notify();
  }

  // --------------------------------------------------------------------------
  // PROJECTS & TASKS CRUD
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // PROJECT CATEGORIES CRUD (ໝວດງານໂຄງການໄອທີ)
  // --------------------------------------------------------------------------
  getProjectCategories() {
    return this.data.projectCategories || [];
  }

  addProjectCategory(cat) {
    if (!this.data.projectCategories) this.data.projectCategories = [];
    cat.id = cat.id || ('pcat_' + Date.now());
    this.data.projectCategories.push(cat);
    this.syncRecordToRemote('project_categories', cat);
    this.notify();
    return cat;
  }

  updateProjectCategory(id, updated) {
    if (!this.data.projectCategories) this.data.projectCategories = [];
    const idx = this.data.projectCategories.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.projectCategories[idx] = { ...this.data.projectCategories[idx], ...updated };
      this.syncRecordToRemote('project_categories', this.data.projectCategories[idx]);
      this.notify();
      return this.data.projectCategories[idx];
    }
    return null;
  }

  deleteProjectCategory(id) {
    if (!this.data.projectCategories) return;
    this.data.projectCategories = this.data.projectCategories.filter(c => c.id !== id);
    this.deleteFromRemote('project_categories', id);
    this.notify();
  }

  getProjects() {
    return sortByNewest(this.data.projects || []);
  }

  addProject(project) {
    project.id = 'proj_' + Date.now();
    project.progress = project.progress || 0;
    project.status = project.status || 'in_progress';
    this.data.projects = sortByNewest([project, ...(this.data.projects || [])]);
    this.syncRecordToRemote('projects', project);
    this.notify();
    return project;
  }

  updateProject(id, updated) {
    const idx = this.data.projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.projects[idx] = { ...this.data.projects[idx], ...updated };
      this.syncRecordToRemote('projects', this.data.projects[idx]);
      this.notify();
    }
  }

  deleteProject(id) {
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    this.data.tasks = this.data.tasks.filter(t => t.projectId !== id);
    this.deleteFromRemote('projects', id);
    this.notify();
  }

  // --------------------------------------------------------------------------
  // PROJECT MILESTONES & PARTIAL PAYMENTS
  // --------------------------------------------------------------------------
  getProjectMilestones(projectId) {
    const proj = this.data.projects.find(p => p.id === projectId);
    return (proj && proj.milestones) ? proj.milestones : [];
  }

  addProjectMilestone(projectId, milestone) {
    const proj = this.data.projects.find(p => p.id === projectId);
    if (!proj) return null;
    if (!proj.milestones) proj.milestones = [];
    milestone.id = milestone.id || ('m_' + Date.now());
    milestone.status = milestone.status || 'pending';
    proj.milestones.push(milestone);
    this.notify();
    return milestone;
  }

  updateProjectMilestone(projectId, milestoneId, updated) {
    const proj = this.data.projects.find(p => p.id === projectId);
    if (!proj || !proj.milestones) return false;
    const idx = proj.milestones.findIndex(m => m.id === milestoneId);
    if (idx !== -1) {
      proj.milestones[idx] = { ...proj.milestones[idx], ...updated };
      this.notify();
      return true;
    }
    return false;
  }

  deleteProjectMilestone(projectId, milestoneId) {
    const proj = this.data.projects.find(p => p.id === projectId);
    if (!proj || !proj.milestones) return false;
    proj.milestones = proj.milestones.filter(m => m.id !== milestoneId);
    this.notify();
    return true;
  }

  createMilestoneInvoice(projectId, milestoneId) {
    const proj = this.data.projects.find(p => p.id === projectId);
    if (!proj || !proj.milestones) return null;
    const ms = proj.milestones.find(m => m.id === milestoneId);
    if (!ms) return null;

    const newDocNum = 'INV-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000));
    const newDoc = {
      id: 'doc_' + Date.now(),
      docNumber: newDocNum,
      docType: 'invoice',
      refDocId: proj.code,
      customerId: proj.customerId,
      customerName: proj.customerName,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: ms.status === 'paid' ? 'paid' : 'sent',
      subtotal: ms.amount,
      taxRate: 0,
      taxAmount: 0,
      discount: 0,
      grandTotal: ms.amount,
      notes: `ໃບເກັບເງິນງວດໂຄງການ: ${proj.code} - ${proj.title} (${ms.name})`,
      items: [
        { sku: 'SRV-PROJECT', name: `${proj.title} - ${ms.name} (${ms.percent}%)`, qty: 1, unitPrice: ms.amount, total: ms.amount }
      ],
      createdBy: this.getCurrentUser()?.name || 'Admin'
    };

    this.addDocument(newDoc);
    ms.invoiceDocNumber = newDocNum;
    ms.status = ms.status === 'paid' ? 'paid' : 'invoiced';
    this.notify();
    return newDoc;
  }


  getTasks(projectId = null) {
    const list = sortByNewest(this.data.tasks || []);
    if (!projectId) return list;
    return list.filter(t => t.projectId === projectId);
  }

  addTask(task) {
    task.id = 'task_' + Date.now();
    task.status = task.status || 'todo';
    this.data.tasks.push(task);
    this.syncRecordToRemote('project_tasks', task);
    this.notify();
    return task;
  }

  updateTask(id, updated) {
    const idx = this.data.tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.data.tasks[idx] = { ...this.data.tasks[idx], ...updated };
      this.syncRecordToRemote('project_tasks', this.data.tasks[idx]);
      this.notify();
    }
  }

  deleteTask(id) {
    this.data.tasks = this.data.tasks.filter(t => t.id !== id);
    this.deleteFromRemote('project_tasks', id);
    this.notify();
  }

  // --------------------------------------------------------------------------
  // IT SERVICE JOBS CRUD (ໜ້າວຽກໄອທີ: Onsite Support, ແປງຄອມ, ແປງປຣິນເຕີ)
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // IT JOB CATEGORIES CRUD (ປະເພດວຽກໄອທີ)
  // --------------------------------------------------------------------------
  getItJobCategories() {
    return this.data.itJobCategories || [];
  }

  addItJobCategory(cat) {
    if (!this.data.itJobCategories) this.data.itJobCategories = [];
    cat.id = cat.id || ('itcat_' + Date.now());
    cat.key = cat.key || cat.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    this.data.itJobCategories.push(cat);
    this.syncRecordToRemote('it_job_categories', cat);
    this.notify();
    return cat;
  }

  updateItJobCategory(id, updated) {
    if (!this.data.itJobCategories) this.data.itJobCategories = [];
    const idx = this.data.itJobCategories.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.itJobCategories[idx] = { ...this.data.itJobCategories[idx], ...updated };
      this.syncRecordToRemote('it_job_categories', this.data.itJobCategories[idx]);
      this.notify();
      return this.data.itJobCategories[idx];
    }
    return null;
  }

  deleteItJobCategory(id) {
    if (!this.data.itJobCategories) return;
    this.data.itJobCategories = this.data.itJobCategories.filter(c => c.id !== id);
    this.deleteFromRemote('it_job_categories', id);
    this.notify();
  }

  getItJobs() {
    return sortByNewest(this.data.itJobs || []);
  }

  addItJob(job) {
    job.id = 'job_' + Date.now();
    job.status = job.status || 'pending';
    job.receivedDate = job.receivedDate || new Date().toISOString().split('T')[0];
    if (!this.data.itJobs) this.data.itJobs = [];
    this.data.itJobs = sortByNewest([job, ...(this.data.itJobs || [])]);
    this.syncRecordToRemote('it_jobs', job);
    this.notify();
    return job;
  }

  updateItJob(id, updated) {
    if (!this.data.itJobs) this.data.itJobs = [];
    const idx = this.data.itJobs.findIndex(j => j.id === id);
    if (idx !== -1) {
      this.data.itJobs[idx] = { ...this.data.itJobs[idx], ...updated };
      this.syncRecordToRemote('it_jobs', this.data.itJobs[idx]);
      this.notify();
    }
  }

  deleteItJob(id) {
    if (!this.data.itJobs) return;
    this.data.itJobs = this.data.itJobs.filter(j => j.id !== id);
    this.deleteFromRemote('it_jobs', id);
    this.notify();
  }

  // --------------------------------------------------------------------------
  // EMPLOYEES CRUD
  // --------------------------------------------------------------------------
  getEmployees() {
    return sortByNewest(this.data.employees || []);
  }

  addEmployee(emp) {
    emp.id = 'emp_' + Date.now();
    emp.joinedDate = emp.joinedDate || new Date().toISOString().split('T')[0];
    emp.status = emp.status || 'active';
    this.data.employees.push(emp);
    this.syncRecordToRemote('employees', emp);
    this.notify();
    return emp;
  }

  updateEmployee(id, updated) {
    const idx = this.data.employees.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.data.employees[idx] = { ...this.data.employees[idx], ...updated };
      this.syncRecordToRemote('employees', this.data.employees[idx]);
      this.notify();
    }
  }

  deleteEmployee(id) {
    this.data.employees = this.data.employees.filter(e => e.id !== id);
    this.deleteFromRemote('employees', id);
    this.notify();
  }

  // --------------------------------------------------------------------------
  // CUSTOMERS CRUD
  // --------------------------------------------------------------------------
  getCustomers() {
    return sortByNewest(this.data.customers || []);
  }

  addCustomer(customer) {
    customer.id = 'cust_' + Date.now();
    customer.totalSpent = customer.totalSpent || 0;
    this.data.customers.push(customer);
    this.syncRecordToRemote('customers', customer);
    this.notify();
    return customer;
  }

  updateCustomer(id, updated) {
    const idx = this.data.customers.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.customers[idx] = { ...this.data.customers[idx], ...updated };
      this.syncRecordToRemote('customers', this.data.customers[idx]);
      this.notify();
    }
  }

  deleteCustomer(id) {
    this.data.customers = this.data.customers.filter(c => c.id !== id);
    this.deleteFromRemote('customers', id);
    this.notify();
  }

  // --------------------------------------------------------------------------
  // TRANSACTIONS CRUD
  // --------------------------------------------------------------------------
  getTransactions() {
    // Return transactions, ensuring any income transaction tied to a document ONLY appears if the document is PAID
    const list = sortByNewest(this.data.transactions || []);
    return list.filter(t => {
      if (t.type === 'income' && t.refDoc) {
        const doc = this.data.documents.find(d => d.docNumber === t.refDoc || d.id === t.refDoc);
        if (doc && doc.status && doc.status !== 'paid') {
          return false;
        }
      }
      return true;
    });
  }

  addTransaction(tx) {
    if (tx.refDoc) {
      const existing = this.data.transactions.find(t => t.refDoc === tx.refDoc);
      if (existing) {
        Object.assign(existing, tx);
        this.syncRecordToRemote('transactions', existing);
        this.notify();
        return existing;
      }
    }
    tx.id = 'tx_' + Date.now() + Math.floor(Math.random() * 100);
    this.data.transactions = sortByNewest([tx, ...(this.data.transactions || [])]);
    this.syncRecordToRemote('transactions', tx);
    this.notify();
    return tx;
  }

  deleteTransaction(id) {
    this.data.transactions = this.data.transactions.filter(t => t.id !== id);
    this.deleteFromRemote('transactions', id);
    this.notify();
  }

  updateTransaction(id, updated) {
    const idx = this.data.transactions.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.data.transactions[idx] = { ...this.data.transactions[idx], ...updated };
      this.syncRecordToRemote('transactions', this.data.transactions[idx]);
      this.notify();
      return this.data.transactions[idx];
    }
    return null;
  }

  // --------------------------------------------------------------------------
  // BRANDS & SUPPLIERS
  // --------------------------------------------------------------------------
  getBrands() {
    return this.data.brands;
  }

  addBrand(brand) {
    brand.id = 'br_' + Date.now();
    this.data.brands.push(brand);
    this.syncRecordToRemote('brands', brand);
    this.notify();
    return brand;
  }

  updateBrand(id, updated) {
    const idx = this.data.brands.findIndex(b => b.id === id);
    if (idx !== -1) {
      this.data.brands[idx] = { ...this.data.brands[idx], ...updated };
      this.syncRecordToRemote('brands', this.data.brands[idx]);
      this.notify();
      return this.data.brands[idx];
    }
    return null;
  }

  deleteBrand(id) {
    this.data.brands = this.data.brands.filter(b => b.id !== id);
    this.deleteFromRemote('brands', id);
    this.notify();
  }

  getSuppliers() {
    return this.data.suppliers;
  }

  addSupplier(sup) {
    sup.id = 'sup_' + Date.now();
    this.data.suppliers.push(sup);
    this.syncRecordToRemote('suppliers', sup);
    this.notify();
    return sup;
  }

  updateSupplier(id, updated) {
    const idx = this.data.suppliers.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.data.suppliers[idx] = { ...this.data.suppliers[idx], ...updated };
      this.syncRecordToRemote('suppliers', this.data.suppliers[idx]);
      this.notify();
      return this.data.suppliers[idx];
    }
    return null;
  }

  deleteSupplier(id) {
    this.data.suppliers = this.data.suppliers.filter(s => s.id !== id);
    this.deleteFromRemote('suppliers', id);
    this.notify();
  }

  calculateQuotationCost(quotationDocNumber) {
    const doc = this.data.documents.find(d => d.docNumber === quotationDocNumber);
    if (!doc || !doc.items || !doc.items.length) {
      return { totalCost: 0, totalRevenue: 0, profit: 0, profitMargin: 0, items: [] };
    }

    let totalCost = 0;
    let totalRevenue = doc.totalAmount || doc.subtotal || 0;

    const itemsCostBreakdown = doc.items.map(it => {
      const prod = this.data.products.find(p => p.id === it.productId || p.name === it.name);
      // If product exists in catalog, use its costPrice; otherwise estimate 70% of quoted price
      const unitCost = prod ? prod.costPrice : Math.round((it.price || 0) * 0.7);
      const qty = it.qty || 1;
      const itemCost = unitCost * qty;
      const itemRevenue = (it.price * qty) - (it.discount || 0);
      const itemProfit = itemRevenue - itemCost;

      totalCost += itemCost;
      return {
        name: it.name,
        qty: qty,
        unitCost: unitCost,
        itemCost: itemCost,
        price: it.price,
        itemRevenue: itemRevenue,
        itemProfit: itemProfit
      };
    });

    if (!totalRevenue) {
      totalRevenue = itemsCostBreakdown.reduce((sum, i) => sum + i.itemRevenue, 0);
    }

    const profit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100) : 0;

    return {
      totalCost,
      totalRevenue,
      profit,
      profitMargin: Math.round(profitMargin * 10) / 10,
      items: itemsCostBreakdown
    };
  }


  // --------------------------------------------------------------------------
  // CLIENT SYSTEMS
  // --------------------------------------------------------------------------
  getClientSystems() {
    return sortByNewest(this.data.clientSystems || []);
  }

  addClientSystem(sys) {
    sys.id = 'sys_' + Date.now();
    sys.status = sys.status || 'active';
    this.data.clientSystems.push(sys);
    this.syncRecordToRemote('client_systems', sys);
    this.notify();
    return sys;
  }

  updateClientSystem(id, updated) {
    const idx = this.data.clientSystems.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.data.clientSystems[idx] = { ...this.data.clientSystems[idx], ...updated };
      this.syncRecordToRemote('client_systems', this.data.clientSystems[idx]);
      this.notify();
    }
  }

  deleteClientSystem(id) {
    this.data.clientSystems = this.data.clientSystems.filter(s => s.id !== id);
    this.deleteFromRemote('client_systems', id);
    this.notify();
  }

  // --------------------------------------------------------------------------
  // SETTINGS & BACKUP
  // --------------------------------------------------------------------------
  getSettings() {
    return {
      shopNameLao: 'ເນັດດີ ໄອທີ ໂຊລູຊັ່ນ',
      website: 'www.netditsolutions.com',
      ...this.data.settings
    };
  }

  async updateSettings(newSettings) {
    if (!this.data.settings) this.data.settings = {};
    const nowIso = new Date().toISOString();
    this.data.settings = { 
      id: 'setting_01',
      ...this.data.settings, 
      ...newSettings,
      updatedAt: nowIso,
      lastLocalEdit: Date.now()
    };
    if (!this.data.settings.id) this.data.settings.id = 'setting_01';

    // Persist Supabase & Worker settings locally
    if (newSettings.supabaseUrl !== undefined && typeof localStorage !== 'undefined') {
      localStorage.setItem('netd_supabase_url', newSettings.supabaseUrl || '');
    }
    if (newSettings.supabaseAnonKey !== undefined && typeof localStorage !== 'undefined') {
      localStorage.setItem('netd_supabase_key', newSettings.supabaseAnonKey || '');
    }
    if (newSettings.d1WorkerUrl !== undefined && typeof localStorage !== 'undefined') {
      localStorage.setItem('netd_worker_url', (newSettings.d1WorkerUrl || '').trim());
    }

    this.saveLocal();
    this.notify(true, false);

    // Direct Remote Sync to Supabase or Cloudflare D1
    let syncRes = null;
    try {
      syncRes = await this.syncRecordToRemote('settings', this.data.settings);
    } catch (e) {
      console.warn('Sync settings error:', e);
      syncRes = { success: false, error: e.message };
    }

    return { settings: this.data.settings, syncRes };
  }

  exportBackupJson() {
    return JSON.stringify(this.data, null, 2);
  }

  importBackupJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.categories && parsed.products) {
        this.data = parsed;
        this.saveLocal();
        this.notify();
        return { success: true };
      }
      return { success: false, error: 'ຮູບແບບໄຟລ໌ JSON ບໍ່ຖືກຕ້ອງ' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // --------------------------------------------------------------------------
  // CLOUDFLARE D1 SYNC & SECURITY
  // --------------------------------------------------------------------------
  async hashPassword(password) {
    if (!password) return '';
    try {
      const msgUint8 = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      return btoa(password);
    }
  }

  async syncWithCloudflareD1() {
    let workerUrl = this.getWorkerUrl();
    if (!workerUrl) {
      return { success: false, error: 'ກະລຸນາໃສ່ Cloudflare Worker URL ໃນໜ້າຕັ້ງຄ່າກ່ອນ' };
    }

    try {
      // 1. Ping test
      const pingUrl = workerUrl.replace(/\/+$/, '') + '/api/ping';
      const pingRes = await fetch(pingUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!pingRes.ok) {
        throw new Error(`Cloudflare D1 Ping ລົ້ມເຫຼວ (HTTP ${pingRes.status})`);
      }
      const pingContentType = pingRes.headers.get('content-type') || '';
      if (!pingContentType.includes('application/json')) {
        throw new Error('URL ທີ່ປ້ອນແມ່ນ URL ຂອງໜ້າເວັບ (Frontend), ບໍ່ແມ່ນ Worker API.');
      }
      const pingData = await pingRes.json();
      if (!pingData.success) {
        throw new Error(pingData.error || 'Cloudflare D1 ບໍ່ພ້ອມໃຊ້ງານ');
      }

      // 2. Full Sync to D1
      const syncUrl = workerUrl.replace(/\/+$/, '') + '/api/sync-all';
      const deletedSet = new Set(this.getDeletedIds());
      const cleanData = {};
      for (const [k, v] of Object.entries(this.data)) {
        if (Array.isArray(v)) {
          cleanData[k] = v.filter(item => item && !deletedSet.has(item.id) && !deletedSet.has(item.docNumber) && !deletedSet.has(item.poNumber));
        } else {
          cleanData[k] = v;
        }
      }

      const syncRes = await fetch(syncUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'netd_client',
          timestamp: new Date().toISOString(),
          data: cleanData
        })
      });

      if (!syncRes.ok) {
        throw new Error(`Sync ຂຶ້ນ Cloudflare D1 ບໍ່ສຳເລັດ (HTTP ${syncRes.status})`);
      }
      const syncResult = await syncRes.json();

      this.data.settings.lastSyncTime = new Date().toISOString();
      this.saveLocal();
      this.notify(true, true);

      return {
        success: true,
        message: 'Sync ຂໍ້ມູນກັບ Cloudflare D1 ສຳເລັດແລ້ວ',
        serverTime: pingData.server_time,
        sqliteVer: pingData.sqlite_version,
        syncedCount: syncResult.syncedCount || 'All'
      };
    } catch (err) {
      console.warn('Cloudflare D1 Sync error:', err);
      return { success: false, error: err.message };
    }
  }

  async pullFromCloudflareD1() {
    let workerUrl = this.getWorkerUrl();
    if (!workerUrl) {
      return { success: false, error: 'ກະລຸນາໃສ່ Cloudflare Worker URL ໃນໜ້າຕັ້ງຄ່າກ່ອນ' };
    }

    try {
      const pullUrl = workerUrl.replace(/\/+$/, '') + '/api/pull-all';
      const pullRes = await fetch(pullUrl, { method: 'GET', headers: { 'Accept': 'application/json' } });
      if (!pullRes.ok) {
        throw new Error(`ດຶງຂໍ້ມູນຈາກ Cloudflare D1 ບໍ່ສຳເລັດ (HTTP ${pullRes.status})`);
      }
      const result = await pullRes.json();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'ຮູບແບບຂໍ້ມູນທີ່ໄດ້ຮັບຈາກ D1 ບໍ່ຖືກຕ້ອງ');
      }

      const pData = result.data;
      if (pData.settings && typeof pData.settings === 'object' && Object.keys(pData.settings).length > 0) {
        const curSettings = this.data.settings || {};
        const localEditTime = curSettings.lastLocalEdit || 0;
        const remoteUpdateTime = pData.settings.updatedAt ? new Date(pData.settings.updatedAt).getTime() : 0;

        // If local settings were modified within the last 5 minutes and are newer than remote, preserve local edits
        const isLocalNewer = (Date.now() - localEditTime < 300000) && (localEditTime > remoteUpdateTime);

        if (!isLocalNewer) {
          const curWorkerUrl = curSettings.d1WorkerUrl;
          const curSbUrl = curSettings.supabaseUrl;
          const curSbKey = curSettings.supabaseAnonKey;

          // Clean remote settings: do not overwrite local populated values with null, undefined, or empty strings
          const cleanRemote = {};
          for (const [k, v] of Object.entries(pData.settings)) {
            if (v !== null && v !== undefined && v !== '') {
              cleanRemote[k] = v;
            }
          }

          this.data.settings = { 
            ...curSettings, 
            ...cleanRemote,
            d1WorkerUrl: (typeof localStorage !== 'undefined' ? localStorage.getItem('netd_worker_url') : '') || cleanRemote.d1WorkerUrl || curWorkerUrl || this.getWorkerUrl(),
            supabaseUrl: (typeof localStorage !== 'undefined' ? localStorage.getItem('netd_supabase_url') : '') || cleanRemote.supabaseUrl || curSbUrl || '',
            supabaseAnonKey: (typeof localStorage !== 'undefined' ? localStorage.getItem('netd_supabase_key') : '') || cleanRemote.supabaseAnonKey || curSbKey || ''
          };
        }
      }

      const tableKeys = [
        'employees', 'customers', 'categories', 'brands', 'suppliers', 
        'products', 'productSerials', 'purchaseOrders', 'documents', 
        'projectCategories', 'projects', 'tasks', 'itJobCategories', 
        'itJobs', 'transactions', 'clientSystems', 'activityLogs'
      ];

      const deletedSet = new Set(this.getDeletedIds());
      tableKeys.forEach(tk => {
        if (Array.isArray(pData[tk])) {
          const processedRemote = pData[tk].map(item => {
            if (tk === 'documents') {
              if (!item.docType && item.type) item.docType = item.type;
              if (item.grandTotal === undefined && item.totalAmount !== undefined) item.grandTotal = item.totalAmount;
              if (item.discount === undefined && item.discountAmount !== undefined) item.discount = item.discountAmount;
              if (item.customerName === 'undefined') item.customerName = '';
              if (item.itemsJson && (!item.items || !item.items.length)) {
                try { item.items = JSON.parse(item.itemsJson); } catch (e) {}
              }
            }
            if (tk === 'products') {
              if (item.salePrice === undefined && item.sellingPrice !== undefined) item.salePrice = item.sellingPrice;
              if (item.sellingPrice === undefined && item.salePrice !== undefined) item.sellingPrice = item.salePrice;
              if (item.minStock === undefined && item.minStockAlert !== undefined) item.minStock = item.minStockAlert;
              if (item.minStockAlert === undefined && item.minStock !== undefined) item.minStockAlert = item.minStock;
              if (item.stock === undefined && item.stockQty !== undefined) item.stock = item.stockQty;
              if (item.stockQty === undefined && item.stock !== undefined) item.stockQty = item.stock;
              if (item.hasSn !== undefined) {
                item.hasSn = (item.hasSn === 1 || item.hasSn === true || item.hasSn === '1') ? 1 : 0;
              } else {
                item.hasSn = 1;
              }
              if (item.profitMargin === undefined && item.costPrice > 0 && item.salePrice > 0) {
                item.profitMargin = parseFloat((((item.salePrice - item.costPrice) / item.costPrice) * 100).toFixed(2));
              }
            }
            if (tk === 'itJobs') {
              if (!item.jobCode && item.code) item.jobCode = item.code;
              if (!item.issueDescription && item.description) item.issueDescription = item.description;
            }
            if (tk === 'purchaseOrders') {
              if (item.itemsJson && (!item.items || !item.items.length)) {
                try { item.items = JSON.parse(item.itemsJson); } catch (e) {}
              }
            }
            if (tk === 'projects') {
              if (!item.code && item.projectCode) item.code = item.projectCode;
              if (!item.title && item.name) item.title = item.name;
              if (!item.deadline && item.targetDate) item.deadline = item.targetDate;
              if (item.milestonesJson && (!item.milestones || !item.milestones.length)) {
                try { item.milestones = JSON.parse(item.milestonesJson); } catch (e) {}
              }
            }
            if (tk === 'tasks') {
              if (!item.deadline && item.dueDate) item.deadline = item.dueDate;
            }
            if (tk === 'transactions') {
              if (!item.refDoc && item.refDocId) item.refDoc = item.refDocId;
            }
            return item;
          }).filter(item => item && !deletedSet.has(item.id) && !deletedSet.has(item.docNumber) && !deletedSet.has(item.poNumber));

          // Safe non-destructive bi-directional merge:
          // Remote records update existing or add new ones
          const remoteIds = new Set();
          const remoteDocNums = new Set();
          const mergedList = [];

          processedRemote.forEach(rem => {
            if (rem && rem.id) {
              remoteIds.add(rem.id);
              if (rem.docNumber) remoteDocNums.add(rem.docNumber);
              if (rem.poNumber) remoteDocNums.add(rem.poNumber);
              mergedList.push(rem);
            }
          });

          // Preserve any local items that are NOT deleted and not yet present in D1 (e.g. freshly created POS bills)
          let hasUnsyncedLocal = false;
          if (Array.isArray(this.data[tk])) {
            this.data[tk].forEach(loc => {
              if (!loc || !loc.id) return;
              if (deletedSet.has(loc.id)) return;
              if (loc.docNumber && deletedSet.has(loc.docNumber)) return;
              if (loc.poNumber && deletedSet.has(loc.poNumber)) return;

              const isDuplicate = remoteIds.has(loc.id) || 
                                  (loc.docNumber && remoteDocNums.has(loc.docNumber)) || 
                                  (loc.poNumber && remoteDocNums.has(loc.poNumber));
              if (!isDuplicate) {
                mergedList.unshift(loc);
                remoteIds.add(loc.id);
                if (loc.docNumber) remoteDocNums.add(loc.docNumber);
                if (loc.poNumber) remoteDocNums.add(loc.poNumber);
                hasUnsyncedLocal = true;
              }
            });
          }

          this.data[tk] = sortByNewest(mergedList);
          if (hasUnsyncedLocal) {
            this.scheduleCloudSync();
          }
        }
      });

      // Recalculate stock count for SN products from pulled productSerials
      if (this.data.products && Array.isArray(this.data.products) && this.data.productSerials && Array.isArray(this.data.productSerials)) {
        this.data.products.forEach(p => {
          if (p.hasSn) {
            const count = this.data.productSerials.filter(s => s.productId === p.id && s.status === 'in_stock').length;
            p.stock = count;
            p.stockQty = count;
          }
        });
      }

      this.data.settings.lastSyncTime = new Date().toISOString();
      this.saveLocal();
      this.notify(true, true);

      return {
        success: true,
        message: 'ດຶງຂໍ້ມູນຫຼ້າສຸດຈາກ Cloudflare D1 ສຳເລັດແລ້ວ',
        timestamp: result.timestamp
      };
    } catch (err) {
      console.warn('Cloudflare D1 Pull error:', err);
      return { success: false, error: err.message };
    }
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_DATABASE));
    this.saveLocal();
    this.notify();
  }
}

// Global DB Singleton instance
window.db = new DatabaseManager();
