import React, { useState } from 'react';
import { checkout } from '../../services/api';
import PaymentModal from './PaymentModal';

const BookingCard = ({ booking, onUpdate }) => {
  const [showPayment, setShowPayment] = useState(false);

  const handleCheckout = async () => {
    if (booking.balance > 0) {
      alert('Debe cobrar el saldo pendiente antes del check-out');
      return;
    }

    if (window.confirm('¿Realizar check-out?')) {
      try {
        await checkout(booking.id);
        alert('Check-out realizado exitosamente');
        onUpdate();
      } catch (error) {
        alert(error.response?.data?.error || 'Error al hacer check-out');
      }
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">{booking.full_name}</h3>
          <p className="text-sm text-gray-600">Habitación {booking.room_number}</p>
          <p className="text-xs text-gray-500">{booking.booking_code}</p>
        </div>
        <span className="badge badge-info capitalize">{booking.room_type}</span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total:</span>
          <span className="font-semibold">Bs. {parseFloat(booking.total_amount).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Pagado:</span>
          <span className="text-green-600">Bs. {parseFloat(booking.amount_paid).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Saldo:</span>
          <span className={`font-bold ${booking.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
            Bs. {parseFloat(booking.balance).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {booking.balance > 0 && (
          <button onClick={() => setShowPayment(true)} className="btn-success flex-1 text-sm">
            Cobrar
          </button>
        )}
        <button onClick={handleCheckout} className="btn-primary flex-1 text-sm">
          Check-out
        </button>
      </div>

      {showPayment && (
        <PaymentModal
          booking={booking}
          onClose={() => setShowPayment(false)}
          onPaid={() => {
            setShowPayment(false);
            onUpdate();
          }}
        />
      )}
    </div>
  );
};

export default BookingCard;