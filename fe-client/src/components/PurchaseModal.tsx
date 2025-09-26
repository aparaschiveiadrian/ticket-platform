import React, { useState } from 'react';
import { ticketsService } from '../services/ticketsService';
import './PurchaseModal.css';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  ticketTypeId: string;
  ticketTypeName: string;
  ticketPrice: number;
  maxAvailable: number;
  onPurchaseSuccess: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  eventId,
  ticketTypeId,
  ticketTypeName,
  ticketPrice,
  maxAvailable,
  onPurchaseSuccess
}) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= Math.min(10, maxAvailable)) {
      setQuantity(value);
      setError(null);
    }
  };

  const handlePurchase = async () => {
    if (quantity < 1 || quantity > Math.min(10, maxAvailable)) {
      setError('Please select a valid quantity');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await ticketsService.purchaseTickets(eventId, ticketTypeId, quantity);
      onPurchaseSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const totalPrice = ticketPrice * quantity;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Purchase Tickets</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="ticket-info">
            <h3>{ticketTypeName}</h3>
            <div className="price-info">
              <span className="unit-price">{formatPrice(ticketPrice)} per ticket</span>
            </div>
            <div className="availability-info">
              <span className="availability-text">
                {maxAvailable} tickets available
              </span>
            </div>
          </div>

          <div className="quantity-section">
            <label htmlFor="quantity">Quantity:</label>
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                id="quantity"
                type="number"
                min="1"
                max={Math.min(10, maxAvailable)}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="quantity-input"
              />
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= Math.min(10, maxAvailable)}
              >
                +
              </button>
            </div>
            <div className="quantity-limit">
              Maximum {Math.min(10, maxAvailable)} tickets per purchase
            </div>
          </div>

          <div className="total-section">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="total-line total-final">
              <span><strong>Total:</strong></span>
              <span><strong>{formatPrice(totalPrice)}</strong></span>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button 
            className="cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="purchase-btn"
            onClick={handlePurchase}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Purchase ${quantity} Ticket${quantity > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
