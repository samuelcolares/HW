import z from "zod";

export const opportunitySchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  stage: z.string().min(1, "Stage is required"),
  amount: z.string(),
  accountName: z.string().min(1, "Account name is required"),
});

export interface Opportunity extends z.infer<typeof opportunitySchema> {
  createdAt: Date;
  updatedAt: Date;
}
