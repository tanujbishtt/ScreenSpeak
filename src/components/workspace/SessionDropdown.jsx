import { useEffect, useRef, useState } from "react"
import { ChevronDown, Plus, Trash2 } from "lucide-react"

// props:
//   sessionName - current session's display name ("Untitled" until renamed)
//   onRename    - called with the new name when the user finishes editing;
//                 this is what actually triggers a save
//   canRename   - false until there's at least one message (nothing to save yet)
//   sessions    - saved sessions list (from useSessions())
//   onResume    - called with a session object to load it
//   onDelete    - called with a session id to remove it
//   onNewSession - called when user wants to start a fresh Untitled session
export default function SessionDropdown({
  sessionName,
  onRename,
  canRename,
  sessions,
  onResume,
  onDelete,
  onNewSession,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(sessionName)
  const [isOpen, setIsOpen] = useState(false)

  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  // If the name changes from OUTSIDE (e.g. resuming a different session),
  // keep our local draft in sync with it.
  useEffect(() => {
    setDraft(sessionName)
  }, [sessionName])

  useEffect(() => {
    function handleClickOutside(event) {
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Autofocus + select-all the moment the input appears, so the user can
  // just start typing over "Untitled" immediately.
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  function startEditing() {
    if (!canRename) return
    setIsEditing(true)
  }

  function commitEdit() {
    setIsEditing(false)
    const trimmed = draft.trim()
    if (trimmed && trimmed !== sessionName) {
      onRename(trimmed)
    } else {
      setDraft(sessionName) // nothing meaningful changed, revert
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") commitEdit()
    if (event.key === "Escape") {
      setDraft(sessionName)
      setIsEditing(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative flex items-center gap-0.5">
      {isEditing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          className="
            w-32 rounded-lg border border-border bg-canvas px-2 py-1
            text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary
            dark:text-white
          "
        />
      ) : (
        <button
          onClick={startEditing}
          disabled={!canRename}
          title={canRename ? "Click to rename & save" : "Start chatting to save a session"}
          className="
            max-w-[7rem] truncate rounded-lg px-2 py-1.5 text-left
            text-sm font-medium text-slate-700 transition hover:bg-surface
            disabled:cursor-not-allowed disabled:opacity-50
            dark:text-slate-200 dark:hover:bg-white/5
            sm:max-w-[10rem]
          "
        >
          {sessionName}
        </button>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          rounded-lg p-1 text-slate-400 transition hover:bg-surface
          hover:text-slate-700
          dark:text-slate-500 dark:hover:bg-white/5 dark:hover:text-slate-200
        "
        aria-label="Saved sessions"
        aria-expanded={isOpen}
      >
        <ChevronDown
          size={15}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="
            absolute left-0 top-[calc(100%+8px)] z-100 w-72
            overflow-hidden rounded-2xl border border-border
            bg-surface/90 p-1.5 shadow-[0_18px_50px_rgba(40,30,20,0.15)]
            backdrop-blur-2xl
            dark:bg-[#292838]/95 dark:shadow-[0_18px_50px_rgba(0,0,0,0.45)]
          "
          role="menu"
        >
          <button
            onClick={() => {
              onNewSession()
              setIsOpen(false)
            }}
            className="
              flex w-full items-center gap-2 rounded-xl px-3 py-2.5
              text-left text-sm font-medium text-slate-800
              transition hover:bg-surface-muted
              dark:text-white dark:hover:bg-white/5
            "
            role="menuitem"
          >
            <Plus size={14} />
            New session
          </button>

          <div className="my-1.5 h-px bg-border" />

          {sessions.length === 0 ? (
            <p className="px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400">
              No saved sessions yet.
            </p>
          ) : (
            <div className="no-scrollbar max-h-64 overflow-y-auto">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="
                    group flex w-full items-center justify-between rounded-xl
                    px-3 py-2.5 transition hover:bg-surface-muted
                    dark:hover:bg-white/5
                  "
                >
                  <button
                    onClick={() => {
                      onResume(session)
                      setIsOpen(false)
                    }}
                    className="flex-1 text-left"
                    role="menuitem"
                  >
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      {session.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {new Date(session.savedAt).toLocaleString()}
                    </p>
                  </button>

                  <button
                    onClick={() => onDelete(session.id)}
                    className="
                      ml-2 shrink-0 text-slate-400 opacity-0 transition
                      hover:text-red-500 group-hover:opacity-100
                    "
                    aria-label={`Delete ${session.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}