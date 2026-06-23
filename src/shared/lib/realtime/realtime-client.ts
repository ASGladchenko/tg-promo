export type RealtimeMessage<TData = unknown> = {
  type: string;
  data: TData;
  message?: string;
};

type RealtimeMessageHandler<TData = unknown> = (message: RealtimeMessage<TData>) => void;

class RealtimeClient {
  private eventSource: EventSource | null = null;
  private readonly listeners = new Map<string, Set<RealtimeMessageHandler>>();

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

  subscribe<TData>(type: string, handler: RealtimeMessageHandler<TData>): () => void {
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

    return typeof message.type === "string" && "data" in message;
  }
}

export const realtimeClient = new RealtimeClient();
