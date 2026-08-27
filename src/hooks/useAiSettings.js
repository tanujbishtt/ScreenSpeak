// Real implementation moved to AiSettingsContext.jsx — a plain custom hook
// gives every calling component its OWN private state, which is exactly
// why ApiKeyDropdown and WorkspacePage were going out of sync. Context
// gives everyone one shared state instead. This re-export means every
// other file's `import { useAiSettings } from "../hooks/useAiSettings"`
// keeps working with zero changes.
export { useAiSettings } from "../context/AiSettingsContext"