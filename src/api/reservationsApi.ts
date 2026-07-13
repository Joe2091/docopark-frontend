import apiClient from './apiClient'
import type { CreateReservationRequest, ReservationResponse } from '@/models/Reservation'

export async function getReservations(): Promise<ReservationResponse[]> {
  const response = await apiClient.get<ReservationResponse[]>('/reservations')
  return response.data
}

export async function getReservation(id: number): Promise<ReservationResponse> {
  const response = await apiClient.get<ReservationResponse>(`/reservations/${id}`)
  return response.data
}

export async function createReservation(
  request: CreateReservationRequest,
): Promise<ReservationResponse> {
  const response = await apiClient.post<ReservationResponse>('/reservations', request)
  return response.data
}

export async function cancelReservation(id: number): Promise<void> {
  await apiClient.delete(`/reservations/${id}`)
}

export async function getReservationsByUser(userId: number): Promise<ReservationResponse[]> {
  const response = await apiClient.get<ReservationResponse[]>(`/reservations/by-user/${userId}`)
  return response.data
}
