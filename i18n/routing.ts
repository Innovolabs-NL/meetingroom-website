import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "nl", "fr", "de", "es"],
  defaultLocale: "en",
});
