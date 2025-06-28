"use client"

import { useState, useCallback } from "react"
import type { SearchResult, PlaceResult } from "./places"

export function usePlacesSearch() {
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const searchPlaces = useCallback(async (query: string, map: google.maps.Map) => {
        if (!query.trim() || !map) return

        setIsLoading(true)

        const service = new google.maps.places.PlacesService(map)

        const request = {
            query,
            fields: ["place_id", "name", "formatted_address", "geometry"],
        }

        service.textSearch(request, (results, status) => {
            setIsLoading(false)
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                let res = results.map((result: google.maps.places.PlaceResult) => ({
                    place_id: result.place_id || "",
                    name: result.name,
                    formatted_address: result.formatted_address,
                    geometry: {
                        location: {
                            lat: result.geometry?.location?.lat() || 0,
                            lng: result.geometry?.location?.lng() || 0,
                        }
                    }
                }) as SearchResult);
                setSearchResults(res.slice(0, 5)) // Limit to 5 results
            } else {
                setSearchResults([])
            }
        })
    }, [])

    const clearResults = useCallback(() => {
        setSearchResults([])
    }, [])

    return {
        searchResults,
        isLoading,
        searchPlaces,
        clearResults,
    }
}
