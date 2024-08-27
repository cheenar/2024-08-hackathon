import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Camera, Eraser, OctagonX, Pen, PenLine, PlusCircle, Send } from "lucide-react";
import Markdown from "markdown-to-jsx";
import ollama, { Message } from "ollama/browser";
import { useCallback, useEffect, useRef, useState } from "react";

function handleRole(role: string, model: ModelCard): string {
  return role === "user" ? "Peter" : model.short_name;
}

interface ModelCard {
  model_name: string;
  model_description: string;
  model_context_length: string;
  short_name: string;
}

enum RegisteredModel {
  LLAMA_3_1_8B = "llama3.1",
  DEEPSEEKER_CODER_6_7B = "deepseek-coder:6.7b",
}

const REGISTERED_MODELS: Record<RegisteredModel, ModelCard> = {
  "llama3.1": {
    model_name: RegisteredModel.LLAMA_3_1_8B,
    model_description: "Meta Llama 3: The most capable openly available LLM to date. 8B parameters.",
    model_context_length: "128,000",
    short_name: "Meta",
  },
  "deepseek-coder:6.7b": {
    model_name: RegisteredModel.DEEPSEEKER_CODER_6_7B,
    model_description:
      "DeepSeek Coder is a capable coding model trained on two trillion code and natural language tokens.",
    model_context_length: "16,384",
    short_name: "DeepSeek",
  },
};

/**
 * Generates the used token length from the message history using the OpenAI estimate
 * of 4 tokens per character.
 *
 * @param messageHistory Get the total number of tokens used in the message history
 * @returns
 */
function computeUsedTokens(messageHistory: Message[]): string {
  return Math.ceil(messageHistory.reduce((acc, msg) => acc + msg.content.length, 0) / 4).toLocaleString();
}

export default function ClaudeInterface() {
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [isStreamingResponse, setIsStreamingResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [currentModelIndex, setCurrentModelIndex] = useState<RegisteredModel>(RegisteredModel.DEEPSEEKER_CODER_6_7B);
  const [currentModel, setCurrentModel] = useState<ModelCard>(REGISTERED_MODELS[RegisteredModel.DEEPSEEKER_CODER_6_7B]);

  useEffect(() => {
    setCurrentModel(REGISTERED_MODELS[currentModelIndex]);
  }, [currentModelIndex]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messageHistory, scrollToBottom]);

  const handleSendMessage = async () => {
    if (currentUserMessage.trim().length === 0) return;

    const newMessage: Message = { role: "user", content: currentUserMessage };
    setMessageHistory((prevMessages) => [...prevMessages, newMessage]);
    setCurrentUserMessage("");

    setIsStreamingResponse(true);
    let streamedContent = "";

    try {
      const response = await ollama.chat({
        model: currentModel.model_name,
        messages: [...messageHistory, newMessage],
        stream: true,
      });

      const currentMessages = [...messageHistory, newMessage];

      for await (const chunk of response) {
        streamedContent += chunk.message.content;
        setMessageHistory([...currentMessages, { role: "assistant", content: streamedContent }]);
      }
    } catch (error) {
      console.error("Error in chat stream:", error);
    } finally {
      setIsStreamingResponse(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-[#efeee5] p-4 h-screen flex flex-col text-gray-600">
      <main className="flex-grow flex flex-col items-center overflow-hidden">
        <h1 className="text-2xl font-serif mb-2 text-gray-700">Clxxde</h1>
        <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm mb-4">"Free" Plan</div>

        <div className="right-5 absolute bg-slate-100 p-4 rounded-lg">
          <button
            className="flex items-center text-gray-600 text-sm"
            onClick={() => {
              ollama.abort();
              setIsStreamingResponse(false);
              setMessageHistory([]);
            }}
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        <div className="w-full max-w-2xl flex-grow overflow-y-auto mb-4 px-4 rounded-sm">
          {messageHistory.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg flex items-center mb-2 ${
                msg.role === "user" ? "bg-gray-100 text-purple-700" : "bg-purple-100 text-purple-700"
              }`}
            >
              <span className="bg-purple-700 text-white text-xs px-1 rounded mr-2">
                {handleRole(msg.role, currentModel)}
              </span>
              <Markdown
                options={{
                  forceWrapper: true,
                }}
              >
                {msg.content}
              </Markdown>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white rounded-lg shadow-md w-full max-w-2xl p-4">
          <div className="flex items-center">
            <textarea
              placeholder={`How can ${currentModel.short_name} help you today?`}
              className="flex-grow p-2 text-gray-500 focus:outline-none"
              value={currentUserMessage}
              onChange={(e) => setCurrentUserMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreamingResponse}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                if (isStreamingResponse) {
                  ollama.abort();
                  setIsStreamingResponse(false);
                } else {
                  handleSendMessage();
                }
              }}
              // disabled={isStreaming || message.trim().length === 0}
              className={
                isStreamingResponse
                  ? "ml-2 bg-red-600 text-white p-2 rounded-full"
                  : "ml-2 bg-purple-600 text-white p-2 rounded-full"
              }
            >
              {isStreamingResponse ? <OctagonX className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex justify-between items-center mt-2">
            <div className="flex space-x-6">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-xs text-purple-500">{currentModel.model_name}</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{currentModel.model_name}</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs font-light w-[200px]">
                    {currentModel.model_description}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.entries(REGISTERED_MODELS).map(([_, model]) => {
                    return (
                      <>
                        <HoverCard key={model.model_name + ":card"}>
                          <HoverCardTrigger>
                            <DropdownMenuItem
                              key={model.model_name}
                              onClick={() => {
                                setMessageHistory([]);
                                setCurrentModelIndex(model.model_name as RegisteredModel);
                              }}
                            >
                              {model.model_name}
                            </DropdownMenuItem>
                            <HoverCardContent className="text-[10px] absolute left-[7rem] bottom-0">
                              <div>{model.model_description}</div>
                              <div className="mt-1">
                                <span className="font-semibold">Context Length</span>: {model.model_context_length}
                              </div>
                            </HoverCardContent>
                          </HoverCardTrigger>
                        </HoverCard>
                      </>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex space-x-1">
                {isStreamingResponse ? <PenLine className="w-3 h-3 mt-0.5" /> : <Pen className="w-3 h-3 mt-0.5" />}
                <span className="text-xs font-extralight">
                  {computeUsedTokens(messageHistory)} / {currentModel.model_context_length} Tokens
                </span>
              </div>
            </div>

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
}
