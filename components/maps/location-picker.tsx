"use client";

import { useState, useCallback, useRef } from "react";
import { APIProvider, Map, MapMouseEvent, Marker } from '@vis.gl/react-google-maps';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { PlaceResult, SearchResult } from "./places";
import { SearchInput } from "./search-input";
import { SearchResults } from "./search-result";
import { usePlacesSearch } from "./use-places-search";


interface LocationPickerProps {
  onSelect: (location: { address: string; lat: number; lng: number }) => void;
  onClose: () => void;
  onPlaceSelect?: (place: PlaceResult) => void
  defaultCenter?: { lat: number; lng: number }
  defaultZoom?: number
}

export default function LocationPicker({ onSelect, onClose, onPlaceSelect }: LocationPickerProps) {
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null)
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [showResults, setShowResults] = useState(false)
  const mapRef = useRef<google.maps.Map | null>(null)

  const { searchResults, isLoading, searchPlaces, clearResults } = usePlacesSearch()

  const handleSearch = useCallback(
    (query: string) => {
      console.log("Searching for:", query);
      if (mapRef.current) {
        searchPlaces(query, mapRef.current)
        setShowResults(true)
      }
    },
    [searchPlaces],
  )

  const handleSelectPlace = useCallback(
    (result: SearchResult) => {
      const place: PlaceResult = {
        name: result.name || "Unknown",
        address: result.formatted_address || "Unknown address",
        coords: {
          lat: result.geometry?.location?.lat || 0,
          lng: result.geometry?.location?.lng || 0,
        },
      }

      setSelectedPlace(place)
      setMarkerPosition(place.coords)
      setShowResults(false)
      clearResults()

      // Center map on selected place
      if (mapRef.current) {
        mapRef.current.setCenter(place.coords)
        mapRef.current.setZoom(15)
      }

      // Call the callback if provided
      onPlaceSelect?.(place)
    },
    [clearResults, onPlaceSelect],
  )

  const handleClearSearch = useCallback(() => {
    clearResults()
    setShowResults(false)
  }, [clearResults])

  const handleMapClick = useCallback(
    (mev: MapMouseEvent) => {
      if (mev && mev.detail && mev.detail.latLng) {
        const coords = {
          lat: mev.detail.latLng.lat,
          lng: mev.detail.latLng.lng,
        };

        if (typeof window !== "undefined" && (window as any).google) {
          const geocoder = new (window as any).google.maps.Geocoder();
          geocoder.geocode({ location: coords }, (results: any, status: string) => {
            if (status === "OK" && results?.[0]) {
              const result = results[0];
              console.log("Geocoding result:", result);
              setMarkerPosition(coords);
            }
          });
        } else {
          setMarkerPosition(coords);
        }
      }
    },
    []
    //[onPlaceSelect],
  )

  return (
    <Card className="fixed inset-4 z-50 bg-background p-6 shadow-lg md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-2xl md:-translate-x-1/2 md:-translate-y-1/2">
      <div className="relative space-y-4">
        <Button variant="ghost" size="icon" className="absolute right-0 top-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select Location</h2>

          <div className="flex-1 relative">
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="relative">
                <SearchInput onSearch={handleSearch} onClear={handleClearSearch} isLoading={isLoading} />
                <SearchResults results={searchResults} onSelectPlace={handleSelectPlace} isVisible={showResults} />
              </div>
            </div>

            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
              <Map
                className="h-[800px] w-full"
                mapId={'bf51a910020fa25a'}
                defaultZoom={5}
                defaultCenter={{ lat: 53, lng: 10 }}
                gestureHandling={'greedy'}
                disableDefaultUI={false}
                onClick={handleMapClick}
              >
                {markerPosition && <Marker position={markerPosition} />}
              </Map>
            </APIProvider>


          </div>
        </div>
      </div>
    </Card>
  );
}