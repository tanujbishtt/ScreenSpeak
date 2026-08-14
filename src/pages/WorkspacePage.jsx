import { useState, useRef, useEffect } from "react"
import { images } from "../data/images"
import { promptTemplates } from "../data/promptTemplates"
import ChatInput from "../components/workspace/ChatInput"
import ChatBubble from "../components/workspace/ChatBubble"

function getRandomImage() {
  return images[Math.floor(Math.random() * images.length)]
}

// Fake AI reply generator — stands in for Gemini
function getMockResponse(type) {
  const responses = {
    description: "Nice try! Small fix: \"is walking\" instead of \"walk\" — present continuous fits better here since it's happening right now.",
    suggestions: "Try adding more detail — what's the weather like? What's the person wearing? Specifics make your sentence more vivid.",
    grammar: "One issue: subject-verb agreement. \"The dogs is running\" should be \"The dogs are running.\"",
    native: "A native speaker might say: \"There's a guy walking his dog in the rain.\" More casual, uses \"there's\" instead of naming the subject first.",
    genz: "no cap this guy just vibing in the rain with his dog fr 🐕🌧️",
    explain: "Your mistake was mixing tenses — you started in present tense then switched to past halfway through. Stick to one tense per sentence unless the timeline actually changes.",
  }
  return responses[type] || "Here's some feedback on that."
}

export default function WorkspacePage() {
  const [currentImage, setCurrentImage] = useState(getRandomImage)
  const [messages, setMessages] = useState([])
  const [hasDescribed, setHasDescribed] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function addMessage(msg) {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), ...msg }])
  }

  function handleDescriptionSubmit(text) {
    addMessage({ role: "user", content: text })
    setHasDescribed(true)

    setTimeout(() => {
      addMessage({ role: "assistant", content: getMockResponse("description") })
    }, 800)
  }

  function handleTemplateClick(template) {
    addMessage({ role: "user", content: template.label, isTemplate: true })

    setTimeout(() => {
      addMessage({ role: "assistant", content: getMockResponse(template.id), canRegenerate: true })
    }, 800)
  }

  function handleNextImage() {
    setCurrentImage(getRandomImage())
    setMessages([])
    setHasDescribed(false)
  }

  return (
    <div className="min-h-screen pt-28 px-6 pb-40">
      <div className="max-w-3xl mx-auto">

        <img
          src={currentImage.url}
          alt="Describe what's happening in this scene"
          className="w-full h-80 object-cover rounded-2xl mb-6"
        />

        <button
          onClick={handleNextImage}
          className="mb-6 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
        >
          Skip / New Image
        </button>

        <div className="flex flex-col gap-4 mb-6">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              onRegenerate={() => {
                // placeholder for now — real regenerate logic comes with Gemini step
                console.log("regenerate:", msg.content)
              }}
            />
          ))}
          <div ref={bottomRef} />
        </div>

        {hasDescribed && (
          <div className="flex flex-wrap gap-2 mb-6">
            {promptTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateClick(template)}
                className="rounded-full border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition"
              >
                {template.label}
              </button>
            ))}
          </div>
        )}

      </div>

      <div className="fixed bottom-6 left-0 right-0 px-6">
        <ChatInput onSubmit={handleDescriptionSubmit} />
      </div>
    </div>
  )
}