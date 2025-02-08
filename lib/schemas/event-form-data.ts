import * as z from "zod"

const EventLocationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  start_date: z.date(),  
  end_date: z.date().optional(),
  location_name: z.string().optional(),
  address: z.string().optional(),
  coords: z.string().optional(),
})

export const EventSchema = z.object({
  name: z.string().min(1, "Numele evenimentului este necesar"),
  description: z.string().optional(),
  type: z.enum(["Wedding", "Baptism", "Birthday", "Conference", "Other"]),
  template_type: z.number().optional(),
  template_config: z.record(z.string()).optional(),
  locations: z.array(EventLocationSchema).min(1, "Cel putin un locație este necesară"),
})

export type EventFormData = z.infer<typeof EventSchema>

