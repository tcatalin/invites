"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import type { SearchResult } from "./places"

interface SearchResultsProps {
  results: SearchResult[]
  onSelectPlace: (result: SearchResult) => void
  isVisible: boolean
}

export function SearchResults({ results, onSelectPlace, isVisible }: SearchResultsProps) {
  if (!isVisible || results.length === 0) return null

  return (
    <Card className="absolute top-16 left-0 right-0 z-10 max-h-60 overflow-y-auto">
      <CardContent className="p-2">
        {results.map((result) => (
          <Button
            key={result.place_id}
            variant="ghost"
            className="w-full justify-start p-3 h-auto text-left"
            onClick={() => onSelectPlace(result)}
          >
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{result.name}</div>
              <div className="text-sm text-muted-foreground truncate">{result.formatted_address}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
