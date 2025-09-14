import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import React, { useEffect } from "react";

interface SmoothTabProps {
  items?: TabItem[];
  value?: string;
  defaultTabId?: string;
  className?: string;
  activeColor?: string;
  onChange?: (tabId: string) => void;
}

interface TabItem {
  id: string;
  title: string;
  icon?: LucideIcon;
  color: string;
}

export default function SmoothTab({
  value,
  items,
  defaultTabId,
  className,
  activeColor = "bg-[#1F9CFE]",
  onChange,
}: SmoothTabProps) {
  const [selected, setSelected] = React.useState<string>( defaultTabId || "");

  const [dimensions, setDimensions] = React.useState({ width: 0, left: 0 });

  // Reference for the selected button
  const buttonRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Update dimensions whenever selected tab changes or on mount
  React.useLayoutEffect(() => {
    const updateDimensions = () => {
      const selectedButton = buttonRefs.current.get(selected);
      const container = containerRef.current;

      if (selectedButton && container) {
        const rect = selectedButton.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        setDimensions({
          width: rect.width,
          left: rect.left - containerRect.left,
        });
      }
    };

    // Initial update
    requestAnimationFrame(() => {
      updateDimensions();
    });

    // Update on resize
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [selected]);

  useEffect(() => {
    if (value) {
      setSelected(value);
    }
  }, [value]);

  const handleTabClick = (tabId: string) => {
    if (!items) return;
    // const currentIndex = items.findIndex((item) => item.id === selected);
    // const newIndex = items.findIndex((item) => item.id === tabId);
    // setDirection(newIndex > currentIndex ? 1 : -1);
    setSelected(tabId);
    onChange?.(tabId);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    tabId: string
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleTabClick(tabId);
    }
  };

  const selectedItem = items?.find((item) => item.id === selected);

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Smooth tabs"
      className={cn(
        "flex items-center justify-between gap-1 py-1 mt-auto relative",
        "bg-background w-[300px]",
        "border rounded-xl",
        "transition-all duration-200",
        className
      )}
    >
      {/* Sliding Background */}
      <motion.div
        className={cn(
          "absolute rounded-lg z-[1]",
          selectedItem?.color || activeColor
        )}
        initial={false}
        animate={{
          width: dimensions.width - 8,
          x: dimensions.left + 4,
          opacity: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        style={{ height: "calc(100% - 8px)", top: "4px" }}
      />

      <div className="grid grid-cols-2 w-full gap-1 relative z-[2]">
        {items?.map((item) => {
          const isSelected = selected === item.id;
          return (
            <motion.button
              key={item.id}
              ref={(el) => {
                if (el) buttonRefs.current.set(item.id, el);
                else buttonRefs.current.delete(item.id);
              }}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`panel-${item.id}`}
              id={`tab-${item.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => handleTabClick(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              className={cn(
                "relative flex items-center justify-center gap-0.5 rounded-lg px-2 py-1.5 cursor-pointer",
                "text-sm font-medium transition-all duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "truncate",
                isSelected
                  ? "text-white"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <span className="truncate">{item.title}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
