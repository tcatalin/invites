import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Crează cont</h1>
        <p className="text-sm text text-foreground">
          Ai deja un cont?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Contectează-te
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="firstName">Prenume</Label>
          <Input name="firstName" placeholder="" required />
          <Label htmlFor="lastName">Nume</Label>
          <Input name="lastName" placeholder="" required />
          <Label htmlFor="phone">Număr de telefon</Label>
          <Input name="phone" placeholder="+407XXXXXXX" required />
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="cineva@example.com" required />
          <Label htmlFor="password">Parolă</Label>
          <Input
            type="password"
            name="password"
            placeholder="Parolă greu de ghicit"
            minLength={6}
            required
          />
          <Label htmlFor="passwordRepeat">Repetă parola</Label>
          <Input
            type="password"
            name="passwordRepeat"
            placeholder="Parolă greu de ghicit"
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Creez cont...">
            Crează cont
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
