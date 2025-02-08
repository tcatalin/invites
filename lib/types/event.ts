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
  subevent_name?: string;
  start_date: Date;  
  end_date?: Date
  location_name?: string;
  address?: string;
  coords?: string;
}

export interface CreateEventModel {
  name: string;
  user_id: string;
  locations: EventLocation[];
  description?: string;
  type? : EvenType;
  template_type?: number;
  template_config?: Map<string, string>;
}

export enum EvenType {
  Wedding = 'Wedding',
  Baptism = 'Baptism',
  Birthday = 'Birthday',
  Conference = 'Conference',
  Other = 'Other'
}