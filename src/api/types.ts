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

export interface SearchFlashcardsRequest {
  searchTerm: string
}

export interface SearchFlashcardsResult {
    flashcardSet: {
      id: string,
      setOwner: string,
      name: string,
      cards: Card[]
    },
    score: number
}

export interface ApiResponse<T = void> {
  data?: T
  error?: string
}

// Notes types
export interface Notes {
  name: string
  content: string
}

export interface AddNotesRequest {
  user: string
  name: string
  content: string
}

export interface RemoveNotesRequest {
  user: string
  name: string
}

export interface NotesToFlashCardsRequest {
  user: string
  name: string
}

export interface NotesToFlashCardsResponse {
  cards: Card[]
}

export interface GetUserNotesRequest {
  user: string
}

export interface GetNotesRequest {
  user: string
  name: string
}

export interface GetNotesResponse {
  content: string
}

export interface SearchNotesRequest {
  searchTerm: string
}

export interface SearchNotesResult {
  note: {
    id: string
    notesOwner: string
    name: string
    content: string
  }
  score: number
}

// Labeling types
export interface CreateLabelRequest {
  name: string
}

export interface AddLabelRequest {
  item: string
  labelName: string
}

export interface DeleteLabelRequest {
  item: string
  labelName: string
}

export interface DeleteItemRequest {
  item: string
}

export interface GetLabelItemsRequest {
  labelName: string
}

export interface GetItemLabelsRequest {
  item: string
}

export interface LabelItem {
  item: string
}

export interface Label {
  name: string
}

// UserAuth types
export interface RegisterRequest {
  username: string
  password: string
}

export interface RegisterResponse {
  user: string
  token: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface LogoutRequest {
  token: string
}

export interface GetUsernamesRequest {
  users: string[]
}

export interface GetUsernamesResponse {
  username: string
}

export interface GetPasswordRequest {
  user: string
}

export interface GetPasswordResponse {
  password: string
}

export interface GetAuthenticatedUserRequest {
  token: string
}

export interface GetAuthenticatedUserResponse {
  user: string
}

