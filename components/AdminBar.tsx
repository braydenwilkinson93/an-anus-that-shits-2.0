"use client";

import { useState } from "react";
import { useContentStore } from "@/components/ContentProvider";

export default function AdminBar() {
  const { isAdmin, editMode, setEditMode, login, logout, saveStatus, loginError } =
    useContentStore();
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login(password);
    setSubmitting(false);
    if (ok) {
      setShowLogin(false);
      setPassword("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2 font-sans">
      {showLogin && !isAdmin && (
        <form
          onSubmit={handleLogin}
          className="flex items-center gap-2 rounded-lg border border-[#3a302a] bg-[#141211] p-3 shadow-2xl"
        >
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="rounded border border-[#3a302a] bg-[#1c1817] px-2 py-1.5 text-sm text-[#f4f1de] outline-none focus:border-[#d4a373]"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-[#d4a373] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-black hover:bg-[#e0a96d] disabled:opacity-50"
          >
            {submitting ? "…" : "Enter"}
          </button>
          {loginError && (
            <span className="max-w-[10rem] text-xs text-red-400">{loginError}</span>
          )}
        </form>
      )}

      <div className="flex items-center gap-2 rounded-full border border-[#3a302a] bg-[#141211] px-3 py-2 shadow-2xl">
        {saveStatus !== "idle" && (
          <span
            className={`font-mono text-[10px] uppercase tracking-widest ${
              saveStatus === "saving"
                ? "text-[#a89f91]"
                : saveStatus === "saved"
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved" : "Save failed"}
          </span>
        )}

        {isAdmin ? (
          <>
            <button
              type="button"
              onClick={() => setEditMode(!editMode)}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                editMode
                  ? "bg-[#d4a373] text-black"
                  : "bg-[#1c1817] text-[#d4a373] border border-[#3a302a]"
              }`}
            >
              {editMode ? "Editing" : "Edit Site"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-[#3a302a] px-3 py-1 text-xs text-[#a89f91] hover:text-[#f4f1de]"
            >
              Log out
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setShowLogin((v) => !v)}
            className="rounded-full border border-[#3a302a] px-3 py-1 text-xs text-[#a89f91] hover:text-[#f4f1de]"
          >
            Admin
          </button>
        )}
      </div>
    </div>
  );
}
