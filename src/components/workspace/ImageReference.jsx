import { BookOpen, Lightbulb, Sparkles } from "lucide-react"
import { promptTemplates } from "../../data/promptTemplates"
import ImageUploader from "./ImageUploader"

// props:
//   image, activeTab, setActiveTab, hasDescribed, onUpload, onTemplateClick
export default function ImageReference({
  image,
  activeTab,
  setActiveTab,
  hasDescribed,
  onUpload,
  onTemplateClick,
}) {
  const isCurated = Boolean(image.vocab)

  const tabButtonClass = (tab) =>
    `px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
      activeTab === tab
        ? "border-primary text-primary"
        : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
    }`

  return (
    <div>
      {/* Tab row scrolls horizontally too if it's ever too narrow (e.g. small
          phones) — no-scrollbar keeps the scrollbar itself invisible. */}
      <div className="no-scrollbar mb-4 flex items-center justify-between gap-2 overflow-x-auto border-b border-border">
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

              <button
                onClick={() => setActiveTab(activeTab === "reference" ? null : "reference")}
                className={tabButtonClass("reference")}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} />
                  Native / Gen-Z
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
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {vocab.word}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400"> — {vocab.meaning}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "solution" && (
            <div className="mb-4 text-sm text-slate-700 dark:text-slate-300">
              {image.solution}
            </div>
          )}

          {activeTab === "reference" && (
            <div className="mb-4 flex flex-col gap-3 text-sm">
              <div>
                <p className="mb-1 font-semibold text-slate-900 dark:text-white">Native way</p>
                <p className="text-slate-700 dark:text-slate-300">{image.nativeWay}</p>
              </div>
              <div>
                <p className="mb-1 font-semibold text-slate-900 dark:text-white">Gen-Z way</p>
                <p className="text-slate-700 dark:text-slate-300">{image.genZWay}</p>
              </div>
            </div>
          )}
        </>
      )}

      {!isCurated && (
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          This is your own uploaded image — no vocab/solution hints for it, but you can still get
          full AI feedback on your description below.
        </p>
      )}

      {/* Template chips: horizontal scroll strip, NEVER wraps. This is the
          key fix — previously these wrapped onto 2-3 lines and pushed the
          chat panel down out of view on mobile. */}
      {hasDescribed && (
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pt-2">
          {promptTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => onTemplateClick(template)}
              className="
                shrink-0 whitespace-nowrap rounded-full border border-border
                bg-surface/70 px-4 py-1.5 text-sm font-medium text-slate-600
                shadow-sm transition-all hover:scale-105
                hover:border-slate-400 hover:bg-surface
                dark:border-white/10 dark:bg-white/5 dark:text-slate-300
                dark:hover:bg-white/10
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