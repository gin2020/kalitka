"use client";

/* eslint-disable @next/next/no-img-element */

import {
  ChangeEvent,
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
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "heic",
];

type SelectedImage = {
  file: File;
  previewUrl: string;
};

type MessageStatusPayload = {
  type: "message_status";
  messageId: string;
  status: SupportMessage["status"];
};

type ErrorPayload = {
  type: "error";
  message: string;
};

type SupportSocketMessage =
  | SupportMessage
  | MessageStatusPayload
  | ErrorPayload;

export function SupportCard() {
  const [messages, setMessages] =
    useState<SupportMessage[]>([]);

  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [attachmentMenuOpen, setAttachmentMenuOpen] =
    useState(false);
  const [selectedImage, setSelectedImage] =
    useState<SelectedImage | null>(null);
  const [error, setError] = useState<string | null>(
    null
  );

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(
    null
  );
  const shouldReconnectRef = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(
    null
  );
  const cameraInputRef =
    useRef<HTMLInputElement | null>(null);

  const trimmedText = useMemo(
    () => text.trim(),
    [text]
  );

  const canSend = Boolean(
    connected &&
      !sending &&
      (trimmedText || selectedImage)
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
        const payload = JSON.parse(
          event.data
        ) as SupportSocketMessage;

        if (isMessageStatusPayload(payload)) {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === payload.messageId
                ? {
                    ...message,
                    status: payload.status,
                  }
                : message
            )
          );
          return;
        }

        if (isErrorPayload(payload)) {
          setError(payload.message);
          return;
        }

        setMessages((prev) => {
          if (
            prev.some(
              (message) => message.id === payload.id
            )
          ) {
            return prev;
          }

          return [...prev, payload];
        });
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
    if (!expanded) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [expanded, messages]);

  useEffect(() => {
    if (!expanded || !connected) {
      return;
    }

    for (const message of messages) {
      if (message.status === "sent") {
        sendReadAck(message.id);
      }
    }
  }, [connected, expanded, messages]);

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(
          selectedImage.previewUrl
        );
      }
    };
  }, [selectedImage]);

  async function sendMessage() {
    if (
      !canSend ||
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    setSending(true);
    setError(null);

    try {
      if (selectedImage) {
        const data = await fileToBase64(
          selectedImage.file
        );

        socketRef.current.send(
          JSON.stringify({
            type: "message",
            text: trimmedText,
            messageType: "image",
            image: {
              name: selectedImage.file.name,
              size: selectedImage.file.size,
              type: selectedImage.file.type,
              data,
            },
          })
        );

        clearSelectedImage();
      } else {
        socketRef.current.send(
          JSON.stringify({
            type: "message",
            text: trimmedText,
            messageType: "text",
          })
        );
      }

      setText("");
    } catch (sendError) {
      console.error(sendError);
      setError("Не удалось отправить сообщение");
    } finally {
      setSending(false);
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

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const validationError = validateImage(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    clearSelectedImage();
    setError(null);
    setSelectedImage({
      file,
      previewUrl: URL.createObjectURL(file),
    });
    setAttachmentMenuOpen(false);
    setExpanded(true);
  }

  function clearSelectedImage() {
    setSelectedImage((current) => {
      if (current) {
        URL.revokeObjectURL(current.previewUrl);
      }

      return null;
    });
  }

  function sendReadAck(messageId: string) {
    if (
      socketRef.current?.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        type: "message_read",
        messageId,
      })
    );
  }

  function formatMessageTime(value: string) {
    return new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }

  return (
    <Card className={styles.card}>
      <button
        className={styles.headerButton}
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
      >
        <span>
          <span className={styles.title}>
            Поддержка
          </span>
          <span className={styles.subtitle}>
            Напишите нам, оператор ответит здесь.
          </span>
        </span>

        <span className={styles.headerMeta}>
          <span
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
          </span>
          <span
            className={`${styles.chevron} ${
              expanded ? styles.chevronOpen : ""
            }`}
            aria-hidden="true"
          >
           ⌄
          </span>
        </span>
      </button>

      {expanded ? (
        <div className={styles.body}>
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
                    {message.messageType ===
                      "image" && message.imageUrl ? (
                      <img
                        className={styles.image}
                        src={message.imageUrl}
                        alt="Вложение"
                      />
                    ) : null}

                    {message.text ? (
                      <p className={styles.messageText}>
                        {message.text}
                      </p>
                    ) : null}

                    <span className={styles.meta}>
                      <time
                        className={styles.time}
                        dateTime={message.createdAt}
                      >
                        {formatMessageTime(
                          message.createdAt
                        )}
                      </time>
                      <span
                        className={styles.messageStatus}
                      >
                        {message.status === "read"
                          ? "✓✓ Прочитано"
                          : "✓ Отправлено"}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {selectedImage ? (
            <div className={styles.preview}>
              <img
                className={styles.previewImage}
                src={selectedImage.previewUrl}
                alt="Предпросмотр"
              />
              <div className={styles.previewInfo}>
                <span className={styles.previewTitle}>
                  {selectedImage.file.name}
                </span>
                <button
                  className={styles.previewRemove}
                  type="button"
                  onClick={clearSelectedImage}
                >
                  Убрать
                </button>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className={styles.error}>
              {error}
            </div>
          ) : null}

          <div className={styles.composer}>
            <div className={styles.attachWrap}>
              <button
                className={styles.attachButton}
                type="button"
                onClick={() =>
                  setAttachmentMenuOpen(
                    (value) => !value
                  )
                }
                aria-label="Добавить вложение"
              >
                +
              </button>

              {attachmentMenuOpen ? (
                <div
                  className={styles.attachmentMenu}
                >
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    Фото
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      cameraInputRef.current?.click()
                    }
                  >
                    Камера
                  </button>
                </div>
              ) : null}
            </div>

            <textarea
              className={styles.input}
              value={text}
              rows={1}
              onChange={(e) =>
                setText(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder={
                selectedImage
                  ? "Добавьте подпись..."
                  : "Введите сообщение..."
              }
              disabled={sending}
            />

            <Button
              className={styles.sendButton}
              onClick={sendMessage}
              disabled={!canSend}
              fullWidth={false}
            >
              {sending
                ? "Отправка..."
                : "Отправить"}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            className={styles.fileInput}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.heic,image/jpeg,image/png,image/webp,image/heic"
            onChange={handleImageChange}
          />
          <input
            ref={cameraInputRef}
            className={styles.fileInput}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
          />
        </div>
      ) : null}
    </Card>
  );
}

function validateImage(file: File) {
  const extension = file.name
    .split(".")
    .pop()
    ?.toLowerCase();

  if (
    !extension ||
    !ALLOWED_IMAGE_EXTENSIONS.includes(extension)
  ) {
    return "Можно отправить jpg, jpeg, png, webp или heic.";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "Размер изображения не должен превышать 10 МБ.";
  }

  return null;
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result);
      const [, data] = result.split(",");

      resolve(data ?? result);
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsDataURL(file);
  });
}

function isMessageStatusPayload(
  payload: SupportSocketMessage
): payload is MessageStatusPayload {
  return (
    "type" in payload &&
    payload.type === "message_status"
  );
}

function isErrorPayload(
  payload: SupportSocketMessage
): payload is ErrorPayload {
  return (
    "type" in payload && payload.type === "error"
  );
}
