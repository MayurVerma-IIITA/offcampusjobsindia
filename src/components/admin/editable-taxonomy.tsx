"use client";

import { renameTaxonomyAction } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";

export function EditableTaxonomy({ item, type }: { item: { name: string; slug: string }; type: string }) {
  const handleClick = () => {
    const newName = prompt(`Rename ${item.name}?`, item.name);
    if (!newName || newName === item.name) return;

    const formData = new FormData();
    formData.append("type", type);
    formData.append("oldSlug", item.slug);
    formData.append("newName", newName);

    renameTaxonomyAction(formData);
  };

  return (
    <Badge
      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
      onClick={handleClick}
      title="Click to rename"
    >
      {item.name}
    </Badge>
  );
}
