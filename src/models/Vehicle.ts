export type VehicleType = number

export interface CreateVehicleRequest {
  licensePlate: string
  color: string
  vehicleType: VehicleType
  userId: number | null
}

export interface UpdateVehicleRequest {
  licensePlate: string
  color: string
  vehicleType: VehicleType
  userId: number | null
}

export interface VehicleResponse {
  id: number
  licensePlate: string
  color: string
  vehicleType: VehicleType
  userId: number | null
  ownerName: string | null
}
