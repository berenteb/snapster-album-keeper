import { ArrowDown, ArrowUp, Calendar, SortAsc, Text } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortField = "name" | "createdAt";
export type SortDirection = "asc" | "desc";

interface SortingDropdownProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortFieldChange: (field: SortField) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
  className?: string;
}

export default function SortingDropdown({
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionChange,
  className,
}: SortingDropdownProps) {
  const toggleSortDirection = () => {
    onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <SortAsc className="h-4 w-4 mr-2" />
          Sort by
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Sort options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onSortFieldChange("name")}
          className={sortField === "name" ? "bg-gray-100" : ""}
        >
          <Text className="h-4 w-4 mr-2" />
          Name
          {sortField === "name" &&
            (sortDirection === "asc" ? (
              <ArrowUp className="h-4 w-4 ml-2" />
            ) : (
              <ArrowDown className="h-4 w-4 ml-2" />
            ))}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSortFieldChange("createdAt")}
          className={sortField === "createdAt" ? "bg-gray-100" : ""}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Date created
          {sortField === "createdAt" &&
            (sortDirection === "asc" ? (
              <ArrowUp className="h-4 w-4 ml-2" />
            ) : (
              <ArrowDown className="h-4 w-4 ml-2" />
            ))}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleSortDirection}>
          {sortDirection === "asc" ? (
            <ArrowUp className="h-4 w-4 mr-2" />
          ) : (
            <ArrowDown className="h-4 w-4 mr-2" />
          )}
          {sortDirection === "asc" ? "Ascending" : "Descending"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
