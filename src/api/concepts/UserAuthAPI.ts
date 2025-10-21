import axios, { type AxiosResponse } from 'axios'
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  GetUsernamesRequest,
  GetUsernamesResponse,
  GetPasswordRequest,
  GetPasswordResponse,
  GetAuthenticatedUserRequest,
  GetAuthenticatedUserResponse,
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
 * UserAuth API Service
 * Handles all API calls related to user authentication and authorization
 */
export const UserAuthAPI = {
  /**
   * Registers a new user with a unique username and password
   * Returns user ID and session token
   */
  async register(request: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response: AxiosResponse<RegisterResponse> = await api.post(
        '/api/UserAuth/register',
        request
      )
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to register user' }
      }
      return { error: 'Failed to register user' }
    }
  },

  /**
   * Authenticates an existing user with username and password
   * Returns a new session token
   */
  async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response: AxiosResponse<LoginResponse> = await api.post(
        '/api/UserAuth/login',
        request
      )
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to login' }
      }
      return { error: 'Failed to login' }
    }
  },

  /**
   * Invalidates the current session token, logging the user out
   */
  async logout(request: LogoutRequest): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await api.post('/api/UserAuth/logout', request)
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to logout' }
      }
      return { error: 'Failed to logout' }
    }
  },

  /**
   * Retrieves usernames for an array of user IDs
   */
  async getUsernames(request: GetUsernamesRequest): Promise<ApiResponse<GetUsernamesResponse[]>> {
    try {
      const response: AxiosResponse<GetUsernamesResponse[]> = await api.post(
        '/api/UserAuth/_getUsername',
        request
      )
      return { data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to get usernames' }
      }
      return { error: 'Failed to get usernames' }
    }
  },

  /**
   * Retrieves the password for a given user ID
   * Note: This should typically only be used in special circumstances
   */
  async getPassword(request: GetPasswordRequest): Promise<ApiResponse<GetPasswordResponse>> {
    try {
      const response: AxiosResponse<GetPasswordResponse[]> = await api.post(
        '/api/UserAuth/_getPassword',
        request
      )
      return { data: response.data[0] }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to get password' }
      }
      return { error: 'Failed to get password' }
    }
  },

  /**
   * Retrieves the user ID associated with a valid session token
   */
  async getAuthenticatedUser(
    request: GetAuthenticatedUserRequest
  ): Promise<ApiResponse<GetAuthenticatedUserResponse>> {
    try {
      const response: AxiosResponse<GetAuthenticatedUserResponse[]> = await api.post(
        '/api/UserAuth/_getAuthenticatedUser',
        request
      )
      return { data: response.data[0] }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Failed to get authenticated user' }
      }
      return { error: 'Failed to get authenticated user' }
    }
  }
}

export default UserAuthAPI
