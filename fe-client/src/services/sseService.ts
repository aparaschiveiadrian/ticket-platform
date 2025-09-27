//SSE service for real time update of ticket types quanitiy
class SSEService {
    private eventSource: EventSource | null = null;

    connect(eventId: string, onTicketUpdate: (ticketTypeId: string, newQuantity: number) => void) {
        const url = `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/v1/published-events/${eventId}/sse`;

        // deletes existing connection if existing
        this.disconnect();

        this.eventSource = new EventSource(url);

        this.eventSource.addEventListener('connected', (event) => {
            console.log( event.data);
        });

        this.eventSource.addEventListener('ticket-update', (event) => {
            try {
                const update = JSON.parse(event.data);
                onTicketUpdate(update.ticketTypeId, update.newQuantity);
            } catch (error) {
                console.error('Error updating ticketType');
            }
        });

        this.eventSource.onerror = (error) => {
            console.error('SSE connection error');
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
}

export const sseService = new SSEService();