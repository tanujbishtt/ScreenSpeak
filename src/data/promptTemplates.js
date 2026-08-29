// AI-driven templates — these send a prompt to the model about the user's
// own typed description, so they need a real-time call.
export const promptTemplates = [
  { id: "suggestions", label: "Give me Suggestions", prompt: "Give me some suggestions to make my description more detailed or vivid." },
  { id: "grammar", label: "Grammar Errors", prompt: "Point out only the grammar mistakes in my description, nothing else." },
  { id: "explain", label: "Explain My Errors", prompt: "Explain in more detail why my description had mistakes, and how to avoid them next time." },
]

// Reference templates — these just display a field already sitting on the
// curated image's Firestore doc. No AI call, instant, only shown for
// curated images (uploaded images don't have these fields authored).
export const referenceTemplates = [
  { id: "native", label: "Native Way to Write It", field: "nativeWay" },
  { id: "genz", label: "Gen-Z Way to Write It", field: "genZWay" },
  { id: "shakespearean", label: "Shakespearean Way to Write It", field: "shakesparean" },
]