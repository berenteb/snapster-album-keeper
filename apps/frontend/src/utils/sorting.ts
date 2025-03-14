import { SortDirection, SortField } from "@/components/common/SortingDropdown";

export function sortItems<T extends { name: string; createdAt: string }>(
  items: T[],
  sortField: SortField,
  sortDirection: SortDirection,
): T[] {
  return [...items].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
  });
}
