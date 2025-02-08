'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Plus } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { toast } from "@/hooks/use-toast"
import { createEvent } from '../actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { EventFormData, EventSchema } from '@/lib/schemas/event-form-data'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleMapPicker } from '@/components/maps/google-map-picker'
import { LocationAutocomplete } from '@/components/maps/google-location-autocomplete'
import { GoogleMapsProvider } from '@/components/maps/google-maps-provider'
import LocationPicker from "@/components/maps/location-picker";

export default function CreateEventForm() {
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

  const handleLocationSelect = (location: string, coordinates: [number, number], index: number) => {
    form.setValue(`locations.${index}.description`, location);
    //setNewSubEvent({ ...newSubEvent, location, coordinates })
  }

  const handleLocationSelect2 = (index: number, location: { address: string; lat: number; lng: number }) => {
    form.setValue(`locations.${index}.description`, location.address);
    setShowMap(null);
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
    <div className="mx-auto py-10 w-96">
     
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
                {/* <GoogleMapsProvider>
                        <LocationAutocomplete onLocationSelect={(location: string, coordinates: [number, number]) => handleLocationSelect(location, coordinates, index)} />
                        <GoogleMapPicker onLocationSelect={(location: string, coordinates: [number, number]) => handleLocationSelect(location, coordinates, index)} />
                      </GoogleMapsProvider> */}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMap(index)}
                >
                  <MapPin className="w-4 h-4" />
                </Button>
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
