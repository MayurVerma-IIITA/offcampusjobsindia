import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  return (
    <form action="/api/subscribe" method="post" className="flex flex-col gap-3 sm:flex-row">
      <Input type="email" name="email" placeholder="Email for job alerts" required />
      <Button type="submit" variant="secondary">
        Subscribe
      </Button>
    </form>
  );
}
