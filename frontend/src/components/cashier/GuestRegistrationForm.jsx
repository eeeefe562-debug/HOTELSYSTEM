import React, { useState, useEffect } from 'react';
import { X, UserPlus } from 'lucide-react';
import { getAvailableRooms, createGuestBooking } from '../../services/api';

const GuestRegistrationForm = ({ onClose, onCreated }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Datos del huésped
    full_name: '',
    document_number: '',
    age: '',
    nationality: 'Bolivia',
    origin: '',
    phone: '',
    
    // Datos de la reserva
    room_id: '',
    check_in: new Date().toISOString().slice(0, 16),
    expected_checkout: '',
    base_price: '',
    additional_income: '0',
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await getAvailableRooms();
      setRooms(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRoomSelect = (room) => {
    setFormData({
      ...formData,
      room_id: room.id,
      base_price: room.base_price
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const bookingData = {
      full_name: formData.full_name,
      document_number: formData.document_number,
      phone: formData.phone,
      age: parseInt(formData.age),
      nationality: formData.nationality,
      origin: formData.origin,
      room_id: formData.room_id,
      check_in: formData.check_in,
      expected_checkout: formData.expected_checkout,
      base_price: formData.base_price,
      additional_income: parseFloat(formData.additional_income) || 0
    };

    await createGuestBooking(bookingData);

    alert('Huésped registrado exitosamente');
    onCreated();
  } catch (error) {
    alert(error.response?.data?.error || 'Error al registrar huésped');
  } finally {
    setLoading(false);
  }
};

  const selectedRoom = rooms.find(r => r.id === formData.room_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            Registrar Nuevo Huésped
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DATOS DEL HUÉSPED */}
          <div className="card bg-blue-50">
            <h3 className="font-bold text-lg mb-4">Datos del Huésped</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Nombre Completo *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="label">Número de Documento *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.document_number}
                  onChange={(e) => setFormData({...formData, document_number: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="label">Edad *</label>
                <input
                  type="number"
                  className="input"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="label">Nacionalidad *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.nationality}
                  onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="label">Procedencia (Ciudad/País) *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ej: La Paz, Bolivia"
                  value={formData.origin}
                  onChange={(e) => setFormData({...formData, origin: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="label">Número de Teléfono *</label>
                <input
                  type="tel"
                  className="input"
                  placeholder="+59171234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          {/* DATOS DE LA ESTADÍA */}
          <div className="card bg-green-50">
            <h3 className="font-bold text-lg mb-4">Datos de la Estadía</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Hora de Ingreso *</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={formData.check_in}
                  onChange={(e) => setFormData({...formData, check_in: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="label">Hora de Salida Esperada *</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={formData.expected_checkout}
                  onChange={(e) => setFormData({...formData, expected_checkout: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="label">Ingresos Adicionales (Bs.)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  value={formData.additional_income}
                  onChange={(e) => setFormData({...formData, additional_income: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* SELECCIÓN DE HABITACIÓN */}
          <div className="card bg-purple-50">
            <h3 className="font-bold text-lg mb-4">Seleccionar Habitación *</h3>
            
            {selectedRoom && (
              <div className="mb-4 p-3 bg-white rounded-lg border-2 border-purple-500">
                <p className="font-bold text-lg">Habitación {selectedRoom.room_number}</p>
                <p className="text-sm text-gray-600 capitalize">{selectedRoom.room_type}</p>
                <p className="text-xl font-bold text-green-600 mt-1">
                  Bs. {parseFloat(selectedRoom.base_price).toFixed(2)}
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-64 overflow-y-auto">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => handleRoomSelect(room)}
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    formData.room_id === room.id
                      ? 'border-purple-500 bg-purple-100'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <p className="font-bold text-lg">{room.room_number}</p>
                  <p className="text-xs text-gray-600 capitalize">{room.room_type}</p>
                  <p className="text-sm font-semibold text-green-600 mt-1">
                    Bs. {parseFloat(room.base_price).toFixed(2)}
                  </p>
                </button>
              ))}
            </div>

            {rooms.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No hay habitaciones disponibles
              </p>
            )}
          </div>

          {/* RESUMEN Y BOTONES */}
          {selectedRoom && (
            <div className="card bg-yellow-50">
              <h3 className="font-bold text-lg mb-4">Resumen del Cobro</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Precio de Habitación:</span>
                  <span className="font-semibold">Bs. {parseFloat(selectedRoom.base_price).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ingresos Adicionales:</span>
                  <span className="font-semibold">Bs. {parseFloat(formData.additional_income || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold text-lg">TOTAL:</span>
                  <span className="font-bold text-xl text-green-600">
                    Bs. {(parseFloat(selectedRoom.base_price) + parseFloat(formData.additional_income || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !formData.room_id}
              className="btn-success flex-1"
            >
              {loading ? 'Registrando...' : 'Registrar Huésped'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestRegistrationForm;