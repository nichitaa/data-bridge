export interface SuccessAPIResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorAPIResponse {
  success: false;
  error: string;
}

export type APIResponse<TData = unknown> =
  | SuccessAPIResponse<TData>
  | ErrorAPIResponse;
