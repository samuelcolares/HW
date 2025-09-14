import { LeadSchema, type Lead } from "@/lib/types/lead.type";
import { FadeIn } from "../motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { Form } from "../ui/form";
import { InputForm } from "../ui/form-inputs";
import { startTransition, useState } from "react";
import { scorerParser } from "@/lib/score-parser";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Edit2, X } from "lucide-react";
import { useLeads } from "@/providers/leads.provider";
import { toast } from "sonner";
import axios from "axios";
import { useFakePromises } from "@/hooks/use-fake-promises";

export function LeadSidebar({ lead }: { lead: Lead }) {
  return (
    <FadeIn
      initial={{ opacity: 0, y: -10, rotateY: -60 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      exit={{ opacity: 0, y: 10, rotateY: 60 }}
      className="border rounded-md w-lg h-full sticky top-4 mt-[52px] p-4 shadow-md"
    >
      <LeadEditForm lead={lead} />
    </FadeIn>
  );
}

function LeadEditForm({ lead }: { lead: Lead }) {
  const { randomPromise } = useFakePromises();
  const { setSelectedLead, setLeads } = useLeads();
  const [emailEditing, setEmailEditing] = useState(false);
  const [statusEditing, setStatusEditing] = useState(false);
  const form = useForm<z.infer<typeof LeadSchema>>({
    defaultValues: lead,
    resolver: zodResolver(LeadSchema),
  });

  const handleCancel = () => {
    setEmailEditing(false);
    setStatusEditing(false);
  };

  const onSubmit = async (data: z.infer<typeof LeadSchema>) => {
    const hasDifferences = Object.keys(data).some(
      (key) => data[key as keyof typeof data] !== lead[key as keyof typeof lead]
    );
    if (!hasDifferences) return handleCancel();

    const updatedLead = {
      ...lead,
      email: data.email,
      status: data.status,
    };

    const saving = toast.loading("Updating lead...");

    try {
      startTransition(() => {
        setLeads((currentLeads) =>
          currentLeads.map((l) => (l.id === lead.id ? updatedLead : l))
        );
      });

      await randomPromise("Failed to update lead");

      const response = await axios.put(
        `http://localhost:5000/leads/${lead.id}`,
        updatedLead
      );

      startTransition(() => {
        setLeads((currentLeads) =>
          currentLeads.map((l) => (l.id === lead.id ? response.data : l))
        );
      });

      toast.dismiss(saving);
      setSelectedLead(updatedLead);
      handleCancel();
      toast.success("Lead updated successfully!");
    } catch (error: unknown) {
      startTransition(() => {
        setLeads((currentLeads) =>
          currentLeads.map((l) => (l.id === lead.id ? lead : l))
        );
      });

      toast.dismiss(saving);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update lead - reverted to previous state"
      );
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">{lead.name}</h2>
          <div onClick={() => setSelectedLead(null)} className="cursor-pointer">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </div>
        </div>

        <LeadLabel label="Company" text={lead.company} />
        <LeadLabel label="Source" text={lead.source} />
        <LeadScore score={lead.score} />
        {!emailEditing && (
          <LeadLabel
            label="Email"
            text={lead.email}
            isLink
            edit={() => setEmailEditing(true)}
          />
        )}
        {emailEditing && (
          <FadeIn>
            <InputForm control={form.control} name="email" label="Email" />
          </FadeIn>
        )}
        {!statusEditing && (
          <LeadLabel
            label="Status"
            text={lead.status}
            edit={() => setStatusEditing(true)}
          />
        )}
        {statusEditing && (
          <FadeIn>
            <InputForm control={form.control} name="status" label="Status" />
          </FadeIn>
        )}

        {(statusEditing || emailEditing) && (
          <FadeIn className="flex gap-2 justify-end">
            <Button type="button" onClick={handleCancel} disabled={form.formState.isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting} loading={form.formState.isSubmitting} loadingText="Saving...">Save</Button>
          </FadeIn>
        )}
      </form>
    </Form>
  );
}

function LeadLabel({
  label,
  text,
  isLink,
  edit,
}: {
  label: string;
  text: string;
  isLink?: boolean;
  edit?: () => void;
}) {
  const Comp = isLink ? "a" : "p";
  return (
    <FadeIn>
      <h2 className="text-sm font-bold flex items-center gap-2">
        {label}
        {edit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={edit}
            className="size-5 cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        )}
      </h2>
      <Comp
        href={isLink ? `mailto:${text}` : undefined}
        className={cn(
          isLink
            ? "text-blue-400 hover:text-blue-600 transition-all duration-200 ease-in-out underline"
            : "text-base text-black"
        )}
      >
        {text}
      </Comp>
    </FadeIn>
  );
}

function LeadScore({ score }: { score: number }) {
  const { text, tooltip } = scorerParser(score);
  return (
    <div>
      <h2 className="text-sm font-bold">Score</h2>
      <p>
        {score} (<span className={cn(text)}>{tooltip}</span>)
      </p>
    </div>
  );
}
