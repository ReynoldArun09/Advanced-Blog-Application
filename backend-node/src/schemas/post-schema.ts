import { z } from "zod";

export const PostSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "desc is required"),
  image: z.optional(z.string()),
});

export type PostSchemaType = z.infer<typeof PostSchema>;
