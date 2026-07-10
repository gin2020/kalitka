from collections import defaultdict
from uuid import UUID

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.connections: dict[
            UUID,
            list[WebSocket],
        ] = defaultdict(list)

    async def connect(
        self,
        conversation_id: UUID,
        websocket: WebSocket,
    ):
        await websocket.accept()

        self.connections[
            conversation_id
        ].append(websocket)

    def disconnect(
        self,
        conversation_id: UUID,
        websocket: WebSocket,
    ):
        if conversation_id not in self.connections:
            return

        if websocket in self.connections[conversation_id]:
            self.connections[
                conversation_id
            ].remove(websocket)

        if not self.connections[conversation_id]:
            del self.connections[conversation_id]

    async def send_to_conversation(
        self,
        conversation_id: UUID,
        message: dict,
    ):
        if conversation_id not in self.connections:
            return

        disconnected = []

        for websocket in self.connections[conversation_id]:
            try:
                await websocket.send_json(message)
            except Exception:
                disconnected.append(websocket)

        for websocket in disconnected:
            self.disconnect(
                conversation_id,
                websocket,
            )


manager = ConnectionManager()
