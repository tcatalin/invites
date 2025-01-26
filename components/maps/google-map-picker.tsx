"use client"

import { useState, useCallback } from "react"
import { GoogleMap, Marker, StandaloneSearchBox } from "@react-google-maps/api"
import { useGoogleMaps } from "./google-maps-provider"

interface GoogleMapPickerProps {
  onLocationSelect: (location: string, coordinates: [number, number]) => void
}

export function GoogleMapPicker({ onLocationSelect }: GoogleMapPickerProps) {
  const { isLoaded, loadError } = useGoogleMaps()
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 51.5074, lng: -0.1278 })

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      setCenter({ lat, lng })
      updateLocation(lat, lng)
    }
  }, [])

  const updateLocation = useCallback(
    (lat: number, lng: number) => {
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode(
        {
          location: { lat, lng },
        },
        (results, status) => {
          if (status === "OK" && results && results[0]) {
            onLocationSelect(results[0].formatted_address, [lat, lng])
          }
        },
      )
    },
    [onLocationSelect],
  )

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded) return <div>Loading maps</div>

  return (
    <><GoogleMap mapContainerStyle={{ height: "400px", width: "100%" }} center={center} zoom={13} onClick={onMapClick}>
      <Marker position={center} />

    </GoogleMap></>
  )
}

