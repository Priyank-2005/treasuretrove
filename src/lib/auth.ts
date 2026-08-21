import { SessionOptions } from 'iron-session';

export interface SessionData {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  joinedDate: string;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  userId: '',
  name: '',
  email: '',
  phone: '',
  role: 'CUSTOMER',
  joinedDate: '',
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_for_iron_session',
  cookieName: 'treasuretrove_session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  },
};
