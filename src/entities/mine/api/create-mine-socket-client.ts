import { getWsUrl } from "@/shared/api";

import {
  type MineClickSessionResult,
  type MineSessionClickPayload,
  type MineSocketError,
  type MineStartSessionResult,
  type MineServerSessionState
} from "../model/types";

type MineSocketClientMessage =
  | {
      requestId: string;
      type: "mine:start";
    }
  | {
      requestId: string;
      sessionId: string;
      type: "mine:state";
    }
  | {
      payload: MineSessionClickPayload;
      requestId: string;
      sessionId: string;
      type: "mine:click";
    };

type MineSocketServerMessage =
  | {
      payload: MineStartSessionResult;
      requestId: string | null;
      type: "mine:started";
    }
  | {
      payload: MineServerSessionState;
      requestId: string | null;
      type: "mine:state";
    }
  | {
      payload: MineClickSessionResult;
      requestId: string | null;
      type: "mine:click-result";
    }
  | {
      error: MineSocketError;
      requestId: string | null;
      type: "mine:error";
    };

export type MineSocketClient = {
  close: () => void;
  requestState: (sessionId: string) => string;
  startSession: () => string;
  submitClick: (sessionId: string, payload: MineSessionClickPayload) => string;
};

type CreateMineSocketClientHandlers = {
  onClickResult?: (payload: MineClickSessionResult, requestId: string | null) => void;
  onClose?: () => void;
  onError?: (error: MineSocketError, requestId: string | null) => void;
  onOpen?: () => void;
  onStarted?: (payload: MineStartSessionResult, requestId: string | null) => void;
  onState?: (payload: MineServerSessionState, requestId: string | null) => void;
};

const MINE_SOCKET_PATH = "mine/ws";

function createMineSocketRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `mine-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function getRequestId(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

function isMineSocketError(value: unknown): value is MineSocketError {
  return (
    isRecord(value) &&
    typeof value.code === "string" &&
    typeof value.message === "string"
  );
}

function parseMineSocketMessage(data: string): MineSocketServerMessage | null {
  try {
    const parsed: unknown = JSON.parse(data);

    if (!isRecord(parsed) || typeof parsed.type !== "string") {
      return null;
    }

    const requestId = getRequestId(parsed.requestId);

    if (parsed.type === "mine:error" && isMineSocketError(parsed.error)) {
      return {
        error: parsed.error,
        requestId,
        type: "mine:error"
      };
    }

    if (!isRecord(parsed.payload)) {
      return null;
    }

    if (parsed.type === "mine:started") {
      return {
        payload: parsed.payload as MineStartSessionResult,
        requestId,
        type: "mine:started"
      };
    }

    if (parsed.type === "mine:state") {
      return {
        payload: parsed.payload as MineServerSessionState,
        requestId,
        type: "mine:state"
      };
    }

    if (parsed.type === "mine:click-result") {
      return {
        payload: parsed.payload as MineClickSessionResult,
        requestId,
        type: "mine:click-result"
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function createMineSocketClient(handlers: CreateMineSocketClientHandlers): MineSocketClient {
  const socket = new WebSocket(getWsUrl(MINE_SOCKET_PATH));
  const queuedMessages: MineSocketClientMessage[] = [];

  function sendMessage(message: MineSocketClientMessage) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
      return;
    }

    if (socket.readyState === WebSocket.CONNECTING) {
      queuedMessages.push(message);
      return;
    }

    handlers.onError?.(
      {
        code: "socket_closed",
        message: "Mine socket is closed"
      },
      message.requestId
    );
  }

  function flushQueuedMessages() {
    while (socket.readyState === WebSocket.OPEN && queuedMessages.length > 0) {
      const message = queuedMessages.shift();

      if (message) {
        socket.send(JSON.stringify(message));
      }
    }
  }

  socket.addEventListener("open", () => {
    flushQueuedMessages();
    handlers.onOpen?.();
  });

  socket.addEventListener("message", (event: MessageEvent<string>) => {
    const message = parseMineSocketMessage(event.data);

    if (!message) {
      handlers.onError?.(
        {
          code: "bad_message",
          message: "Invalid mine socket response"
        },
        null
      );
      return;
    }

    if (message.type === "mine:started") {
      handlers.onStarted?.(message.payload, message.requestId);
      return;
    }

    if (message.type === "mine:state") {
      handlers.onState?.(message.payload, message.requestId);
      return;
    }

    if (message.type === "mine:click-result") {
      handlers.onClickResult?.(message.payload, message.requestId);
      return;
    }

    handlers.onError?.(message.error, message.requestId);
  });

  socket.addEventListener("error", () => {
    handlers.onError?.(
      {
        code: "socket_error",
        message: "Mine socket connection error"
      },
      null
    );
  });

  socket.addEventListener("close", () => {
    handlers.onClose?.();
  });

  return {
    close() {
      queuedMessages.length = 0;
      socket.close();
    },
    requestState(sessionId) {
      const requestId = createMineSocketRequestId();

      sendMessage({
        requestId,
        sessionId,
        type: "mine:state"
      });

      return requestId;
    },
    startSession() {
      const requestId = createMineSocketRequestId();

      sendMessage({
        requestId,
        type: "mine:start"
      });

      return requestId;
    },
    submitClick(sessionId, payload) {
      const requestId = createMineSocketRequestId();

      sendMessage({
        payload,
        requestId,
        sessionId,
        type: "mine:click"
      });

      return requestId;
    }
  };
}
