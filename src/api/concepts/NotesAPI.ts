import axios, { type AxiosResponse } from 'axios'
import type {
  AddNotesRequest,
  RemoveNotesRequest,
  NotesToFlashCardsRequest,
  NotesToFlashCardsResponse,
  GetUserNotesRequest,
  GetNotesRequest,
  GetNotesResponse,
  Notes,
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
 * Notes API Service
 * Handles all API calls related to notes management
 */
export const NotesAPI = {
  /**
   * Adds new textual notes associated with a specific user and a given name
   */
  async addNotes(request: AddNotesRequest): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await api.post('/api/Notes/addNotes', request)
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to add notes' }
      }
      return { error: 'Failed to add notes' }
    }
  },

  /**
   * Removes existing notes identified by a user and name
   */
  async removeNotes(request: RemoveNotesRequest): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await api.post('/api/Notes/removeNotes', request)
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to remove notes' }
      }
      return { error: 'Failed to remove notes' }
    }
  },

  /**
   * Generates a set of question/answer flashcards based on the content of specified notes using an LLM
   */
  async notesToFlashCards(request: NotesToFlashCardsRequest): Promise<ApiResponse<NotesToFlashCardsResponse>> {
    try {
      const response: AxiosResponse<NotesToFlashCardsResponse> = await api.post(
        '/api/Notes/notesToFlashCards',
        request
      )
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to convert notes to flashcards' }
      }
      return { error: 'Failed to convert notes to flashcards' }
    }
  },

  /**
   * Retrieves all notes (content and names) associated with a particular user
   */
  async getUserNotes(request: GetUserNotesRequest): Promise<ApiResponse<Notes[]>> {
    try {
      const response: AxiosResponse<Notes[]> = await api.post(
        '/api/Notes/_getUserNotes',
        request
      )
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to get user notes' }
      }
      return { error: 'Failed to get user notes' }
    }
  },

  /**
   * Retrieves the content of a specific note for a given user and note name
   */
  async getNotes(request: GetNotesRequest): Promise<ApiResponse<GetNotesResponse>> {
    try {
      const response: AxiosResponse<GetNotesResponse[]> = await api.post('/api/Notes/_getNotes', request)
      return { data: response.data[0] }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to get notes' }
      }
      return { error: 'Failed to get notes' }
    }
  }
}

export default NotesAPI
