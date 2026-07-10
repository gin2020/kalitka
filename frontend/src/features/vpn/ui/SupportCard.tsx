"use client";

import { useEffect, useRef, useState } from "react";

import { Card } from "@/shared/ui/Card/Card";

import {
  getMessages,
  SupportMessage,
} from "@/shared/api/support";

export function SupportCard() {
  const [messages, setMessages] =
    useState<SupportMessage[]>([]);

  const [text, setText] = useState("");

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    getMessages()
      .then(setMessages)
      .catch(console.error);

    const socket = new WebSocket(
      "wss://api.kalitka.jesarion.com/ws/support"
    );

    socketRef.current = socket;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      setMessages((prev) => [...prev, message]);
    };

    socket.onerror = console.error;

    return () => socket.close();
  }, []);

  function sendMessage() {
    if (!text.trim()) return;

    socketRef.current?.send(text);

    setText("");
  }

  return (
    <Card>
      <h2>Поддержка</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.sender}:</strong>{" "}
            {message.text}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
        }}
      >
        <input
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder="Введите сообщение..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Отправить
        </button>
      </div>
    </Card>
  );
}
