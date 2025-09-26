import apiClient from './api';
import { EventDetails } from './eventsService';

export interface OrganizerStats {
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  publishedEvents: number;
  draftEvents: number;
}

class OrganizerStatsService {
  // Get organizer statistics by fetching all events and calculating metrics
  async getOrganizerStats(): Promise<OrganizerStats> {
    try {
      // Fetch all events for the organizer (using a large page size to get all events)
      const response = await apiClient.get('/events', {
        params: {
          page: 0,
          size: 1000, // Large size to get all events
          sort: 'createdAt,desc'
        }
      });

      const events = response.data.content || [];
      
      // Calculate statistics
      const stats: OrganizerStats = {
        totalEvents: events.length,
        totalTicketsSold: 0,
        totalRevenue: 0,
        publishedEvents: 0,
        draftEvents: 0
      };

      events.forEach((event: any) => {
        // Count published vs draft events
        if (event.status === 'PUBLISHED') {
          stats.publishedEvents++;
        } else {
          stats.draftEvents++;
        }

        // Calculate tickets sold and revenue from ticket types
        // Note: The basic Event type from /events endpoint doesn't include ticketTypes
        // For now, we'll use placeholder values until we have a proper endpoint
        // that returns events with ticket type details
        const estimatedTicketsSold = 0; // Placeholder
        const estimatedRevenue = 0; // Placeholder
        
        stats.totalTicketsSold += estimatedTicketsSold;
        stats.totalRevenue += estimatedRevenue;
      });

      return stats;
    } catch (error) {
      console.error('Error fetching organizer stats:', error);
      // Return default stats if there's an error
      return {
        totalEvents: 0,
        totalTicketsSold: 0,
        totalRevenue: 0,
        publishedEvents: 0,
        draftEvents: 0
      };
    }
  }

  // Format currency for display
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Format large numbers with commas
  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }
}

export const organizerStatsService = new OrganizerStatsService();
