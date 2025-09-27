//SSE service for real time update of ticket types quanitiy
class SSEService {
    private eventSource: EventSource | null = null;
    private connectionCallbacks: (() => void)[] = [];

    connect(eventId: string, onTicketUpdate: (ticketTypeId: string, newQuantity: number) => void, onConnected?: () => void) {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const url = `${baseUrl}/api/v1/published-events/${eventId}/sse`;

        // deletes existing connection if existing
        this.disconnect();

        this.eventSource = new EventSource(url);

        this.eventSource.addEventListener('connected', (event) => {
            console.log('SSE connected:', event.data);
        });

        this.eventSource.addEventListener('ready', (event) => {
            console.log('SSE ready:', event.data);
            if (onConnected) {
                onConnected();
            }
            // Call all registered connection callbacks
            this.connectionCallbacks.forEach(callback => callback());
            this.connectionCallbacks = [];
        });

        this.eventSource.addEventListener('ticket-update', (event) => {
            try {
                const update = JSON.parse(event.data);
                onTicketUpdate(update.ticketTypeId, update.newQuantity);
            } catch (error) {
                console.error('Error parsing ticket update:', error);
            }
        });

        this.eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            console.log('SSE connection state:', this.getConnectionState());
            console.log('SSE readyState:', this.eventSource?.readyState);
        };
    }

    disconnect() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }

    isConnected(): boolean {
        return this.eventSource?.readyState === EventSource.OPEN;
    }

    getConnectionState(): string {
        if (!this.eventSource) return 'DISCONNECTED';

        switch (this.eventSource.readyState) {
            case EventSource.CONNECTING: return 'CONNECTING';
            case EventSource.OPEN: return 'OPEN';
            case EventSource.CLOSED: return 'CLOSED';
            default: return 'UNKNOWN';
        }
    }

    waitForConnection(): Promise<void> {
        return new Promise((resolve) => {
            if (this.isConnected()) {
                resolve();
                return;
            }
            
            this.connectionCallbacks.push(resolve);
            
            // Timeout after 5 seconds
            setTimeout(() => {
                const index = this.connectionCallbacks.indexOf(resolve);
                if (index > -1) {
                    this.connectionCallbacks.splice(index, 1);
                }
                resolve(); // Resolve anyway to not block the UI
            }, 5000);
        });
    }
}

export const sseService = new SSEService();