import { useRef } from "react"
import { Upload } from "lucide-react"

// props: onUpload = function that receives the picked File object
export default function ImageUploader({ onUpload }) {
  const inputRef = useRef(null)

  function handleChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    onUpload(file)
    event.target.value = ""
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        hidden
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="
          flex items-center gap-1.5 px-3 py-2 font-display text-sm font-medium
          text-ink-muted transition-all hover:text-ink
          active:scale-90
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