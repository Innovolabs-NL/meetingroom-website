import { revalidatePath } from "next/cache";
import { routing } from "@i18n/routing";

export function revalidateAppPaths(teamSlug?: string) {
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}/app`);
    revalidatePath(`/${locale}/app/teams`);
    revalidatePath(`/${locale}/app/settings`);
    revalidatePath(`/${locale}/app/help`);
    if (teamSlug) {
      revalidatePath(`/${locale}/app/t/${teamSlug}`);
      revalidatePath(`/${locale}/app/t/${teamSlug}/invites`);
      revalidatePath(`/${locale}/app/t/${teamSlug}/settings`);
    }
  }
}
