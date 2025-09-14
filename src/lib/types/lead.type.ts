import z from "zod";

export const LeadSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
  email: z.email(),
  source: z.string(),
  score: z.number(),
  status: z.string(),
});


export interface Lead extends z.infer<typeof LeadSchema> {
  createdAt: Date;
  updatedAt: Date;
}