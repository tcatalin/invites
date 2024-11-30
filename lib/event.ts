export class Event {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public created_at:Date, 
    public first_date: Date,    
    public dates: Date[],
    public user_id: string,
  ) {}
}
