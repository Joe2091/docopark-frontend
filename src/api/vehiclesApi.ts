import apiClient from './apiClient'
import type { CreateVehicleRequest, UpdateVehicleRequest, VehicleResponse } from '@/models/Vehicle'

export async function getVehicles(): Promise<VehicleResponse[]> {
  const response = await apiClient.get<VehicleResponse[]>('/vehicles')
  return response.data
}

export async function getVehicle(id: number): Promise<VehicleResponse> {
  const response = await apiClient.get<VehicleResponse>(`/vehicles/${id}`)

  return response.data
}

export async function getVehiclesByUser(userId: number): Promise<VehicleResponse[]> {
  const response = await apiClient.get<VehicleResponse[]>(`/vehicles/by-user/${userId}`)

  return response.data
}

export async function createVehicle(request: CreateVehicleRequest): Promise<VehicleResponse> {
  const response = await apiClient.post<VehicleResponse>('/vehicles', request)

  return response.data
}

export async function updateVehicle(
  id: number,
  request: UpdateVehicleRequest,
): Promise<VehicleResponse> {
  const response = await apiClient.put<VehicleResponse>(`/vehicles/${id}`, request)

  return response.data
}

export async function deleteVehicle(id: number): Promise<void> {
  await apiClient.delete(`/vehicles/${id}`)
}
