"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export function Providers({
  children,
  posthogKey,
  posthogHost,
}: {
  children: React.ReactNode;
  posthogKey?: string;
  posthogHost?: string;
}) {
  useEffect(() => {
    if (posthogKey) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        capture_pageview: true,
      });
    }
  }, [posthogHost, posthogKey]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-event]");
      if (!target) return;
      const type = target.dataset.event;
      if (!type) return;

      posthog.capture(type);
      navigator.sendBeacon?.(
        "/api/track",
        new Blob(
          [
            JSON.stringify({
              type,
              path: window.location.pathname,
              metadata: { href: target.getAttribute("href") },
            }),
          ],
          { type: "application/json" },
        ),
      );
    }

    function handleSubmit(event: SubmitEvent) {
      const form = event.target as HTMLFormElement;
      const type = form.dataset.trackSubmit;
      if (!type) return;
      posthog.capture(type);
      navigator.sendBeacon?.(
        "/api/track",
        new Blob(
          [
            JSON.stringify({
              type,
              path: window.location.pathname,
            }),
          ],
          { type: "application/json" },
        ),
      );
    }

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit);
    };
  }, []);

  return children;
}
