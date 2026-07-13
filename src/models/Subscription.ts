export type SubscriptionType = number

export interface CreateSubscriptionRequest {
  userId: number
  type: SubscriptionType
  startDate: string
}

export interface SubscriptionResponse {
  id: number
  userId: number
  type: SubscriptionType
  startDate: string
  endDate: string | null
  monthlyFee: number
  isActive: boolean
  userName: string
}
