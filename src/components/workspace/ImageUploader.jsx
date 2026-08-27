import { useRef } from "react"
import { Upload } from "lucide-react"

// props: onUpload = function that receives the picked File object
export default function ImageUploader({ onUpload }) {
  // useRef gives us a direct handle to the actual <input> DOM element,
  // so we can call .click() on it manually from our own button.
  const inputRef = useRef(null)

  function handleChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    onUpload(file)

    // Reset the input's value. Without this, picking the SAME file twice in
    // a row wouldn't fire onChange the second time (browser sees "no change").
    event.target.value = ""
  }

  return (
    <>
      {/* This input is invisible (hidden) — we never show it directly */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        hidden
      />

      {/* Styled to match the Vocab/Solution/Native-GenZ tab buttons next to
          it, since it now lives inline in that row (not floating on the image). */}
      <button
        onClick={() => inputRef.current?.click()}
        className="
          flex items-center gap-1.5 px-3 py-2 text-sm font-medium
          text-slate-500 transition-all hover:text-slate-800
          active:scale-90 dark:text-slate-400 dark:hover:text-white
        "
        aria-label="Upload your own image"
        title="Upload your own image"
      >
        <Upload size={14} />
        Upload
      </button>
    </>
  )
}