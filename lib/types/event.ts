export interface Event {
  id: string;
  name: string;
  created_at: Date;
  user_id: string;
  locations: EventLocation[];
  description?: string;
  template_type?: number;
  template_config?: Map<string, string>;
}

export interface EventLocation {
  description: string;
  start_date: Date;
  location_name?: string;
  coords?: string;
  end_date?: Date
}

export interface CreateEventModel {
  name: string;
  user_id: string;
  locations: EventLocation[];
  description?: string;
  template_type?: number;
  template_config?: Map<string, string>;
}