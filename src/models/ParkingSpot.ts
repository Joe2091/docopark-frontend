export type SpotStatus = number

export interface CheckInRequest {
  licensePlate: string
}

export interface CheckOutRequest {
  licensePlate: string
}

export interface ParkingSessionResponse {
  id: number
  licensePlate: string
  spotNumber: string
  checkInTime: string
  checkOutTime: string | null
  totalCost: number
  isPaid: boolean
  spotStatus: SpotStatus
}

export interface ParkingSpot {
  id: number
  spotNumber: string
  status: string
  currentSessionId: number | null
}

export interface AvailableParkingSpot {
  id: number
  spotNumber: string
}

export interface ParkingSpotSummary {
  total: number
  available: number
  occupied: number
  reserved: number
}
