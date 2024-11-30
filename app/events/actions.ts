'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from 'next/cache'

export async function createEvent(formData: FormData) {
  const supabase = await createClient();

  var user = await supabase.auth.getUser();

  const event = {
    title: formData.get('name') as string,
    //description: formData.get('description') as string,
    created_at: formData.get('date') as string,
    user_id: user.data.user?.id
  };

  const { error } = await supabase.from('events').insert([event]);

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/events')
  return { success: true }
}

export async function updateEvent(formData: FormData) {
    const supabase = await createClient();

  const event = {
    id: formData.get('id') as string,
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    date: formData.get('date') as string,
  }

  const { error } = await supabase
    .from('events')
    .update(event)
    .eq('id', event.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/events')
  return { success: true }
}

export async function deleteEvent(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get('id') as string

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/events')
  return { success: true }
}