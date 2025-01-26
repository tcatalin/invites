"use client"

import { useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useGoogleMaps } from "./google-maps-provider"

interface LocationAutocompleteProps {
  onLocationSelect: (location: string, coordinates: [number, number]) => void
}

export function LocationAutocomplete({ onLocationSelect }: LocationAutocompleteProps) {
  const { isLoaded, loadError } = useGoogleMaps()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
      })

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace()
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat()
          const lng = place.geometry.location.lng()
          onLocationSelect(place.formatted_address || "", [lat, lng])
        }
      })
    }
  }, [isLoaded, onLocationSelect])

  if (loadError) return <div>Error loading Google Maps</div>
  if (!isLoaded) return <div>Loading...</div>

  return <Input ref={inputRef} type="text" placeholder="Search for a location" />
}

