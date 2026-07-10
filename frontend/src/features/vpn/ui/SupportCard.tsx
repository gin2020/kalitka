"use client";

import {
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Card } from "@/shared/ui/Card/Card";
import { Button } from "@/shared/ui/Button/Button";

import {
  getMessages,
  SupportMessage,
} from "@/shared/api/support";

import styles from "./SupportCard.module.css";

const SUPPORT_WS_URL =
  "wss://api.kalitka.jesarion.com/ws/support";

const RECONNECT_DELAY_MS = 2_000;

export function SupportCard() {
  const [messages, setMessages] =
    useState<SupportMessage[]>([]);

  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(
    null
  );
  const shouldReconnectRef = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(
    null
  );

  const trimmedText = useMemo(
    () => text.trim(),
    [text]
  );

  useEffect(() => {
    getMessages()
      .then(setMessages)
      .catch(console.error);

    function connect() {
      const socket = new WebSocket(SUPPORT_WS_URL);

      socketRef.current = socket;

      socket.onopen = () => {
        setConnected(true);
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(
          event.data
        ) as SupportMessage;

        setMessages((prev) => [
          ...prev,
          message,
        ]);
      };

      socket.onerror = console.error;

      socket.onclose = () => {
        if (socketRef.current === socket) {
          socketRef.current = null;
        }

        setConnected(false);

        if (!shouldReconnectRef.current) {
          return;
        }

        reconnectTimerRef.current =
          window.setTimeout(
            connect,
            RECONNECT_DELAY_MS
          );
      };
    }

    connect();

    return () => {
      shouldReconnectRef.current = false;

      if (reconnectTimerRef.current) {
        window.clearTimeout(
          reconnectTimerRef.current
        );
      }

      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  function sendMessage() {
    if (
      !trimmedText ||
      !connected ||
      socketRef.current?.readyState !==
        WebSocket.OPEN
    ) {
      return;
    }

    setSending(true);

    try {
      socketRef.current.send(trimmedText);
      setText("");
    } catch (error) {
      console.error(error);
    } finally {
      window.setTimeout(() => {
        setSending(false);
      }, 250);
    }
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  }

  function formatMessageTime(value: string) {
    return new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>
            Поддержка
          </h2>
          <p className={styles.subtitle}>
            Напишите нам, оператор ответит здесь.
          </p>
        </div>

        <div
          className={`${styles.status} ${
            connected
              ? styles.connected
              : styles.disconnected
          }`}
          aria-live="polite"
        >
          <span
            className={styles.statusEmoji}
            aria-hidden="true"
          >
            {connected ? "🟢" : "🔴"}
          </span>
          {connected
            ? "Подключено"
            : "Нет соединения"}
        </div>
      </div>

      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.empty}>
            История сообщений пока пуста.
          </div>
        ) : null}

        {messages.map((message) => {
          const isClient =
            message.sender === "client";

          return (
            <div
              className={`${styles.messageRow} ${
                isClient
                  ? styles.clientRow
                  : styles.supportRow
              }`}
              key={message.id}
            >
              <div
                className={`${styles.bubble} ${
                  isClient
                    ? styles.clientBubble
                    : styles.supportBubble
                }`}
              >
                <p className={styles.messageText}>
                  {message.text}
                </p>
                <time
                  className={styles.time}
                  dateTime={message.createdAt}
                >
                  {formatMessageTime(
                    message.createdAt
                  )}
                </time>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className={styles.composer}>
        <textarea
          className={styles.input}
          value={text}
          rows={1}
          onChange={(e) =>
            setText(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
          disabled={sending}
        />

        <Button
          className={styles.sendButton}
          onClick={sendMessage}
          disabled={
            sending || !trimmedText || !connected
          }
          fullWidth={false}
        >
          {sending ? "Отправка..." : "Отправить"}
        </Button>
      </div>
    </Card>
  );
}
