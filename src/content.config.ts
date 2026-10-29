import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const JENIS = ['Paket', 'Insektisida', 'Fungisida', 'Herbisida', 'Zat pengatur tumbuh'] as const;
export const TANAMAN = ['Padi', 'Jagung', 'Hortikultura', 'Bawang'] as const;

const produk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/produk' }),
  schema: z.object({
    nama: z.string(),
    jenis: z.enum(JENIS),
    sifat: z.string().optional().default(''),
    bahan_aktif: z.string().optional().default(''),
    // Mode-of-action group codes as printed on the pack (IRAC / FRAC / HRAC).
    grup: z.array(z.string()).optional().default([]),
    tanaman: z.array(z.enum(TANAMAN)).optional().default([]),
    slogan: z.string().optional().default(''),
    ringkasan: z.string().optional().default(''),
    gambar: z.string().optional().default(''),
    unggulan: z.boolean().optional().default(false),
    baru: z.boolean().optional().default(false),
    urutan: z.number().optional().default(99),
    isi_paket: z.array(z.string()).optional().default([]),
    keunggulan: z.array(z.object({ judul: z.string(), teks: z.string().optional().default('') })).optional().default([]),
    sasaran_judul: z.string().optional().default(''),
    sasaran: z.array(z.object({ nama: z.string(), latin: z.string().optional().default('') })).optional().default([]),
    cara_pakai: z.array(z.string()).optional().default([]),
    foto_sasaran: z.array(z.object({ gambar: z.string(), keterangan: z.string().optional().default('') })).optional().default([]),
  }),
});

const artikel = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artikel' }),
  schema: z.object({
    judul: z.string(),
    tanggal: z.coerce.date(),
    kategori: z.enum(['Cerita Sagri', 'Pengetahuan']),
    kegiatan: z.string().optional().default(''),
    cover: z.string().optional().default(''),
    ringkasan: z.string().optional().default(''),
    draft: z.boolean().optional().default(false),
  }),
});

const halaman = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/halaman' }),
  schema: z.object({
    judul: z.string(),
    deskripsi: z.string().optional().default(''),
    blocks: z.array(z.object({ type: z.string() }).passthrough()).optional().default([]),
  }),
});

export const collections = { produk, artikel, halaman };
