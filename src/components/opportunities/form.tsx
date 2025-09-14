import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { RainbowButton } from "../ui/rainbow-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { opportunitySchema } from "@/lib/types/opportunity.type";
import { Form } from "../ui/form";
import { ComboboxForm, InputForm } from "../ui/form-inputs";
import { maskCurrency } from "@/lib/utils";
import { startTransition, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { FadeIn } from "../motion";
import { useLeads } from "@/providers/leads.provider";
import { Button } from "../ui/button";
import { useOpportunities } from "@/providers/opportunities.provider";
import { toast } from "sonner";
import { useFakePromises } from "@/hooks/use-fake-promises";
import axios from "axios";

export function OpportunityForm({
  setView,
}: {
  setView?: React.Dispatch<React.SetStateAction<"opportunities" | "leads">>;
}) {
  const { setOpportunities, allOpportunities } = useOpportunities();
  const { randomPromise } = useFakePromises();
  const [open, setOpen] = useState(false);
  const [showAccountName, setShowAccountName] = useState(false);
  const { accountNames } = useLeads();
  const form = useForm<z.infer<typeof opportunitySchema>>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      name: "",
      stage: "",

      accountName: "",
    },
  });

  const handleCancel = () => {
    setOpen(false);
    form.reset();
  };

  const onSubmit = async (data: z.infer<typeof opportunitySchema>) => {
    const body = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const creating = toast.loading("Creating opportunity...");
    try {
      const findExisting = allOpportunities.find(
        (opportunity) => opportunity.id === body.id
      );
      if (findExisting) {
        toast.dismiss(creating);
        toast.error("Opportunity already exists");
        return;
      }

      startTransition(() => {
        setOpportunities((prev) => {
          return [...prev, body];
        });
      });
      await randomPromise("Failed to create opportunity");
      await axios.post("http://localhost:5000/opportunities", body);
      toast.dismiss(creating);
      toast.success("Opportunity created successfully!");
      handleCancel();
    } catch (error) {
      startTransition(() => {
        setOpportunities((prev) => {
          return prev.filter((opportunity) => opportunity.id !== body.id);
        });
      });
      toast.dismiss(creating);
      toast.error("Failed to create opportunity - reverted to previous state");
      console.error(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <RainbowButton
          onClick={() => {
            setView?.("opportunities");
          }}
        >
          Convert Lead
        </RainbowButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convert Lead</DialogTitle>
          <DialogDescription className="text-sm font-medium !mt-0">
            <span className="text-red-500">*</span> Required fields
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <InputForm control={form.control} name="id" label="ID" required />
            <InputForm
              control={form.control}
              name="name"
              label="Name"
              required
            />
            <InputForm
              control={form.control}
              name="stage"
              label="Stage"
              required
            />
            <InputForm
              control={form.control}
              name="amount"
              label="Amount"
              mask={maskCurrency}
            />
            <div>
              {!showAccountName && (
                <FadeIn>
                  <InputForm
                    control={form.control}
                    name="accountName"
                    label="Account Name"
                    required
                  />
                </FadeIn>
              )}
              {showAccountName && (
                <FadeIn>
                  <ComboboxForm
                    control={form.control}
                    name="accountName"
                    label="Account Name"
                    required
                    options={accountNames}
                  />
                </FadeIn>
              )}

              <div className="flex items-center gap-2 py-2 px-1 cursor-pointer transition-all duration-300">
                <Checkbox
                  id="showAccountName"
                  checked={showAccountName}
                  onCheckedChange={(checked) =>
                    setShowAccountName(
                      checked === "indeterminate" ? false : checked
                    )
                  }
                />
                <Label htmlFor="showAccountName" className="cursor-pointer">
                  Select existing account name
                </Label>
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            loading={form.formState.isSubmitting}
            loadingText="Converting..."
          >
            Convert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
