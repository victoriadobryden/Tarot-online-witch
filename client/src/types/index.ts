export interface TarotCard {
  id: number;
  name: string;
  nameUk: string;
  suit: string;
  number: number;
  meaningUpright: string;
  meaningUprightUk: string;
  meaningReversed: string;
  meaningReversedUk: string;
  keywords: string[];
  keywordsUk: string[];
  position?: string;
  positionUk?: string;
  reversed?: boolean;
  meaning?: string;
  meaningUk?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  preferredLanguage: string;
}

export interface Reading {
  id: string;
  userId?: string;
  sessionId?: string;
  cards: TarotCard[];
  question?: string;
  interpretation: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, preferredLanguage?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

export interface ReadingContextType {
  selectedCards: TarotCard[];
  addCard: (card: TarotCard) => void;
  removeCard: (cardId: number) => void;
  clearCards: () => void;
  interpretation: string | null;
  getInterpretation: (question?: string) => Promise<void>;
  isLoading: boolean;
}
