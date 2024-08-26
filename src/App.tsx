import { Camera, PlusCircle, Send } from "lucide-react";
import ollama, { Message } from "ollama/browser";
import { useEffect, useRef, useState } from "react";

function handleRole(role: string) {
  return role === "user" ? "Peter" : "Clxxde";
}

const ClaudeInterface = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (message.trim().length === 0) return;

    const newMessage: Message = { role: "user", content: message };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");

    setIsStreaming(true);
    let streamedContent = "";

    try {
      const response = await ollama.chat({
        model: "llama3.1",
        messages: [...messages, newMessage],
        stream: true,
      });

      const currentMessages = [...messages, newMessage];

      for await (const chunk of response) {
        streamedContent += chunk.message.content;
        setMessages([...currentMessages, { role: "assistant", content: streamedContent }]);
      }
    } catch (error) {
      console.error("Error in chat stream:", error);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-[#efeee5] p-4 h-screen flex flex-col text-gray-600">
      <main className="flex-grow flex flex-col items-center overflow-hidden">
        <h1 className="text-2xl font-serif mb-2 text-gray-700">Clxxde</h1>
        <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm mb-4">Frugal Plan</div>

        <div className="w-full max-w-2xl flex-grow overflow-y-auto mb-4 px-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg flex items-center mb-2 ${
                msg.role === "user" ? "bg-gray-100 text-purple-700" : "bg-purple-100 text-purple-700"
              }`}
            >
              <span className="bg-purple-700 text-white text-xs px-1 rounded mr-2">{handleRole(msg.role)}</span>
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white rounded-lg shadow-md w-full max-w-2xl p-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="How can Clxxde help you today?"
              className="flex-grow p-2 text-gray-500 focus:outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
            />
            <button
              onClick={handleSendMessage}
              disabled={isStreaming || message.trim().length === 0}
              className="ml-2 bg-purple-600 text-white p-2 rounded-full disabled:bg-gray-400"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-purple-600">Ollama 3.1 8B</div>

            <div className="flex items-center space-x-2">
              <button className="flex items-center text-gray-600 text-sm">
                <PlusCircle className="w-4 h-4 mr-1" /> Add content
              </button>
              <Camera className="text-gray-600 w-4 h-4" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClaudeInterface;
