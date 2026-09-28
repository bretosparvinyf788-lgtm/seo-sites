import type { APIRoute } from 'astro';
import { getProduct } from '../../../lib/source';

export const GET: APIRoute = async ({ params, redirect }) => {
  const id = params.id || '';
  const lang = params.lang || 'en';

  try {
    const product = await getProduct(id);
    if (product?.kakobuyUrl) return redirect(product.kakobuyUrl, 302);
  } catch {}

  return redirect(`/${lang}/spreadsheet/`, 302);
};
