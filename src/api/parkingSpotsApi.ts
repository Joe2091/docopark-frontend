import apiClient from './apiClient'
import type {
  CheckInRequest,
  CheckOutRequest,
  ParkingSessionResponse,
  ParkingSpot,
  AvailableParkingSpot,
  ParkingSpotSummary,
} from '@/models/ParkingSpot'

// Parking Session Management
export async function checkIn(request: CheckInRequest): Promise<ParkingSessionResponse> {
  const response = await apiClient.post<ParkingSessionResponse>('/parking/check-in', request)
  return response.data
}

export async function checkOut(request: CheckOutRequest): Promise<ParkingSessionResponse> {
  const response = await apiClient.post<ParkingSessionResponse>('/parking/check-out', request)
  return response.data
}

export async function getActiveSessions(): Promise<ParkingSessionResponse[]> {
  const response = await apiClient.get<ParkingSessionResponse[]>('/parking/active')
  return response.data
}

export async function getParkingSession(id: number): Promise<ParkingSessionResponse> {
  const response = await apiClient.get<ParkingSessionResponse>(`/parking/${id}`)
  return response.data
}

// Parking Spots Management
export async function getParkingSpots(): Promise<ParkingSpot[]> {
  const response = await apiClient.get<ParkingSpot[]>('/parkingspots')
  return response.data
}

export async function getAvailableSpots(): Promise<AvailableParkingSpot[]> {
  const response = await apiClient.get<AvailableParkingSpot[]>('/parkingspots/available')
  return response.data
}

export async function getParkingSpotSummary(): Promise<ParkingSpotSummary> {
  const response = await apiClient.get<ParkingSpotSummary>('/parkingspots/summary')
  return response.data
}
