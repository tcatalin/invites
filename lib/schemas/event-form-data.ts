import * as z from "zod"

const EventLocationSchema = z.object({
  description: z.string().min(1, "Description is required"),
  start_date: z.date(),
  location_name: z.string().optional(),
  coords: z.string().optional(),
  end_date: z.date().optional(),
})

export const EventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  template_type: z.number().optional(),
  template_config: z.record(z.string()).optional(),
  locations: z.array(EventLocationSchema).min(1, "At least one location is required"),
})

export type EventFormData = z.infer<typeof EventSchema>

