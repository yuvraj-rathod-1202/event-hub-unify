import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button"; // Re-added this import

// Define the props type, inheriting from DayPicker's props
export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      // Reverted className to original
      className={cn("p-3", className)}
      // Reverted classNames to the original structure and styles
      classNames={{
        months: "flex flex-col sm:flex-row space-y-8 sm:space-x-8", // Original spacing
        month: "space-y-6", // Original spacing
        caption: "flex justify-center relative items-center pt-1",
        caption_label: "text-sm font-medium",
        nav: "flex items-center space-x-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }), // Used buttonVariants again
          "h-7 w-7 p-0 bg-transparent opacity-50 hover:opacity-100" // Original style
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full space-y-2 border-collapse", // Original spacing
        head_row: "flex",
        head_cell: "w-9 text-center text-[0.8rem] font-normal text-muted-foreground rounded-md", // Original style
        row: "flex w-full mt-3", // Original margin
        cell: cn(
          "relative h-9 w-9 p-0 text-center text-sm", // Original size/padding
          // Original range/outside/selected handling via cell selectors
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected])]:bg-accent",
          "first:[&:has([aria-selected])]:rounded-l-md",
          "last:[&:has([aria-selected])]:rounded-r-md",
          "focus-within:relative focus-within:z-20"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }), // Used buttonVariants again
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100" // Original style
        ),
        day_range_end: "day-range-end", // Defined for cell selector
        // Original theme-based colors
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:opacity-30", // Includes 'day-outside' class for cell selector
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames, // Allow overrides
      }}
      components={{
        // Reverted icon size
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props} // Pass other props like selected, onSelect, etc.
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };