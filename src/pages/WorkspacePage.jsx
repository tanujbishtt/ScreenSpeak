import { useState, useRef, useEffect } from "react";
import { BookOpen, Lightbulb, SkipForward, Menu } from "lucide-react";
import { images } from "../data/images";
import { promptTemplates } from "../data/promptTemplates";
import ChatInput from "../components/workspace/ChatInput";
import ChatBubble from "../components/workspace/ChatBubble";
import Sidebar from "../components/workspace/Sidebar";
import Logo from "../components/layout/Logo";
import {GithubIcon} from '../components/icons/BrandIcons'

function getRandomImage() {
  return images[Math.floor(Math.random() * images.length)];
}

function getMockResponse(type) {
  const responses = {
    description:
      'Nice try! Small fix: "is walking" instead of "walk" — present continuous fits better here since it\'s happening right now.',
    suggestions:
      "Try adding more detail — what's the weather like? What's the person wearing? Specifics make your sentence more vivid.",
    grammar:
      'One issue: subject-verb agreement. "The dogs is running" should be "The dogs are running."',
    native:
      'A native speaker might say: "There\'s a guy walking his dog in the rain." More casual, uses "there\'s" instead of naming the subject first.',
    genz: "no cap this guy just vibing in the rain with his dog fr 🐕🌧️",
    explain:
      "Your mistake was mixing tenses — you started in present tense then switched to past halfway through. Stick to one tense per sentence unless the timeline actually changes.",
    followup:
      "Good question! Since we haven't wired up the real AI yet, this is just a placeholder reply — but this is where a real, contextual answer to whatever you asked will show up.",
  };
  return responses[type] || "Here's some feedback on that.";
}

export default function WorkspacePage() {
  const [currentImage, setCurrentImage] = useState(getRandomImage);
  const [messages, setMessages] = useState([]);
  const [hasDescribed, setHasDescribed] = useState(false);
  const [showVocab, setShowVocab] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function addMessage(msg) {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), ...msg },
    ]);
  }

  function handleUserMessage(text) {
    addMessage({ role: "user", content: text });

    if (!hasDescribed) {
      setHasDescribed(true);
      setTimeout(() => {
        addMessage({
          role: "assistant",
          content: getMockResponse("description"),
        });
      }, 800);
    } else {
      setTimeout(() => {
        addMessage({
          role: "assistant",
          content: getMockResponse("followup"),
          canRegenerate: true,
        });
      }, 800);
    }
  }

  function handleTemplateClick(template) {
    addMessage({ role: "user", content: template.label, isTemplate: true });
    setTimeout(() => {
      addMessage({
        role: "assistant",
        content: getMockResponse(template.id),
        canRegenerate: true,
      });
    }, 800);
  }

  function handleNextImage() {
    setCurrentImage(getRandomImage());
    setMessages([]);
    setHasDescribed(false);
    setShowVocab(false);
    setShowSolution(false);
  }

  return (
    <div className="h-screen w-full overflow-hidden pt-6 px-6 pb-6">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="fixed top-6 left-6 z-30 flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-2xl text-slate-700 dark:text-white shadow-lg"
        >
          <Menu size={20} />
        </button>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Session 1
        </span>
      </div>

      <a
        href="https://github.com/tanujbishtt/ScreenSpeak"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-6 right-6 z-30 flex items-center gap-1.5 rounded-full border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-2xl px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-white shadow-lg hover:bg-white/80 dark:hover:bg-white/10 transition"
      >
        <GithubIcon size={16} />
        Star
      </a> 

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 h-full min-h-0 pt-16">
        {/* Left: image + tiles — fixed in place, no scroll */}
        <div className="flex flex-col h-full min-h-0 overflow-y-auto no-scrollbar pr-1">
          <div className="relative mb-4">
            <img
              src={currentImage.url}
              alt="Describe what's happening in this scene"
              className="w-full h-80 object-cover rounded-2xl"
            />
            <span className="absolute top-3 left-3 rounded-full bg-black/50 backdrop-blur-md px-3 py-1 text-xs font-medium text-white capitalize">
              {currentImage.category}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => setShowVocab(!showVocab)}
              className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md py-3 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              <BookOpen size={16} />
              Vocab
            </button>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md py-3 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              <Lightbulb size={16} />
              Solution
            </button>
            <button
              onClick={handleNextImage}
              className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md py-3 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              <SkipForward size={16} />
              Skip
            </button>
          </div>

          {showVocab && (
            <div className="mb-4 rounded-xl border border-slate-200 dark:border-white/10 border-l-2 border-l-blue-500 bg-white/60 dark:bg-white/5 backdrop-blur-md p-4">
              <div className="flex flex-col gap-2">
                {currentImage.vocab.map((v) => (
                  <div key={v.word} className="text-sm">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {v.word}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {" "}
                      — {v.meaning}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showSolution && (
            <div className="mb-4 rounded-xl border border-slate-200 dark:border-white/10 border-l-2 border-l-amber-500 bg-white/60 dark:bg-white/5 backdrop-blur-md p-4 text-sm text-slate-700 dark:text-slate-300">
              {currentImage.solution}
            </div>
          )}

          {hasDescribed && (
            <div className="flex flex-wrap justify-center gap-2">
              {promptTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className="rounded-full border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:scale-105 transition-all"
                >
                  {template.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: boxed chat panel */}
        <div className="flex flex-col h-full min-h-0 rounded-3xl border border-slate-200/60 dark:border-white/10 bg-slate-900/3 dark:bg-black/20 backdrop-blur-md p-2">
          {messages.length === 0 ? (
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center px-6">
              <Logo size={40} />
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                Describe what's happening in the photo to start practicing —
                I'll give you feedback right here.
              </p>
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col justify-end gap-4 pr-1">
              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  onRegenerate={() => console.log("regenerate:", msg.content)}
                />
              ))}
              <div ref={bottomRef} />
            </div>
          )}

          <div className="pt-4">
            <ChatInput onSubmit={handleUserMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}
