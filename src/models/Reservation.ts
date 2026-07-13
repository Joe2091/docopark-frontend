export type ReservationStatus = number

export interface CreateReservationRequest {
  userId: number
  parkingSpotId: number
  vehicleId: number
  reservedFrom: string
  reservedTo: string
}

export interface ReservationResponse {
  id: number
  userId: number
  vehicleId: number
  parkingSpotId: number
  reservedFrom: string
  reservedTo: string
  status: ReservationStatus
  createdDate: string
  spotNumber: string
  licensePlate: string
}
