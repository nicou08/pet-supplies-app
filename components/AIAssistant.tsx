"use client";

import Link from "next/link";
import { FormEvent, useState, useEffect, useRef } from "react";
import { MessageSquare, X, Loader2, ArrowUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: number;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! How can I help with your pet supplies needs today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleMessageSend = (e: FormEvent) => {
    e.preventDefault();
    if (!input) return;
    const newMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        content:
          "For your Guinea Pig, I recommend Premium Timothy Hay, Ultra Comfort Guinea Pig Hideout, and Vitamin C Supplements.",
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setIsLoading(false);
    }, 3000);
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset height before calculating scrollHeight
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div>
      {/* Button to open the chat window */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
        aria-label="Chat with AI Assistant"
      >
        <MessageSquare size={24} />
      </Button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 w-[480px] h-[600px]">
          <Card className="flex flex-col justify-between w-full h-full z-50 border border-neutral-700 overflow-hidden">
            {/* Header of the chat window */}
            <CardHeader className="bg-slate-300 py-3">
              <div className="flex justify-between items-center">
                <CardTitle className="font-medium text-black text-lg">
                  Pet Assistant
                </CardTitle>
                {/* Button to close the chat window */}
                <Button
                  onClick={() => setIsOpen(false)}
                  className="p-0 h-7 w-7 bg-transparent hover:bg-slate-400 border border-slate-400 rounded shadow-xl"
                >
                  <X size={18} />
                </Button>
              </div>
            </CardHeader>

            {/* Content area of the chat window */}
            <CardContent className="text-xl px-0 pb-0 flex-grow overflow-hidden">
              <ScrollArea
                className="flex w-full px-5 h-full"
                ref={scrollAreaRef}
              >
                <div className="h-4" />
                {/* Render each message */}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex py-2 ${
                      message.sender === "assistant"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div className="items-center px-3 py-1 bg-slate-600 max-w-[75%] rounded-lg text-base text-white">
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[70%] rounded-lg px-3 py-2 bg-muted">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                        <div
                          className="w-2 h-2 rounded-full bg-current animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-current animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="h-4" />
              </ScrollArea>
            </CardContent>

            <CardFooter className="w-full py-3 px-4 border-t border-neutral-700">
              <form
                className="flex justify-center items-center border border-neutral-700 rounded-lg w-full"
                onSubmit={handleMessageSend}
              >
                <Textarea
                  ref={textAreaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault(); // Prevent default behavior of adding a new line
                      handleMessageSend(e); // Trigger the message send function
                    }
                  }}
                  className="flex-1 p-2 max-h-80 border-0 resize-none rounded-l-lg rounded-r-none focus-visible:ring-0"
                  placeholder="Ask about pet supplies..."
                />
                <div className="flex justify-end px-3 py-3">
                  <Button
                    size="icon"
                    type="submit"
                    className="bg-blue-600 text-white p-0 rounded-lg h-8 w-8"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <ArrowUp className="!w-5 !h-5" />
                    )}
                  </Button>
                </div>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
