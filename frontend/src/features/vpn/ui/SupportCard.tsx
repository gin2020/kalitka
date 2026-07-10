"use client";

import { useEffect, useState } from "react";

import { Card } from "@/shared/ui/Card/Card";

import {
  getMessages,
  SupportMessage,
} from "@/shared/api/support";

export function SupportCard() {
  const [messages, setMessages] =
    useState<SupportMessage[]>([]);

  useEffect(() => {
    getMessages()
      .then(setMessages)
      .catch(console.error);
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
