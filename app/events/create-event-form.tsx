'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { createEvent } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { EventFormData, EventSchema } from '@/lib/schemas/event-form-data'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleMapPicker } from '@/components/maps/google-map-picker'
import { LocationAutocomplete } from '@/components/maps/google-location-autocomplete'
import { GoogleMapsProvider } from '@/components/maps/google-maps-provider'

export default function CreateEventForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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

  const handleLocationSelect = (location: string, coordinates: [number, number], index: number) => {
    form.setValue(`locations.${index}.description`, location);
    //setNewSubEvent({ ...newSubEvent, location, coordinates })
  }

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="mr-2 h-4 w-4" /> Create New Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Enter the details for your new event. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Create New Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter event description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />

                {fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardHeader>
                      <CardTitle>Location {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`locations.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location Description</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter location description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`locations.${index}.start_date`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                value={field.value instanceof Date ? field.value.toISOString().split("T")[0] : field.value}
                                onChange={(e) => field.onChange(new Date(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <GoogleMapsProvider>
                        <LocationAutocomplete onLocationSelect={(location: string, coordinates: [number, number]) => handleLocationSelect(location, coordinates, index)} />
                        <GoogleMapPicker onLocationSelect={(location: string, coordinates: [number, number]) => handleLocationSelect(location, coordinates, index)} />
                      </GoogleMapsProvider>
                      {index > 0 && (
                        <Button type="button" variant="destructive" onClick={() => remove(index)}>
                          Remove Location
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}

                <Button type="button" onClick={() => append({ description: "", start_date: new Date() })}>
                  Add Location
                </Button>
              </CardContent>
            </Card>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </Form>
        {/* 
        <form action={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                className="col-span-3"
                required
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sub-Events</h3>
              {subEvents.map((subEvent) => (
                <Card key={subEvent.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{subEvent.name}</h4>
                      <Button variant="destructive" size="sm" onClick={() => removeSubEvent(subEvent.id)}>
                        Remove
                      </Button>
                    </div>
                    <p>Date: {subEvent.date}</p>
                    <p>Time: {subEvent.time}</p>
                    <p>Location: {subEvent.location}</p>
                  </CardContent>
                </Card>
              ))}
            <div className="space-y-4">
              <Input
                placeholder="Sub-event name"
                value={newSubEvent.name}
                onChange={(e) => setNewSubEvent({ ...newSubEvent, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={newSubEvent.date}
                  onChange={(e) => setNewSubEvent({ ...newSubEvent, date: e.target.value })}
                />
                <Input
                  type="time"
                  value={newSubEvent.time}
                  onChange={(e) => setNewSubEvent({ ...newSubEvent, time: e.target.value })}
                />
              </div>
              <LocationAutocomplete onLocationSelect={handleLocationSelect} />
              <GoogleMapPicker onLocationSelect={handleLocationSelect} />
              <Button onClick={addSubEvent}>Add Sub-Event</Button>
            </div>
          </div>
          </div>
         
        </form> */}
      </DialogContent>
    </Dialog>
  )
}
