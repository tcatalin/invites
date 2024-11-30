import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabaseClient = await createClient();

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: events, error } = await supabaseClient
    .from("events")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching events:", error);
    return <div>Error loading events</div>;
  }

  return (
    <div>
      <h1>Your Events</h1>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/events/new">Eveniment nou</Link>
      </Button>
      <ul className="box-list">
        {events.map((event) => (
          <li key={event.id} className="box-item">
            <h2>{event.name}</h2>
            <p>{event.description}</p>
            <p>{new Date(event.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
