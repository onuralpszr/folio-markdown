import { z } from 'zod';

export const settingsSchema = z.strictObject({
  theme: z.enum(['light', 'dark', 'system']),
  font: z.enum(['sans', 'serif']),
  width: z.number().int().min(600).max(1100),
  fontSize: z.number().int().min(12).max(24),
  autosave: z.boolean(),
  restore: z.boolean(),
  language: z.enum(['tr', 'en']),
  updateURL: z
    .string()
    .max(2048)
    .refine((value) => {
      if (!value) return true;
      try {
        const url = new URL(value);
        return url.protocol === 'https:' && !url.username && !url.password;
      } catch {
        return false;
      }
    })
    .optional(),
});
export type Settings = z.infer<typeof settingsSchema>;
// The update address input may contain an unfinished draft between keystrokes.
export const storedSettingsSchema = settingsSchema.extend({
  updateURL: z.string().max(2048).optional(),
});
export function parseSettings(text: string): Settings {
  if (new TextEncoder().encode(text).length > 32768)
    throw new Error('Ayar dosyası 32 KiB sınırını aşıyor.');
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Geçerli bir JSON ayar dosyası seçin.');
  }
  const checked = settingsSchema.safeParse(data);
  if (!checked.success)
    throw new Error(
      'Ayar dosyasında eksik, bilinmeyen veya geçersiz bir alan var. Ayarlar değiştirilmedi.',
    );
  return checked.data;
}
