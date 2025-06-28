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
  name?: string;
  start_date: Date;  
  end_date?: Date
  location_name?: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface CreateEventModel {
  name: string;
  user_id: string;
  locations: EventLocation[];
  description?: string;
  type? : EventType;
  template_type?: number;
  template_config?: Map<string, string>;
}

export enum EventType {
  Wedding = 'Wedding',
  Baptism = 'Baptism',
  Birthday = 'Birthday',
  Conference = 'Conference',
  Other = 'Other'
}