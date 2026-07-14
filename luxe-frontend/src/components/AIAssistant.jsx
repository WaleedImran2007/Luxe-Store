import { useContext, useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, MessageCircle, Send, X } from "lucide-react";

import { AuthContext } from "../../store/AuthContext.jsx";
import api from "../../api/api.js";

const AIAssistant = () => {
    const { decodedUser } = useContext(AuthContext);

    const [isOpen, setIsOpen] = useState(false);

    const [message, setMessage] = useState("");

    const [chat, setChat] = useState([
        {
            role: "assistant",
            content: `Hello ${decodedUser?.username || "there"} 👋 I am your AI Assistant. Ask me anything!`,
        },
    ]);

    const [loading, setLoading] = useState(false);

    const chatBoxRef = useRef(null);

    useEffect(() => {
        chatBoxRef.current?.scrollTo({
            top: chatBoxRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [chat, loading]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const userMessage = message;

        setChat((prev) => [
            ...prev,
            {
                role: "user",
                content: userMessage,
            },
        ]);

        setMessage("");

        try {
            setLoading(true);

            const res = await api.post("/ai/chat", {
                userMessage,
            });

            setChat((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: res.data.reply,
                },
            ]);
        } catch (err) {
            const apiMessage = err.response?.data?.message || "";
            console.log(apiMessage);

            let errorMessage = "Sorry, AI is not responding 😢";

            if (apiMessage.includes("rate_limit_exceeded")) {
                errorMessage =
                    "⚠️ AI limit reached. Please try again later.";
            }

            setChat((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: errorMessage,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-indigo-600 text-white shadow-2xl hover:bg-indigo-700 transition flex items-center justify-center"
                >
                    <MessageCircle size={28} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 left-6 sm:left-auto z-50 flex h-[70%] w-auto sm:w-[390px] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">

                    {/* Header */}
                    <div className="flex items-center justify-between bg-indigo-600 px-5 py-4 text-white">
                        <div className="flex items-center gap-2">
                            <Bot size={22} />
                            <h2 className="font-semibold">
                                Luxe Assistant
                            </h2>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded p-1 hover:bg-indigo-500"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={chatBoxRef}
                        className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4"
                    >
                        {chat.map((msg, index) => (
                            <div
                                key={index}
                                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm shadow
                                ${msg.role === "user"
                                        ? "ml-auto bg-indigo-600 text-white"
                                        : "bg-white"
                                    }`}
                            >
                                <ReactMarkdown>
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        ))}

                        {loading && (
                            <div className="max-w-fit rounded-xl bg-white px-4 py-3 text-sm shadow">
                                AI is typing...
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="border-t bg-white p-3">
                        <div className="flex gap-2">

                            <input
                                className="flex-1 rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
                                placeholder="Ask anything..."
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                onKeyDown={(e) =>
                                    e.key === "Enter" &&
                                    sendMessage()
                                }
                            />

                            <button
                                onClick={sendMessage}
                                disabled={loading}
                                className="rounded-lg bg-indigo-600 px-4 text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                <Send size={18} />
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIAssistant;