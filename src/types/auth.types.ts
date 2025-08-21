export enum Role {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN', // Platform-wide access
  TRANSLATOR = 'TRANSLATOR', // Translation-only access

  // client based
  COMPANY_OWNER = 'COMPANY_OWNER', // Company owner (client)
  MEMBER = 'MEMBER', // Regular user
}

export interface User {
  _id: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  isSystemAdmin?: boolean;
  permissions?: string[];
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: Role[];
}
