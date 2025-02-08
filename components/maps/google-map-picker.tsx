"use client"

import { useState, useCallback, CSSProperties } from "react"
import { GoogleMap, Marker,MarkerF, StandaloneSearchBox } from "@react-google-maps/api"
import { useGoogleMaps } from "./google-maps-provider"

interface GoogleMapPickerProps {
  onLocationSelect: (location: string, coordinates: [number, number]) => void
}

export function GoogleMapPicker({ onLocationSelect }: GoogleMapPickerProps) {
  const { isLoaded, loadError } = useGoogleMaps()
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 51.5074, lng: -0.1278 })
  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral>({ lat: 51.5074, lng: -0.1278 })

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      setMarkerPos({ lat, lng })
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

  const options : google.maps.MapOptions = {
    streetViewControl: false,
    fullscreenControl: false,
    clickableIcons: true,
        
  }

  const inputStyle: CSSProperties = {
    boxSizing: `border-box`,
    border: `1px solid transparent`,
    width: `200px`,
    height: `32px`,
    padding: `0 12px`,
    borderRadius: `3px`,
    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
    fontSize: `14px`,
    outline: `none`,
    textOverflow: `ellipses`,
    position: 'absolute',
    top: '10px',
    right: '10px',
  }

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded) return <div>Loading maps</div>

  return (
    <><GoogleMap mapContainerStyle={{ height: "400px", width: "500px" }} center={center} zoom={13} onClick={onMapClick} options={options}>
     <Marker draggable={true} position={markerPos}  />
      <StandaloneSearchBox>
            <input
              type='text'
              placeholder='Customized your placeholder'
             style={inputStyle}
            />
          </StandaloneSearchBox>

    </GoogleMap></>
  )
}

