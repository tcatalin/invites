'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from 'next/cache'
import { Event, CreateEventModel } from "@/lib/types/event";
import { EventFormData } from "@/lib/schemas/event-form-data";

export async function loadEvents(): Promise<{ events: Event[], error?: string }> {
  const supabase = await createClient();
  const { data: events, error } = await supabase.from('events').select('*').order('created_at', { ascending: true });
  return { events: events ?? [], error: error?.message };
}
export async function createEvent(formData: EventFormData) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  if (!userId) return { error: "Could not determine current user." };

  const event: CreateEventModel = {
    name: formData.name,
    description: formData.description,
    user_id : userId,
    locations: formData.locations
  };

  const { error } = await supabase.from('events').insert([event]);
  if (error) return { error: error.message };

  revalidatePath('/events')
  return { success: true }
}

export async function updateEvent(formData: FormData) {
  const id = formData.get('id');
  const supabase = await createClient();

  const responseFind = await supabase.from('events').select('*').eq('id', id);

  if (responseFind.error) return { error: responseFind.error.message };
  if (!responseFind.data || responseFind.data.length != 0) return { error: "Could not find a single element to update." };

  const event: Event = {
    ...responseFind.data[0],
    id: formData.get('id') as string,
    name: formData.get('name') as string,
    first_date: new Date(formData.get('first_date') as string),
  };

  const { error } = await supabase.from('events').update(event).eq('id', event.id);
  if (error) return { error: error.message };

  revalidatePath('/events');
  return { success: true };
}

export async function deleteEvent(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get('id');

  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/events');
  return { success: true };
}