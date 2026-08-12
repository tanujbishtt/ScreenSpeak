import ChatInput from "../components/workspace/ChatInput";

export default function WorkspacePage() {
  return (
    <>
      <h1 className="p-8 text-slate-900 dark:text-white">WorkSpace Page</h1>
      <ChatInput onSubmit={(text) => console.log(text)} />
    </>
  );
}
