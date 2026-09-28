import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ request }) => Response.redirect(new URL('/en/spreadsheet/', request.url), 302);
