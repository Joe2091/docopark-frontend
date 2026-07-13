export type SubscriptionType = number

export interface CreateUserRequest {
  name: string
  email: string
  phone: string
  subscriptionType: SubscriptionType
}

export interface UpdateUserRequest {
  name: string
  email: string
  phone: string
  subscriptionType: SubscriptionType
  isPremium: boolean
}

export interface UserResponse {
  id: number
  name: string
  email: string
  phone: string
  subscriptionType: SubscriptionType
  isPremium: boolean
  createdDate: string
  vehicleCount: number
}
