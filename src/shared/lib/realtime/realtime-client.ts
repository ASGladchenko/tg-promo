export const CLIENT_EVENT_TYPES = {
  clientEventsPing: "client-events.ping",
  userUpdated: "user.updated",
  walletUpdated: "wallet.updated"
} as const;

export type ClientEventType = (typeof CLIENT_EVENT_TYPES)[keyof typeof CLIENT_EVENT_TYPES];

export type RealtimeMessage<TData = unknown> = {
  type: ClientEventType;
  data: TData;
  message?: string;
};

type RealtimeMessageHandler<TData = unknown> = (message: RealtimeMessage<TData>) => void;

const clientEventTypes: readonly ClientEventType[] = Object.values(CLIENT_EVENT_TYPES);

class RealtimeClient {
  private eventSource: EventSource | null = null;
  private readonly listeners = new Map<ClientEventType, Set<RealtimeMessageHandler>>();

  connect(url: string): void {
    if (this.eventSource) {
      return;
    }

    this.eventSource = new EventSource(url, { withCredentials: true });
    this.eventSource.addEventListener("message", this.handleMessage);
  }

  disconnect(): void {
    if (!this.eventSource) {
      return;
    }

    this.eventSource.removeEventListener("message", this.handleMessage);
    this.eventSource.close();
    this.eventSource = null;
  }

  subscribe<TData>(type: ClientEventType, handler: RealtimeMessageHandler<TData>): () => void {
    const listeners = this.listeners.get(type) ?? new Set<RealtimeMessageHandler>();
    const typedHandler = handler as RealtimeMessageHandler;

    listeners.add(typedHandler);
    this.listeners.set(type, listeners);

    return () => {
      listeners.delete(typedHandler);

      if (listeners.size === 0) {
        this.listeners.delete(type);
      }
    };
  }

  private handleMessage = (event: MessageEvent<string>): void => {
    const message = this.parseMessage(event.data);

    if (!message) {
      return;
    }

    this.listeners.get(message.type)?.forEach((handler) => {
      handler(message);
    });
  };

  private parseMessage(data: string): RealtimeMessage | null {
    try {
      const parsed: unknown = JSON.parse(data);

      if (!this.isRealtimeMessage(parsed)) {
        return null;
      }

      return parsed;
    } catch (error) {
      console.error("Failed to parse realtime message", error);

      return null;
    }
  }

  private isRealtimeMessage(value: unknown): value is RealtimeMessage {
    if (!value || typeof value !== "object") {
      return false;
    }

    const message = value as Partial<RealtimeMessage>;

    return (
      isClientEventType(message.type) &&
      "data" in message &&
      (!("message" in message) || typeof message.message === "string")
    );
  }
}

function isClientEventType(value: unknown): value is ClientEventType {
  return typeof value === "string" && clientEventTypes.includes(value as ClientEventType);
}

export const realtimeClient = new RealtimeClient();
