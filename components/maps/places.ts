export interface PlaceResult {
  name: string
  address: string
  coords: {
    lat: number
    lng: number
  }
}

export interface SearchResult {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
}
