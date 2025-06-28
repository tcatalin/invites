'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar as CalendarIcon, MapPin, Plus, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { toast } from "@/hooks/use-toast"
import { createEvent } from '../actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { EventFormData, EventSchema, predefinedLocations } from '@/lib/schemas/event-form-data'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';

import LocationPicker from "@/components/maps/location-picker";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/utils/cn'
import { format, set } from "date-fns";
import { Badge } from '@/components/ui/badge';
import { PopoverClose } from '@radix-ui/react-popover';
import { EventLocation, EventType } from '@/lib/types/event';

export default function CreateEventForm() {
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);

  const eventTypes = [
    { value: EventType.Birthday, label: "Zi de naștere" },
    { value: EventType.Wedding, label: "Nuntă" },
    { value: EventType.Baptism, label: "Botez" },
    { value: EventType.Conference, label: "Conferință" },
    { value: EventType.Other, label: "Altul" },
  ]
  const handleEventTypeChange = (value: string) => {
    setSelectedEventType(value)
    form.setValue("type", value as EventFormData["type"])
    form.setValue(
      "locations",
      predefinedLocations[value as EventType].map((location) => ({
        ...location,
        start_date: new Date(),
      })),
    )
  }
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [showMap, setShowMap] = useState<number | null>(null);

  const form = useForm<EventFormData>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      name: "",
      description: "",
      locations: [{ description: "", start_date: new Date() }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "locations",
  })
  const popOverRef = useRef<HTMLButtonElement | null>(null);

  const handleLocationSelect = (location: string, coordinates: [number, number], index: number) => {
    form.setValue(`locations.${index}.description`, location);
    //setNewSubEvent({ ...newSubEvent, location, coordinates })
  }

  const handleLocationSelect2 = (index: number, location: { address: string; lat: number; lng: number }) => {
    form.setValue(`locations.${index}.description`, location.address);
    form.setValue(`locations.${index}.lat`, location.lat);
    form.setValue(`locations.${index}.lng`, location.lng);
    setShowMap(null);
  };

  const handleTimeChange = (index: number, timeStr: string) => {
    const currentDate = form.getValues(`locations.${index}.start_date`);
    const [hours, minutes] = timeStr.split(':').map(Number);

    const newDateTime = set(currentDate, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0
    });

    form.setValue(`locations.${index}.start_date`, newDateTime);
  };

  const handleDateSelect = (index: number, date: Date | undefined) => {
    if (date) {
      const currentDateTime = form.getValues(`locations.${index}.start_date`);
      const newDateTime = set(date, {
        hours: currentDateTime.getHours(),
        minutes: currentDateTime.getMinutes(),
        seconds: 0,
        milliseconds: 0
      });
      form.setValue(`locations.${index}.start_date`, newDateTime);
    }
  };

  async function onSubmit(data: EventFormData) {
    setIsSubmitting(true)
    try {
      const newEvent = await createEvent(data);
      setIsOpen(false)
      toast({
        title: "Event Created",
        description: "Your new event has been created successfully.",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error: " + error,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className=" mx-auto py-10 w-96">
      <h1 className="text-2xl font-bold mb-6 text-center">Eveniment nou</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-6xl">

          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Nume</FormLabel>
              <FormControl>
                <Input placeholder="Introdu numele evenimentului" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />

          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel>Descriere</FormLabel>
              <FormControl>
                <Textarea placeholder="Introdu descrierea evenimentului" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tip</FormLabel>
                <Select onValueChange={handleEventTypeChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează tipul evenimentului" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <h2 className="text-2xl font-bold mb-6 text-center">Cronologie și locații</h2>
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader>
                <CardTitle>
                  <Badge variant="outline" className=" text-xl">{index + 1} </Badge>
                  {index > 0 && (
                    <Button type="button" variant="destructive" size="icon" className="ml-2 float-right" onClick={() => remove(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`locations.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numele momentului</FormLabel>
                      <FormControl>
                        <Input placeholder="Introdu numele " {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name={`locations.${index}.start_date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data și ora</FormLabel>
                      <div className='flex space-x-4'>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field && "text-muted-foreground")}                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field ? format(field.value, "PPP") : <span>Alege o dată</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <PopoverClose ref={popOverRef} />
                              <Calendar mode="single" selected={field.value} onSelect={(date) => { popOverRef.current?.click(); handleDateSelect(index, date); }} />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormControl>
                          <Input type="time" value={format(field.value, "HH:mm")} onChange={(e) => handleTimeChange(index, e.target.value)} className="w-32" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>

                  )}
                />

                <FormField control={form.control} name={`locations.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Locația</FormLabel>
                      <FormControl>
                        <div className='flex space-x-4'>
                          <Input placeholder="Introdu numele locației" {...field} />
                          <Button type="button" variant="outline" onClick={() => setShowMap(index)}                  >
                            <MapPin className="w-4 h-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />

                    </FormItem>
                  )}
                />


                <FormField control={form.control} name={`locations.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Introdu adresa locației" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                {/* <GoogleMapsProvider>
                        <LocationAutocomplete onLocationSelect={(location: string, coordinates: [number, number]) => handleLocationSelect(location, coordinates, index)} />
                        <GoogleMapPicker onLocationSelect={(location: string, coordinates: [number, number]) => handleLocationSelect(location, coordinates, index)} />
                      </GoogleMapsProvider> */}



              </CardContent>
            </Card>
          ))}

          <Button type="button" onClick={() => append({ description: "", start_date: new Date() })}>
            Add Location
          </Button>


          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Event"}
          </Button>

          {showMap !== null && (
            <LocationPicker
              onSelect={(location) => handleLocationSelect2(showMap, location)}
              onClose={() => setShowMap(null)}
            />
          )}
        </form>
      </Form>
    </div>
  )
}

