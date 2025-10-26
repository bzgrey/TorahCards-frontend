import axios, { type AxiosResponse } from 'axios'
import type {
  ApiResponse,
  FollowRequest,
  UnfollowRequest,
  GetFollowedItemsRequest
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
 * Following API Service
 * Handles all API calls related to following items of interest
 */
export const FollowingAPI = {
  /**
   * Adds the item to the set of followed Items for the given user
   */
  async follow(request: FollowRequest): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await api.post(
        '/api/Following/follow',
        request
      )
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to follow item' }
      }
      return { error: 'Failed to follow item' }
    }
  },

  /**
   * Removes the item from the set of followed Items for the given user
   */
  async unfollow(request: UnfollowRequest): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await api.post(
        '/api/Following/unfollow',
        request
      )
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to unfollow item' }
      }
      return { error: 'Failed to unfollow item' }
    }
  },

  /**
   * Returns an array of Items currently followed by the given user
   */
  async getFollowedItems(request: GetFollowedItemsRequest): Promise<ApiResponse<string[]>> {
    try {
      const response: AxiosResponse<string[]> = await api.post(
        '/api/Following/_getFollowedItems',
        request
      )
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to get followed items' }
      }
      return { error: 'Failed to get followed items' }
    }
  }
}

export default FollowingAPI
