import axios, { type AxiosResponse } from 'axios'
import type {
  CreateLabelRequest,
  AddLabelRequest,
  DeleteLabelRequest,
  DeleteItemRequest,
  GetLabelItemsRequest,
  GetItemLabelsRequest,
  LabelItem,
  Label,
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
 * Labeling API Service
 * Handles all API calls related to labeling management
 */
export const LabelingAPI = {
  /**
   * Creates a new label with the specified name
   */
  async createLabel(request: CreateLabelRequest): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await api.post('/api/Labeling/createLabel', request)
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to create label' }
      }
      return { error: 'Failed to create label' }
    }
  },

  /**
   * Associates a given item with an existing label
   */
  async addLabel(request: AddLabelRequest): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await api.post('/api/Labeling/addLabel', request)
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to add label to item' }
      }
      return { error: 'Failed to add label to item' }
    }
  },

  /**
   * Disassociates a specific item from a specific label
   */
  async deleteLabel(request: DeleteLabelRequest): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await api.post('/api/Labeling/deleteLabel', request)
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to delete label from item' }
      }
      return { error: 'Failed to delete label from item' }
    }
  },

  /**
   * Deletes an item and removes all its associated labels
   */
  async deleteItem(request: DeleteItemRequest): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await api.post('/api/Labeling/deleteItem', request)
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to delete item' }
      }
      return { error: 'Failed to delete item' }
    }
  },

  /**
   * Retrieves all items associated with a specific label
   */
  async getLabelItems(request: GetLabelItemsRequest): Promise<ApiResponse<LabelItem[]>> {
    try {
      const response: AxiosResponse<LabelItem[]> = await api.post(
        '/api/Labeling/_getLabelItems',
        request
      )
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to get label items' }
      }
      return { error: 'Failed to get label items' }
    }
  },

  /**
   * Retrieves all labels associated with a specific item
   */
  async getItemLabels(request: GetItemLabelsRequest): Promise<ApiResponse<Label[]>> {
    try {
      const response: AxiosResponse<Label[]> = await api.post(
        '/api/Labeling/_getItemLabels',
        request
      )
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to get item labels' }
      }
      return { error: 'Failed to get item labels' }
    }
  }
}

export default LabelingAPI
