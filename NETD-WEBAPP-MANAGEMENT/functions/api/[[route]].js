/**
 * Cloudflare Pages Function adapter for NETD IT Management Backend
 * Routes all /api/* requests directly through worker.js with D1 database binding `DB`
 */
import worker from "../../worker.js";

export async function onRequest(context) {
  return worker.fetch(context.request, context.env, context);
}
