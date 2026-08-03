import { z } from 'zod';

export const uploadEventSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  eventDate: z.coerce.date().optional(),
  published: z.coerce.boolean().optional(),
});

export type UploadEventInput = z.infer<typeof uploadEventSchema>;
