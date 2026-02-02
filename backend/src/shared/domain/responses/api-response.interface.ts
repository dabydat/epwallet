export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T | null;
  error: any | null;
}
