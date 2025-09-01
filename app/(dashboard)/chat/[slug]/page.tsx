"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/auth-provider";
import { useIsLoading } from "@/hooks/use-auth-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  Plus,
  ArrowLeft,
  Trash2,
  Copy,
  Check,
  Loader2,
  Database,
  Paperclip,
  ArrowUp,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentLayout } from "@/components/sidebar/content-layout";
import { useChat } from "@/lib/chat-context";
import { EnhancedTypingIndicator } from "@/components/chat/typing-indicator";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PromptTextarea } from "@/components/custom-ui/prompt-text-area";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownRenderer } from "@/components/chat/markdown-renderer";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthContext();
  const isLoading = useIsLoading();
  const {
    chats,
    getChatBySlug,
    sendMessage,
    deleteChat,
    renameChat,
    getStreamingContent,
  } = useChat();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const slug = params.slug as string;
  // Get chat from context state instead of getChatBySlug to ensure reactivity
  const chat = chats.find((c: any) => c.slug === slug);

  // Set loading state and redirect if chat not found
  useEffect(() => {
    if (!slug) return;

    if (!chat) {
      setLoading(false);
      router.push("/chat/new");
      return;
    }

    setLoading(false);
    setEditTitle(chat.title);
  }, [slug, chat, router]);

  // Check for initial message from new chat creation
  useEffect(() => {
    if (!chat) return;

    console.log("Chat page loaded, checking for initial message...");
    console.log("Current chat ID:", chat.id);
    console.log("Current chat messages:", chat.messages);

    const initialMessageData = sessionStorage.getItem("initialMessage");
    console.log(
      "Initial message data from sessionStorage:",
      initialMessageData
    );

    if (initialMessageData) {
      try {
        const { chatId, content, model } = JSON.parse(initialMessageData);
        console.log("Parsed initial message:", { chatId, content, model });
        console.log(
          "Comparing chatId:",
          chatId,
          "with current chat.id:",
          chat.id
        );

        // Check if this is the chat we're looking for
        if (chatId === chat.id) {
          console.log(
            "Found initial message for this chat, sending automatically"
          );

          // Remove the initial message data
          sessionStorage.removeItem("initialMessage");

          // Send the message automatically
          sendMessage(chat.id, content, model)
            .then(() => {
              console.log("Initial message sent successfully");
            })
            .catch((error) => {
              console.error("Failed to send initial message:", error);
            });
        } else {
          console.log("Chat ID mismatch, not sending initial message");
        }
      } catch (error) {
        console.error("Failed to parse initial message data:", error);
        sessionStorage.removeItem("initialMessage");
      }
    } else {
      console.log("No initial message found in sessionStorage");
    }
  }, [chat, sendMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !chat || sending) return;

    setSending(true);

    try {
      await sendMessage(chat.id, message.trim(), chat.model);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleNewChat = () => {
    router.push("/chat/new");
  };

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleDeleteChat = async () => {
    if (!chat || !confirm("Are you sure you want to delete this chat?")) return;

    try {
      deleteChat(chat.id);
      router.push("/chat/new");
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const handleStartEditTitle = () => {
    setEditingTitle(true);
    setEditTitle(chat?.title || "");
  };

  const handleSaveTitle = () => {
    if (chat && editTitle.trim()) {
      renameChat(chat.id, editTitle.trim());
    }
    setEditingTitle(false);
  };

  const handleCancelEditTitle = () => {
    setEditingTitle(false);
    setEditTitle(chat?.title || "");
  };

  // Helper function to get display content for a message
  const getMessageDisplayContent = (msg: any) => {
    // For streaming messages, use the content field (which gets updated by pushStreamingChunk)
    if (msg.isStreaming) {
      return msg.content || "";
    }

    return msg.content || "";
  };

  // Show loading state while authentication is being restored
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only check for user after loading is complete
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Please log in to access chat</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Chat not found</p>
      </div>
    );
  }

  return (
    <ContentLayout
      title={""}
      showContextToggle={true}
      contextType="chat"
      maxWidth="none"
      className="overflow-hidden"
    >
      <div
        className="flex flex-col overflow-hidden "
        style={{
          height: "100vh", // Full viewport height since navbar overlaps
          padding: "0",
          margin: "0",
        }}
      >
        {/* Messages Container with ScrollArea */}
        <div
          className="flex-1 relative"
          style={{ height: "100vh" }} // Full height since navbar overlaps
        >
          <ScrollArea className="h-full w-full">
            <div className="h-full min-h-screen  p-4 space-y-4 chat-messages pt-[66px] pb-60 md:max-w-5xl mx-auto shadow-xl bg-background">
              {chat.messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3",
                    msg.role === "assistant" ? "justify-start" : "justify-end",
                    msg.isStreaming && "streaming-message"
                  )}
                >
                  {msg.role === "assistant" && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/ai-avatar.png" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}

                  <Card
                    className={cn(
                      "max-w-[80%] relative",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground py-0 p-2"
                        : "bg-muted py-0 p-2"
                    )}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 streaming-content">
                          {msg.role === "assistant" ? (
                            <MarkdownRenderer
                              content={getMessageDisplayContent(msg)}
                            />
                          ) : (
                            <div className="whitespace-pre-wrap streaming-text">
                              {getMessageDisplayContent(msg)}
                            </div>
                          )}

                          {/* Show typing indicator only when streaming */}
                          {msg.isStreaming && (
                            <div className="mt-2">
                              <EnhancedTypingIndicator isStreaming={true} />
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleCopyMessage(
                              getMessageDisplayContent(msg),
                              msg.id
                            )
                          }
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs opacity-70 mt-2">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </CardContent>
                    {msg.role === "assistant" && (
                      <div className="absolute right-0 left-5 -bottom-7 flex gap-5 items-center justify-start text-muted-foreground">
                        <div className="relative group">
                          <div className="cursor-pointer hover:text-primary transition-colors">
                            {copiedId === msg.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy 
                                className="w-4 h-4" 
                                onClick={() => handleCopyMessage(getMessageDisplayContent(msg), msg.id)}
                              />
                            )}
                          </div>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            {copiedId === msg.id ? "Copied!" : "Copy"}
                          </div>
                        </div>
                        <ThumbsUp className="w-4 h-4" />
                        <ThumbsDown className="w-4 h-4" />
                      </div>
                    )}

                  </Card>

                  {msg.role === "user" && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input - Absolutely positioned on top of ScrollArea */}
          <div className="absolute bottom-5 left-0 right-0 p-4 ">
            <div className="max-w-[60rem] mx-auto">
              <div className="border bg-background/60 backdrop-blur-2xl rounded-xl shadow-lg p-4">
                <div className="flex flex-col gap-4">
                  <PromptTextarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setMessage(e.target.value)
                    }
                    placeholder="What would you like to know? Ask me anything..."
                    className="min-h-2 max-h-[300px] resize-none overflow-y-auto text-lg"
                    disabled={sending}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />

                  <div className="flex w-full justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <Button
                        variant="ghost"
                        className="rounded-full size-10 p-1"
                        title="Data"
                      >
                        <Database className="size-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-full size-10 p-1"
                        title="Attach"
                      >
                        <Paperclip className="size-5" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleSubmit}
                        disabled={!message.trim() || sending}
                        className="rounded-full size-12 p-1 bg-primary hover:bg-primary/90"
                        title="Start Chat"
                      >
                        <ArrowUp className="size-6" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
