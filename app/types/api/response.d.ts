// Add generic in type to make it more flexible
type ApiResponse<T> = {
  success: boolean
  // Count is returned only when data is an array
  count?: number
  data: T
}