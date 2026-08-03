import { z } from 'zod';

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined));

export const eventCreateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers, and hyphens'),
  description: optionalText,
  location: optionalText,
  eventDate: z.coerce.date().optional(),
  coverUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((value) => (value && value.length > 0 ? value : undefined))
    .refine((value) => !value || value.startsWith('/') || /^https?:\/\//i.test(value), {
      message: 'Cover must be a full URL or a path starting with /',
    }),
  published: z.boolean().optional().default(false),
});

export type EventCreateInput = z.infer<typeof eventCreateSchema>;
