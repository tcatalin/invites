import { loadEvents } from "./actions";
import EventList from './event-list'

export const dynamic = 'force-dynamic'

export default async function EventManagement() {
  let { events, error } = await loadEvents();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Events</h1>
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