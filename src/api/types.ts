export interface Card {
  question: string
  answer: string
}

export interface FlashCards {
  user: string
  name: string
  cards: Card[]
}

export interface User {
  // User type placeholder - adjust based on your User concept
  id?: string
  username?: string
}

export interface AddFlashCardsRequest {
  user: string
  name: string
  cards: Card[]
}

export interface RemoveFlashCardsRequest {
  user: string
  name: string
}

export interface AddCardRequest {
  user: string
  name: string
  question: string
  answer: string
}

export interface RemoveCardRequest {
  user: string
  name: string
  card: Card
}

export interface GetUserCardsRequest {
  user: string
}

export interface GetCardsRequest {
  user: string
  name: string
}

export interface ApiResponse<T = void> {
  data?: T
  error?: string
}
