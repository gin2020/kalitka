const API =
  "https://api.kalitka.jesarion.com/api/v1";

export interface SupportMessage {
  id: string;
  sender: "client" | "support";
  text: string;
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
