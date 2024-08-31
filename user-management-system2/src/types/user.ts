export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
}