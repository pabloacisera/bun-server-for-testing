export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  token?: string;
}