import { BookOpen, Lightbulb } from "lucide-react"
import { promptTemplates, referenceTemplates } from "../../data/promptTemplates"
import ImageUploader from "./ImageUploader"

export default function ImageReference({
  image,
  activeTab,
  setActiveTab,
  hasDescribed,
  onUpload,
  onTemplateClick,
  onReferenceClick,
}) {
  const isCurated = Boolean(image.vocab)

  const tabButtonClass = (tab) =>
    `px-3 py-2 font-display text-sm font-medium border-b-2 transition-all active:scale-90 whitespace-nowrap ${
      activeTab === tab
        ? "border-ink text-ink"
        : "border-transparent text-ink-muted hover:text-ink"
    }`

  return (
    <div>
      <div className="no-scrollbar mb-4 flex items-center justify-between gap-2 overflow-x-auto border-b-2 border-ink">
        <div className="flex items-center gap-4">
          {isCurated && (
            <>
              <button
                onClick={() => setActiveTab(activeTab === "vocab" ? null : "vocab")}
                className={tabButtonClass("vocab")}
              >
                <span className="flex items-center gap-1.5">
                  <BookOpen size={14} />
                  Vocab
                </span>
              </button>

              <button
                onClick={() => setActiveTab(activeTab === "solution" ? null : "solution")}
                className={tabButtonClass("solution")}
              >
                <span className="flex items-center gap-1.5">
                  <Lightbulb size={14} />
                  Solution
                </span>
              </button>
            </>
          )}
        </div>

        <ImageUploader onUpload={onUpload} />
      </div>

      {isCurated && (
        <>
          {activeTab === "vocab" && (
            <div className="mb-4 flex flex-col gap-2">
              {image.vocab.map((vocab) => (
                <div key={vocab.word} className="text-sm">
                  <span className="font-display font-semibold text-ink">
                    {vocab.word}
                  </span>
                  <span className="text-ink-muted"> — {vocab.meaning}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "solution" && (
            <div className="mb-4 text-sm text-ink">
              {image.solution}
            </div>
          )}
        </>
      )}

      {!isCurated && (
        <p className="mb-4 text-sm text-ink-muted">
          This is your own uploaded image — no vocab/solution hints for it, but you can still get
          full AI feedback on your description below.
        </p>
      )}

      {hasDescribed && (
        <div className="flex-wrap no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pt-2">
          {promptTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => onTemplateClick(template)}
              className="
                shrink-0 whitespace-nowrap rounded-full border-2 border-ink
                bg-cream-surface px-4 py-1.5 font-display text-sm font-medium text-ink
                shadow-brutal-sm transition-all hover:-translate-y-0.5
                hover:shadow-brutal active:translate-y-0 active:shadow-brutal-sm
              "
            >
              {template.label}
            </button>
          ))}

          {isCurated &&
            referenceTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onReferenceClick(template)}
                className="
                  shrink-0 whitespace-nowrap rounded-full border-2 border-ink
                  bg-cream-surface px-4 py-1.5 font-display text-sm font-medium text-ink
                  shadow-brutal-sm transition-all hover:-translate-y-0.5
                  hover:shadow-brutal active:translate-y-0 active:shadow-brutal-sm
                "
              >
                {template.label}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}