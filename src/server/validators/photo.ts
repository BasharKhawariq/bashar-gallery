import { z } from 'zod';

export const photoCreateSchema = z.object({
  eventId: z.string().uuid(),
  filename: z.string().min(1),
  previewUrl: z.string().url(),
  originalUrl: z.string().url(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export type PhotoCreateInput = z.infer<typeof photoCreateSchema>;
