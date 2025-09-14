import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import type {
  Control,
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "./form";
import { cn } from "@/lib/utils";

import { Label } from "./label";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import React from "react";

type FormProps<T extends FieldValues> = {
  label: string;
  defaultValue?: PathValue<T, Path<T>>;
  name: Path<T>;
  control: Control<T>;
  inputClassName?: string;
  labelClassName?: string;
  formItemClassName?: string;
  mask?: (e: string) => void;
  required?: boolean;
  hideLabel?: boolean;
};

export type InputProps<T extends FieldValues> =
  InputHTMLAttributes<HTMLInputElement> & FormProps<T>;

export function InputForm<T extends FieldValues>({
  control,
  name,
  defaultValue,
  disabled,
  onChange,
  type = "text",
  label,
  inputClassName,
  mask,
  labelClassName,
  formItemClassName = "w-full",
  required = false,
  hideLabel = false,
  customComponent,
  ...props
}: InputProps<T> & {
  customComponent?: React.ReactNode;
}) {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, formState: { errors } }) => (
        <FormItem className={cn("space-y-1", formItemClassName)}>
          <Label
            htmlFor={name}
            className={cn(
              "text-sm font-bold flex items-center gap-px",
              hideLabel && "hidden",
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-red-500 text-base">*</span>}
          </Label>
          {customComponent}
          <FormControl>
            <Input
              // label={label}
              // required={required}
              {...field}
              {...props}
              id={name}
              data-testid={name}
              type={type}
              disabled={disabled}
              value={field.value}
              onChange={(e) => {
                if (onChange) return onChange(e);
                field.onChange(mask ? mask(e.target.value) : e);
              }}
              className={cn(
                "flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-none focus-visible:ring-0 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-transparent focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white focus-visible:border-black focus-visible:border-2 transition-colors duration-150",
                inputClassName,
                errors[name] && "!border-red-500"
              )}
            />
          </FormControl>
          <FormMessage data-testid={`${name}-error`} />
        </FormItem>
      )}
    />
  );
}

type TextareaProps<T extends FieldValues> =
  TextareaHTMLAttributes<HTMLTextAreaElement> & FormProps<T>;

export function TextareaForm<T extends FieldValues>({
  control,
  name,
  defaultValue,
  disabled,
  onChange,
  label,
  inputClassName,
  mask,
  labelClassName,
  formItemClassName = "w-full",
  required = false,
  hideLabel = false,
  ...props
}: TextareaProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, formState: { errors } }) => (
        <FormItem className={cn("space-y-1", formItemClassName)}>
          <Label
            htmlFor={name}
            className={cn(
              "transition-all text-sm duration-200 ease-in-out text-[#03303e] font-normal ",
              hideLabel && "hidden"
            )}
          >
            {label}
            {required && <span className="text-red-500 text-base">*</span>}
          </Label>
          <FormControl>
            <textarea
              {...props}
              className={cn(
                "!min-h-28 h-28 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-none focus-visible:ring-0 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-transparent focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-black focus-visible:border-2 transition-colors duration-150 resize-none bg-white",
                inputClassName,
                errors[name] && "!border-red-500"
              )}
              // required={required}
              {...field}
              {...props}
              id={name}
              data-testid={name}
              disabled={disabled}
              value={field.value}
              onChange={(e) => {
                if (onChange) return onChange(e);
                field.onChange(mask ? mask(e.target.value) : e);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export type ComboboxProps<T extends FieldValues> = {
  options: {
    label: string;
    value: string;
  }[];
  searchPlaceholder?: string;
  buttonPlaceholder?: string;
  required?: boolean;
  hideLabel?: boolean;
  disabled?: boolean;
  allowCustomValue?: boolean;
} & FormProps<T>;

export function ComboboxForm<T extends FieldValues>({
  control,
  name,
  defaultValue,
  disabled,
  label,
  options,
  searchPlaceholder = "Search...",
  buttonPlaceholder = "Select...",
  required = false,
  hideLabel = false,
  formItemClassName = "w-full",
  allowCustomValue = false,
  onValueChange,
}: ComboboxProps<T> & {
  allowCustomValue?: boolean;
  onValueChange?: (value: string) => void;
}) {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, formState: { errors } }) => (
        <ComboboxRender
          field={field}
          formItemClassName={formItemClassName}
          name={name}
          options={options}
          label={label}
          buttonPlaceholder={buttonPlaceholder}
          required={required}
          hideLabel={hideLabel}
          disabled={disabled}
          allowCustomValue={allowCustomValue}
          onValueChange={onValueChange}
          errors={errors}
          searchPlaceholder={searchPlaceholder}
        />
      )}
    />
  );
}

type RenderComboboxProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  formItemClassName: string;
  name: string;
  options: {
    label: string;
    value: string;
  }[];
  label: string;
  buttonPlaceholder?: string;
  required?: boolean;
  hideLabel?: boolean;
  disabled?: boolean;
  allowCustomValue?: boolean;
  onValueChange?: (value: string) => void;
  errors: FieldErrors<T>;
  searchPlaceholder?: string;
};

const ComboboxRender = <T extends FieldValues>({
  allowCustomValue,
  field,
  formItemClassName,
  name,
  label,
  required,
  disabled,
  hideLabel,
  errors,
  options,
  buttonPlaceholder,
  searchPlaceholder,
  onValueChange,
}: RenderComboboxProps<T>) => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    if (allowCustomValue) {
      setSearchValue(field.value || "");
    }
  }, [field.value, allowCustomValue]);

  return (
    <FormItem className={cn("space-y-1", formItemClassName)}>
      <Label
        htmlFor={name}
        className={cn(
          "text-sm font-bold flex items-center gap-px",
          hideLabel && "hidden"
        )}
      >
        {label}
        {required && <span className="text-red-500 text-base">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className={cn(
                "w-full justify-between border-input bg-white text-black font-normal",
                errors[name] && "border-red-500",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value
                ? options.find((option) => option.value === field.value)
                    ?.label || field.value
                : buttonPlaceholder}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command className="w-full bg-white">
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={(value) => {
                setSearchValue(value);
                if (allowCustomValue) {
                  field.onChange(value);
                }
              }}
              onKeyDown={(e) => {
                if (allowCustomValue && e.key === "Enter" && searchValue) {
                  field.onChange(searchValue);
                  setOpen(false);
                }
              }}
            />
            <CommandList>
              <CommandEmpty>
                {allowCustomValue && searchValue ? (
                  <div className="p-2 text-sm text-gray-600">
                    Press Enter to use "{searchValue}"
                  </div>
                ) : (
                  "No results found."
                )}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      field.onChange(
                        currentValue === field.value ? "" : option.value
                      );
                      onValueChange?.(option.value);
                      setSearchValue("");
                      setOpen(false);
                    }}
                    className="cursor-pointer hover:bg-[#03303e] transition-all duration-300 hover:text-white group"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-[#03303e] group-hover:text-white",
                        field.value === option.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
};
