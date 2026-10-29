import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import site from '../data/site.json';

const RESERVED = ['beranda'];

export const GET: APIRoute = async ({ site: base }) => {
  const pages = (await getCollection('halaman')).filter((p) => !RESERVED.includes(p.id));
  const produk = await getCollection('produk');
  const artikel = await getCollection('artikel', (p) => !p.data.draft);
  const paths = ['/', ...pages.map((p) => `/${p.id}/`), '/produk/', ...produk.map((p) => `/produk/${p.id}/`),
    ...site.komoditas.map((k) => `/solusi/${k.slug}/`), '/cerita-sagri/', '/pengetahuan/',
    ...artikel.map((p) => `/artikel/${p.id}/`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
    paths.map((p) => `  <url><loc>${new URL(p, base)}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
