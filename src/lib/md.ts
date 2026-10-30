import { marked } from 'marked';
import site from '../data/site.json';

export const md = (s?: string) => (s ? (marked.parse(s, { async: false }) as string) : '');

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** tel: link from a display number. */
export const tel = (s: string) => 'tel:' + s.replace(/[^0-9+]/g, '');

/** WhatsApp link with an optional prefilled message. Falls back to the contact page. */
export const wa = (text?: string) =>
  site.whatsapp ? `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}` : '/kontak-kami/';

/** CMS link fields accept the shortcut "whatsapp". */
export const link = (href?: string) => (href === 'whatsapp' ? wa() : href || '#');

/** "@sagri_id" from an Instagram profile URL. */
export const igHandle = (url?: string) => {
  const m = (url || '').match(/instagram\.com\/([A-Za-z0-9._]+)/);
  return m ? '@' + m[1] : 'Instagram';
};

export const tanggal = (d: Date) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

export const komoditasBySlug = Object.fromEntries(site.komoditas.map((k) => [k.slug, k]));
export const komoditasByNama = Object.fromEntries(site.komoditas.map((k) => [k.nama, k]));
