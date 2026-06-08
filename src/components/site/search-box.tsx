import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBox({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/jobs" className="flex w-full flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          name="q"
          defaultValue={defaultValue}
          placeholder="Search by title, company, qualification, or city"
          className="pl-10"
        />
      </div>
      <Button type="submit">Search jobs</Button>
    </form>
  );
}
