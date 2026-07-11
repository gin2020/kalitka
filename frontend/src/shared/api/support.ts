const API =
  "https://api.kalitka.jesarion.com/api/v1";

export interface SupportMessage {
  id: string;
  sender: "client" | "operator" | "support";
  text: string;
  messageType: "text" | "image";
  imagePath: string | null;
  imageUrl: string | null;
  status: "sent" | "read";
  createdAt: string;
}

export async function getMessages() {
  const response = await fetch(
    `${API}/support`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Не удалось загрузить сообщения",
    );
  }

  return response.json() as Promise<
    SupportMessage[]
  >;
}
