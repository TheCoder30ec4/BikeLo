export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  number?: string;
}

export interface SignupApiResponse {
  status?: string;
  message?: string;
  data?: any;
}

