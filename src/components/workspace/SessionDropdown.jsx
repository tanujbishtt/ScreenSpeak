import { useEffect, useRef, useState } from "react"
import { ChevronDown, Plus, Trash2 } from "lucide-react"

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
      setDraft(sessionName)
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
            w-32 rounded-lg border-2 border-ink bg-cream px-2 py-1
            font-display text-sm font-medium text-ink outline-none
            focus:shadow-brutal-sm
          "
        />
      ) : (
        <button
          onClick={startEditing}
          disabled={!canRename}
          title={canRename ? "Click to rename & save" : "Start chatting to save a session"}
          className="
            max-w-28 truncate rounded-lg px-2 py-1.5 text-left
            font-display text-sm font-medium text-ink transition hover:bg-cream
            disabled:cursor-not-allowed disabled:opacity-50
            sm:max-w-40
          "
        >
          {sessionName}
        </button>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          rounded-lg p-1 text-ink-muted transition hover:bg-cream
          hover:text-ink
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
            overflow-hidden rounded-2xl border-2 border-ink
            bg-cream-surface p-1.5 shadow-brutal-lg
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
              text-left font-display text-sm font-medium text-ink
              transition hover:bg-cream-panel
            "
            role="menuitem"
          >
            <Plus size={14} />
            New session
          </button>

          <div className="my-1.5 h-px bg-ink/15" />

          {sessions.length === 0 ? (
            <p className="px-3 py-2.5 text-xs text-ink-muted">
              No saved sessions yet.
            </p>
          ) : (
            <div className="no-scrollbar max-h-64 overflow-y-auto">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="
                    group flex w-full items-center justify-between rounded-xl
                    px-3 py-2.5 transition hover:bg-cream-panel
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
                    <p className="font-display text-sm font-medium text-ink">
                      {session.name}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {new Date(session.savedAt).toLocaleString()}
                    </p>
                  </button>

                  <button
                    onClick={() => onDelete(session.id)}
                    className="
                      ml-2 shrink-0 text-ink-muted opacity-0 transition
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