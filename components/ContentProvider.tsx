"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { SiteContent } from "@/lib/content";

type SaveStatus = "idle" | "saving" | "saved" | "error";

type ContentContextValue = {
  content: SiteContent;
  updateContent: (updater: (draft: SiteContent) => SiteContent) => void;
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  saveStatus: SaveStatus;
  loginError: string | null;
};

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({
  initialContent,
  children,
}: {
  initialContent: SiteContent;
  children: React.ReactNode;
}) {
  const [content, setContent] = useState(initialContent);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [loginError, setLoginError] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => setIsAdmin(!!d.isAdmin))
      .catch(() => setIsAdmin(false));
  }, []);

  const persist = useCallback((next: SiteContent) => {
    setSaveStatus("saving");
    fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    })
      .then((r) => {
        if (!r.ok) throw new Error("save failed");
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 1500);
      })
      .catch(() => setSaveStatus("error"));
  }, []);

  const updateContent = useCallback(
    (updater: (draft: SiteContent) => SiteContent) => {
      setContent((prev) => {
        const next = updater(prev);
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => persist(next), 500);
        return next;
      });
    },
    [persist]
  );

  const login = useCallback(async (password: string) => {
    setLoginError(null);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setIsAdmin(true);
      setEditMode(true);
      return true;
    }
    const body = await res.json().catch(() => ({}));
    setLoginError(body.error ?? "Login failed");
    return false;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setIsAdmin(false);
    setEditMode(false);
  }, []);

  return (
    <ContentContext.Provider
      value={{
        content,
        updateContent,
        isAdmin,
        editMode,
        setEditMode,
        login,
        logout,
        saveStatus,
        loginError,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContentStore() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContentStore must be used within ContentProvider");
  return ctx;
}
