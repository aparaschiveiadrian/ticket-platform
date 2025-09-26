import apiClient from './api';

export interface OrganizerStats {
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  publishedEvents: number;
  draftEvents: number;
}

class OrganizerStatsService {
  // Get organizer statistics from the backend API
  async getOrganizerStats(): Promise<OrganizerStats> {
    try {
      const response = await apiClient.get<OrganizerStats>('/organizers/stats');
      return response.data;
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
