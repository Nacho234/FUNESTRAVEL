"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Client-side demo store. In production this state would live in the backend
 * (favorites and bookings per user, session via auth). Here it persists to
 * localStorage so the demo survives reloads.
 */

export interface BookingDraft {
  packageSlug: string;
  departureId: string;
  adults: number;
  children: number;
  extras: string[]; // extra ids from the checkout step
}

export interface StoredBooking {
  code: string;
  packageSlug: string;
  departureId: string;
  adults: number;
  children: number;
  extras: string[];
  totalUsd: number;
  payMethod: string;
  status: "confirmada" | "pendiente-de-pago" | "en-revision";
  createdAt: string;
  holderName: string;
  holderEmail: string;
}

export interface QuoteRequest {
  id: string;
  destination: string;
  origin: string;
  approxDate: string;
  duration: string;
  travelers: string;
  budget: string;
  styles: string[];
  comments: string;
  status: "recibida" | "en-revision" | "propuesta-enviada";
  createdAt: string;
}

interface Store {
  favorites: string[];
  toggleFavorite: (key: string) => void;
  isFavorite: (key: string) => boolean;
  draft: BookingDraft | null;
  setDraft: (d: BookingDraft | null) => void;
  bookings: StoredBooking[];
  addBooking: (b: StoredBooking) => void;
  quotes: QuoteRequest[];
  addQuote: (q: QuoteRequest) => void;
  user: { name: string; email: string } | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  ready: boolean;
}

const StoreContext = createContext<Store | null>(null);

function usePersisted<T>(key: string, initial: T): [T, (v: T) => void, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hydration-safe localStorage read: the server render can't know the stored
    // value, so it must be applied after mount (a lazy initializer would cause
    // a hydration mismatch).
    try {
      const raw = window.localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setValue(JSON.parse(raw));
    } catch {
      // corrupted storage: keep initial value
    }
    setReady(true);
  }, [key]);

  const set = useCallback(
    (v: T) => {
      setValue(v);
      try {
        window.localStorage.setItem(key, JSON.stringify(v));
      } catch {
        // storage full or unavailable: state still works in-memory
      }
    },
    [key],
  );

  return [value, set, ready];
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites, favReady] = usePersisted<string[]>("ft-favorites", []);
  const [draft, setDraft] = usePersisted<BookingDraft | null>("ft-draft", null);
  const [bookings, setBookings] = usePersisted<StoredBooking[]>("ft-bookings", []);
  const [quotes, setQuotes] = usePersisted<QuoteRequest[]>("ft-quotes", []);
  const [user, setUser] = usePersisted<{ name: string; email: string } | null>("ft-user", null);

  const value = useMemo<Store>(
    () => ({
      favorites,
      toggleFavorite: (key) =>
        setFavorites(favorites.includes(key) ? favorites.filter((f) => f !== key) : [...favorites, key]),
      isFavorite: (key) => favorites.includes(key),
      draft,
      setDraft,
      bookings,
      addBooking: (b) => setBookings([b, ...bookings]),
      quotes,
      addQuote: (q) => setQuotes([q, ...quotes]),
      user,
      login: (name, email) => setUser({ name, email }),
      logout: () => setUser(null),
      ready: favReady,
    }),
    [favorites, setFavorites, draft, setDraft, bookings, setBookings, quotes, setQuotes, user, setUser, favReady],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
