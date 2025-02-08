"use client";

import { useState, useCallback, useRef } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { X } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

const libraries: ("places")[] = ["places"];

interface LocationPickerProps {
  onSelect: (location: { address: string; lat: number; lng: number }) => void;
  onClose: () => void;
}

export default function LocationPicker({ onSelect, onClose }: LocationPickerProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const [marker, setMarker] = useState<google.maps.LatLng | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    initOnMount: isLoaded,
    debounce: 300,
    cache: 24 * 60 * 60,
  });

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      const location = new google.maps.LatLng(lat, lng);
      setMarker(location);
      mapRef.current?.panTo(location);
      mapRef.current?.setZoom(15);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const onMapClick = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setMarker(e.latLng);
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.latLng.lat()},${e.latLng.lng()}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        
        if (data.results[0]) {
          setValue(data.results[0].formatted_address, false);
          clearSuggestions();
        }
      } catch (error) {
        console.error("Error getting address:", error);
      }
    }
  }, [setValue, clearSuggestions]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleConfirm = async () => {
    if (marker) {
      const lat = marker.lat();
      const lng = marker.lng();
      
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        
        if (data.results[0]) {
          onSelect({
            address: data.results[0].formatted_address,
            lat,
            lng,
          });
        }
      } catch (error) {
        console.error("Error getting address:", error);
      }
    }
  };

  if (!isLoaded) {
    return (
      <Card className="fixed inset-4 z-50 bg-background p-6 shadow-lg md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-2xl md:-translate-x-1/2 md:-translate-y-1/2">
        <div className="text-center">Loading Maps...</div>
      </Card>
    );
  }

  return (
    <Card className="fixed inset-4 z-50 bg-background p-6 shadow-lg md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-2xl md:-translate-x-1/2 md:-translate-y-1/2">
      <div className="relative space-y-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select Location</h2>
          
          <div className="relative">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={!ready}
              placeholder="Search for a location"
              className="w-full"
            />
            
            {status === "OK" && (
              <ul className="absolute z-10 w-full bg-background border rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
                {data.map(({ place_id, description }) => (
                  <li
                    key={place_id}
                    className="px-4 py-2 hover:bg-accent cursor-pointer"
                    onClick={() => handleSelect(description)}
                  >
                    {description}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={12}
            onLoad={onLoad}
            onClick={onMapClick}
          >
            {marker && <Marker position={marker} />}
          </GoogleMap>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!marker}>
              Confirm Location
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}