
import React, { useState } from 'react';
import { Equipment, BookingDetails } from '../types';

interface BookingModalProps {
  equipment: Equipment;
  onClose: () => void;
  onSuccess: (details: BookingDetails) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ equipment, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    village: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onSuccess({
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        ...formData
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-[#f0f2f2] p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Direct Rental Booking</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded">
            <div>
              <p className="font-black text-gray-900 text-lg leading-tight mb-1">{equipment.name}</p>
              <div className="flex justify-between items-baseline mt-2">
                <p className="text-xs text-blue-800 font-bold uppercase tracking-tight">Owner: {equipment.ownerName}</p>
                <p className="text-emerald-700 font-black text-lg">₹{equipment.pricePerDay}/day</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded border border-blue-200 flex items-start gap-3">
             <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             <div>
               <p className="text-xs font-bold text-blue-900 uppercase">Direct Coordination</p>
               <p className="text-[10px] text-blue-800 leading-tight">Your name and contact number will be shared with <strong>{equipment.ownerName}</strong> to finalize the delivery and payment terms.</p>
             </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Your Full Name</label>
            <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Mobile Number</label>
            <input required type="tel" pattern="[0-9]{10}" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm" placeholder="10-digit number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Village / Location</label>
            <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm" placeholder="e.g. Rampur" value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Start Date</label>
              <input required type="date" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">End Date</label>
              <input required type="date" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-black py-3 rounded shadow-sm border border-[#fcd200] disabled:opacity-50 uppercase text-xs tracking-widest mt-2">
            {loading ? 'Submitting Request...' : 'Confirm Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
