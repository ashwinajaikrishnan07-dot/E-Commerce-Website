// ============================================================
// API CLIENT
// Type-safe HTTP client for the Virtual Tailor Studio backend.
// Centralized error handling and request configuration.
// ============================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

interface RequestConfig extends Omit<RequestInit, "body"> {
  body?: Record<string, unknown> | FormData;
  params?: Record<string, string | number | undefined>;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: unknown
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = "ApiError";
  }
}

async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { body, params, headers: customHeaders, ...restConfig } = config;

  // Build URL with query params
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, String(value));
    });
    const paramString = searchParams.toString();
    if (paramString) url += `?${paramString}`;
  }

  // Build headers
  const headers: HeadersInit = {
    ...customHeaders,
  };

  if (body && !(body instanceof FormData)) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  // Add auth token if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...restConfig,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiError(response.status, response.statusText, errorData);
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/** API client methods */
export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number | undefined>) =>
    request<T>(endpoint, { method: "GET", params }),

  post: <T>(endpoint: string, body?: Record<string, unknown>) =>
    request<T>(endpoint, { method: "POST", body }),

  put: <T>(endpoint: string, body?: Record<string, unknown>) =>
    request<T>(endpoint, { method: "PUT", body }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),

  upload: <T>(endpoint: string, formData: FormData) =>
    request<T>(endpoint, { method: "POST", body: formData }),
};

export { ApiError };
