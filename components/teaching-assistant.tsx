"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, GraduationCap, Send, Sparkles, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

// Markdown components
import "highlight.js/styles/github-dark.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

type Source = {
  id: string;
  title: string;
  content: string;
  url?: string;
};

type TeachingAssistantProps = {
  courseId: string;
  lessonId: string;
  moduleName: string;
  lessonName: string;
};

import { TypingEffect } from "./typing-effect";

export default function TeachingAssistant({
  courseId,
  lessonId,
  moduleName,
  lessonName,
}: TeachingAssistantProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi there! I'm your Teaching Assistant for this lesson on **${lessonName}**. Feel free to ask me any questions about the content, and I'll do my best to help you understand the material better.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSource, setActiveSource] = useState<Source | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingMessageIndex, setCurrentTypingMessageIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Sample sources for demonstration
  const sampleSources = [
    {
      id: "source-1",
      title: "Course Textbook",
      content:
        "This is the main textbook content related to the current lesson. It contains detailed explanations and examples.",
      url: "#",
    },
    {
      id: "source-2",
      title: "Additional Reading",
      content:
        "Supplementary material that provides deeper insights into the concepts covered in this lesson.",
      url: "#",
    },
    {
      id: "source-3",
      title: "Related Research Paper",
      content:
        "Academic research that explores advanced applications of the concepts taught in this lesson.",
      url: "#",
    },
  ];

  useEffect(() => {
    // Add initial greeting message
    setMessages([
      {
        role: "assistant",
        content: `Hi there! I'm your Teaching Assistant for this lesson. I can help explain concepts, answer questions, or provide additional examples. I can also do deep dives into topics with detailed explanations and references to source materials. How can I assist you with "${lessonName}" today?`,
        sources: sampleSources,
      },
    ]);
  }, [lessonName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOverlayOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message then a placeholder assistant message we'll stream into
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/teaching-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          courseId,
          lessonId,
          moduleName,
          lessonName,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response");
      }

      // Read plain text stream (toTextStreamResponse emits raw text chunks)
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        // Update the last (placeholder) assistant message in place
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: accumulated,
          };
          return updated;
        });
      }
    } catch (error) {
      console.error("Error getting TA response:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove the empty placeholder
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle typing effect completion
  const handleTypingComplete = () => {
    setIsTyping(false);
    setCurrentTypingMessageIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "Can you explain this concept in simpler terms?",
    "What are some real-world applications of this?",
    "Could you provide more examples?",
    "How does this relate to other topics in the course?",
  ];

  // Toggle overlay
  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
    if (!isOverlayOpen) {
      // When opening overlay, make sure it's not minimized
      setIsMinimized(false);
    }
  };

  // Close overlay with escape key and listen for toggle event
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOverlayOpen) {
        setIsOverlayOpen(false);
      }
    };

    const handleToggleEvent = () => {
      toggleOverlay();
    };

    window.addEventListener("keydown", handleEscapeKey);
    document.addEventListener("toggle-teaching-assistant", handleToggleEvent);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
      document.removeEventListener("toggle-teaching-assistant", handleToggleEvent);
    };
  }, [isOverlayOpen, toggleOverlay]);

  // Render message content with typing effect if needed
  const renderMessageContent = (message: Message, index: number) => {
    if (message.role === "assistant") {
      if (isTyping && currentTypingMessageIndex === index) {
        return (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              p: ({ node, ...props }) => (
                <p className="my-2">
                  <TypingEffect
                    text={String(props.children).replace(/,/g, "")}
                    onComplete={handleTypingComplete}
                  />
                </p>
              ),
              // Other components remain the same
              pre: ({ node, ...props }) => (
                <pre className="bg-zinc-900 p-4 rounded-md overflow-auto my-2 w-full" {...props} />
              ),
              code: ({ node, className, children, ...props }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="bg-zinc-800 px-1 py-0.5 rounded text-pink-400" {...props}>
                    {children}
                  </code>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              a: ({ node, ...props }) => (
                <a
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-2" {...props} />,
              li: ({ node, ...props }) => <li className="my-1" {...props} />,
              h1: ({ node, ...props }) => <h1 className="text-xl font-bold my-3" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-lg font-bold my-2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-md font-bold my-2" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-zinc-500 pl-4 italic my-2" {...props} />
              ),
              table: ({ node, ...props }) => (
                <div className="overflow-auto my-2">
                  <table className="border-collapse border border-zinc-700" {...props} />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th className="border border-zinc-700 px-4 py-2 bg-zinc-800" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="border border-zinc-700 px-4 py-2" {...props} />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        );
      } else {
        return (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              pre: ({ node, ...props }) => (
                <pre className="bg-zinc-900 p-4 rounded-md overflow-auto my-2 w-full" {...props} />
              ),
              code: ({ node, className, children, ...props }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="bg-zinc-800 px-1 py-0.5 rounded text-pink-400" {...props}>
                    {children}
                  </code>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              a: ({ node, ...props }) => (
                <a
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-2" {...props} />,
              li: ({ node, ...props }) => <li className="my-1" {...props} />,
              h1: ({ node, ...props }) => <h1 className="text-xl font-bold my-3" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-lg font-bold my-2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-md font-bold my-2" {...props} />,
              p: ({ node, ...props }) => <p className="my-2" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-zinc-500 pl-4 italic my-2" {...props} />
              ),
              table: ({ node, ...props }) => (
                <div className="overflow-auto my-2">
                  <table className="border-collapse border border-zinc-700" {...props} />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th className="border border-zinc-700 px-4 py-2 bg-zinc-800" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="border border-zinc-700 px-4 py-2" {...props} />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        );
      }
    } else {
      return <div className="whitespace-pre-wrap">{message.content}</div>;
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <div className="fixed bottom-8 right-8 z-40">
        <Button
          onClick={toggleOverlay}
          size="lg"
          className="rounded-full h-16 w-16 shadow-xl flex items-center justify-center bg-primary hover:bg-primary/90"
        >
          <GraduationCap className="h-7 w-7" />
          <span className="sr-only">Open Teaching Assistant</span>
        </Button>
      </div>

      {/* Sidebar Sidebar Overlay */}
      <AnimatePresence>
        {isOverlayOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleOverlay}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-background/95 backdrop-blur-md border-l shadow-2xl z-[100] flex flex-col"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm font-bold flex items-center gap-2">
                        LearnLM{" "}
                        <Badge variant="secondary" className="text-[10px] h-4">
                          PRO
                        </Badge>
                      </h2>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                        {lessonName}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8"
                    onClick={toggleOverlay}
                  >
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>

                {/* Chat Area */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4 pb-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground rounded-tr-none"
                              : "bg-muted dark:bg-zinc-800 rounded-tl-none border border-border/50"
                          }`}
                        >
                          <div className="markdown-content prose prose-sm dark:prose-invert max-w-none">
                            {renderMessageContent(message, index)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Suggested Questions */}
                {!isLoading && messages.length < 3 && (
                  <div className="px-4 py-2 border-t bg-muted/30">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">
                      Suggested
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setInput(q);
                          }}
                          className="text-xs text-left px-3 py-1.5 rounded-full bg-background border hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t bg-background">
                  <div className="relative group">
                    <Textarea
                      placeholder="Ask LearnLM..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="min-h-[60px] max-h-[160px] pr-12 py-3 px-4 resize-none text-sm rounded-2xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
                      rows={1}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                      size="icon"
                      className="absolute right-2 bottom-2 rounded-xl h-8 w-8 transition-transform active:scale-95"
                    >
                      {isLoading ? (
                        <Sparkles className="h-4 w-4 animate-pulse" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-[9px] text-center text-muted-foreground mt-3">
                    Powered by Google Gemini 2.5 Pro. Use responsibly.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
