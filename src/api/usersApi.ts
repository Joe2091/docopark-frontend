import apiClient from './apiClient'
import type { CreateUserRequest, UpdateUserRequest, UserResponse } from '@/models/User'

export async function getUsers(): Promise<UserResponse[]> {
  const response = await apiClient.get<UserResponse[]>('/users')
  return response.data
}

export async function getUser(id: number): Promise<UserResponse> {
  const response = await apiClient.get<UserResponse>(`/users/${id}`)
  return response.data
}

export async function createUser(request: CreateUserRequest): Promise<UserResponse> {
  const response = await apiClient.post<UserResponse>('/users', request)
  return response.data
}

export async function updateUser(id: number, request: UpdateUserRequest): Promise<UserResponse> {
  const response = await apiClient.put<UserResponse>(`/users/${id}`, request)

  return response.data
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/users/${id}`)
}

export async function getUsersBySubscription(subscriptionType: string): Promise<UserResponse[]> {
  const response = await apiClient.get<UserResponse[]>(
    `/users/by-subscription/${encodeURIComponent(subscriptionType)}`,
  )

  return response.data
}
