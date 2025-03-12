"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Loader2, Minimize } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";

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
        content: "This is AI response",
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
        aria-label="Chat with AI Assistant"
      >
        <MessageSquare size={24} />
      </Button>
      {isOpen && (
        <Card className="fixed bottom-24 right-8 w-[480px] h-[600px] z-50 border border-neutral-700 overflow-hidden">
          <CardHeader className="bg-slate-300 py-3">
            <div className="flex justify-between items-center">
              <CardTitle className="font-medium text-black text-lg">
                Pet Assistant
              </CardTitle>
              <Button
                onClick={() => setIsOpen(false)}
                className="p-0 h-7 w-7 bg-transparent hover:bg-slate-400 border border-slate-400 rounded shadow-xl"
              >
                <X size={18} />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="text-xl px-0">
            <ScrollArea
              className="flex w-full h-[484px] px-5 "
              ref={scrollAreaRef}
            >
              <div className="h-4" />
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex py-1 ${
                    message.sender === "assistant"
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div className="items-center p-2 bg-slate-600 max-w-[70%] rounded-lg text-base text-white">
                    {message.content}
                  </div>
                </div>
              ))}
              <div className="h-4" />
            </ScrollArea>
          </CardContent>

          <CardFooter className="absolute bottom-0 w-full h-16 pt-4 border-t border-neutral-700">
            <form className="flex gap-2 w-full" onSubmit={handleMessageSend}>
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 border border-neutral-700 rounded-lg"
                placeholder="Ask about pet supplies..."
              />
              <Button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-lg h-9 w-9"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
