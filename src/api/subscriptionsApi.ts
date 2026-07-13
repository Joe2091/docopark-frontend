import apiClient from './apiClient'
import type { CreateSubscriptionRequest, SubscriptionResponse } from '@/models/Subscription'

export async function getSubscriptions(): Promise<SubscriptionResponse[]> {
  const response = await apiClient.get<SubscriptionResponse[]>('/subscriptions')
  return response.data
}

export async function getSubscription(id: number): Promise<SubscriptionResponse> {
  const response = await apiClient.get<SubscriptionResponse>(`/subscriptions/${id}`)
  return response.data
}

export async function createSubscription(
  request: CreateSubscriptionRequest,
): Promise<SubscriptionResponse> {
  const response = await apiClient.post<SubscriptionResponse>('/subscriptions', request)
  return response.data
}

export async function cancelSubscription(id: number): Promise<void> {
  await apiClient.delete(`/subscriptions/${id}`)
}

export async function getActiveSubscriptions(): Promise<SubscriptionResponse[]> {
  const response = await apiClient.get<SubscriptionResponse[]>('/subscriptions/active')
  return response.data
}

export async function getSubscriptionsByUser(userId: number): Promise<SubscriptionResponse[]> {
  const response = await apiClient.get<SubscriptionResponse[]>(`/subscriptions/by-user/${userId}`)
  return response.data
}
