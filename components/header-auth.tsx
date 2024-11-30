import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { ThemeSwitcher } from "./theme-switcher";
import { UserIcon } from "lucide-react";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <UserIcon size="16" strokeWidth={2} />
      {user.user_metadata.first_name} {user.user_metadata.last_name}
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Deconectare
        </Button>
      </form>
      <ThemeSwitcher />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Conectează-te</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Crează cont</Link>
      </Button>
      <ThemeSwitcher />
    </div>
  );
}
