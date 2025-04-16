export interface User {
  id: number;
  mobile: string;
  wallet: number;
  spinner_tries: number;
}

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
  user: User;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}