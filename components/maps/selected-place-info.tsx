"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, MapPin } from "lucide-react"
import type { PlaceResult } from "./places"

interface SelectedPlaceInfoProps {
  place: PlaceResult | null
}

export function SelectedPlaceInfo({ place }: SelectedPlaceInfoProps) {
  if (!place) return null

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const copyAllInfo = () => {
    const info = `Name: ${place.name}\nAddress: ${place.address}\nCoordinates: ${place.coords.lat}, ${place.coords.lng}`
    copyToClipboard(info)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5" />
          Selected Place
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Name</label>
          <div className="flex items-center gap-2">
            <p className="flex-1 font-medium">{place.name}</p>
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(place.name)}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Address</label>
          <div className="flex items-center gap-2">
            <p className="flex-1 text-sm">{place.address}</p>
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(place.address)}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Coordinates</label>
          <div className="flex items-center gap-2">
            <p className="flex-1 text-sm font-mono">
              {place.coords.lat.toFixed(6)}, {place.coords.lng.toFixed(6)}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(`${place.coords.lat}, ${place.coords.lng}`)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Button onClick={copyAllInfo} className="w-full">
          Copy All Information
        </Button>
      </CardContent>
    </Card>
  )
}
