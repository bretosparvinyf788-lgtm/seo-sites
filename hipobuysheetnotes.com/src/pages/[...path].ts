import type { APIRoute } from 'astro';
import site from '../lib/site-worker.js';
export const prerender = false;
export const ALL: APIRoute = async ({ request }) => site.fetch(request);
