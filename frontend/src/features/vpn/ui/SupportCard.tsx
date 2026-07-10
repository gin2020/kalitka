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

  const socketRef =
    useRef<WebSocket | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const history =
          await getMessages();

        setMessages(history);

        const socket = new WebSocket(
          "wss://api.kalitka.jesarion.com/ws/support"
        );

        socket.onmessage = (event) => {
          const message: SupportMessage =
            JSON.parse(event.data);

          setMessages((prev) => [
            ...prev,
            message,
          ]);
        };

        socket.onerror = (event) => {
          console.error(event);
        };

        socketRef.current = socket;
      } catch (error) {
        console.error(error);
      }
    }

    init();

    return () => {
      socketRef.current?.close();
    };
  }, []);

  return (
    <Card>
      <h2>Поддержка</h2>

      {messages.map((message) => (
        <p key={message.id}>
          <strong>{message.sender}:</strong>{" "}
          {message.text}
        </p>
      ))}
    </Card>
  );
}
