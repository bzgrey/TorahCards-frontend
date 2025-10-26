import axios, { type AxiosResponse } from 'axios'
import type {
  AddFlashCardsRequest,
  RemoveFlashCardsRequest,
  AddCardRequest,
  RemoveCardRequest,
  GetUserCardsRequest,
  GetCardsRequest,
  SearchFlashcardsRequest,
  SearchFlashcardsResult,
  GetFlashcardInfoRequest,
  GetFlashcardInfoResponse,
  FlashCards,
  ApiResponse
} from '../types.ts'

// Configure base URL
const API_BASE_URL = "http://localhost:8000"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * FlashCards API Service
 * Handles all API calls related to flashcards management
 */
export const FlashCardsAPI = {
  /**
   * Adds a new set of flashcards for a specific user and topic
   */
  async addFlashCards(request: AddFlashCardsRequest): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await api.post('/api/FlashCards/addFlashCards', request)
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to add flashcards' }
      }
      return { error: 'Failed to add flashcards' }
    }
  },

  /**
   * Removes an entire set of flashcards for a specific user and topic
   */
  async removeFlashCards(request: RemoveFlashCardsRequest): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await api.post('/api/FlashCards/removeFlashCards', request)
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to remove flashcards' }
      }
      return { error: 'Failed to remove flashcards' }
    }
  },

  /**
   * Adds a single new card to an existing flashcards topic
   */
  async addCard(request: AddCardRequest): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await api.post('/api/FlashCards/addCard', request)
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to add card' }
      }
      return { error: 'Failed to add card' }
    }
  },

  /**
   * Removes a specific card from an existing flashcards topic
   */
  async removeCard(request: RemoveCardRequest): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await api.post('/api/FlashCards/removeCard', request)
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to remove card' }
      }
      return { error: 'Failed to remove card' }
    }
  },

  /**
   * Retrieves all flashcards for a given user
   */
  async getUserCards(request: GetUserCardsRequest): Promise<ApiResponse<FlashCards[]>> {
    try {
      const response: AxiosResponse<FlashCards[]> = await api.post(
        '/api/FlashCards/_getUserCards',
        request
      )
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to get user cards' }
      }
      return { error: 'Failed to get user cards' }
    }
  },

  /**
   * Retrieves the cards for a specific flashcards topic
   */
  async getCards(request: GetCardsRequest): Promise<ApiResponse<FlashCards>> {
    try {
      const response: AxiosResponse<FlashCards[]> = await api.post('/api/FlashCards/_getCards', request)
      return { data: response.data[0] }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to get cards' }
      }
      return { error: 'Failed to get cards' }
    }
  },

  /**
   * Searches for flashcard sets by name, ordered by relevance
   */
  async searchFlashcards(request: SearchFlashcardsRequest): Promise<ApiResponse<SearchFlashcardsResult[]>> {
    try {
      const response: AxiosResponse<SearchFlashcardsResult[]> = await api.post(
        '/api/FlashCards/_searchFlashcards',
        request
      )
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to search flashcards' }
      }
      return { error: 'Failed to search flashcards' }
    }
  },

  /**
   * Retrieves a Flashcards object corresponding to a given Flashcards ID
   */
  async getFlashcardInfo(request: GetFlashcardInfoRequest): Promise<ApiResponse<GetFlashcardInfoResponse[]>> {
    try {
      const response: AxiosResponse<GetFlashcardInfoResponse[]> = await api.post(
        '/api/FlashCards/_getFlashcardInfo',
        request
      )
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to get flashcard info' }
      }
      return { error: 'Failed to get flashcard info' }
    }
  }
}

export default FlashCardsAPI
