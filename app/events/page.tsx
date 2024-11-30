import { createClient } from "@/utils/supabase/server";

import EventList from './event-list'
import CreateEventForm from './create-event-form'

export const dynamic = 'force-dynamic'

export default async function EventManagement() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching events:', error)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Events</h1>
        <CreateEventForm />
      </div>

      {error && (
        <div className="text-center mt-8 text-red-500">
          Failed to load events. Please try again later.
        </div>
      )}

      {events && <EventList events={events} />}
    </div>
  )
}