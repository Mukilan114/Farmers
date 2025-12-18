
import React, { useState, useMemo, useEffect } from 'react';
import { EQUIPMENT_DATA, PRODUCE_DATA, EQUIPMENT_CATEGORIES, PRODUCE_CATEGORIES } from './constants';
import { AppTab, Equipment, Produce, BookingDetails, RentHistoryEntry } from './types';
import { getCombinedRecommendation } from './services/geminiService';
import BookingModal from './components/BookingModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('RENT');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeBooking, setActiveBooking] = useState<Equipment | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [showOnlyDeals, setShowOnlyDeals] = useState(false);
  
  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('farmico_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Rent History State
  const [rentHistory, setRentHistory] = useState<RentHistoryEntry[]>(() => {
    const saved = localStorage.getItem('farmico_rent_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('farmico_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('farmico_rent_history', JSON.stringify(rentHistory));
  }, [rentHistory]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
    const itemName = [...EQUIPMENT_DATA, ...PRODUCE_DATA].find(i => i.id === id)?.name;
    if (!wishlist.includes(id)) {
      showToast(`Added ${itemName} to your wishlist`);
    }
  };

  const filteredItems = useMemo(() => {
    let source: any[] = [];
    if (activeTab === 'RENT') source = EQUIPMENT_DATA;
    else if (activeTab === 'SHOP') source = PRODUCE_DATA;
    else if (activeTab === 'WISHLIST') source = [...EQUIPMENT_DATA, ...PRODUCE_DATA].filter(i => wishlist.includes(i.id));
    else if (activeTab === 'RENT_HISTORY') return []; // Handled separately in UI

    return source.filter((item: any) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesDeals = !showOnlyDeals || (item.pricePerDay && item.pricePerDay < 500) || (item.pricePerKg && item.pricePerKg < 30);
      return matchesSearch && matchesCategory && matchesDeals;
    });
  }, [searchTerm, selectedCategory, activeTab, wishlist, showOnlyDeals]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 5000);
  };

  const handleBookingSuccess = (details: BookingDetails) => {
    const equipment = EQUIPMENT_DATA.find(e => e.id === details.equipmentId);
    const newEntry: RentHistoryEntry = {
      ...details,
      id: Math.random().toString(36).substr(2, 9),
      bookingDate: new Date().toLocaleDateString(),
      pricePerDay: equipment?.pricePerDay || 0
    };
    
    setRentHistory(prev => [newEntry, ...prev]);
    setActiveBooking(null);
    showToast(`Success! Your booking for ${details.equipmentName} has been saved to your history.`);
  };

  const handleSellSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    setIsListingModalOpen(false);
    showToast("Product listed! Fellow farmers can now see your listing and contact details.");
  };

  return (
    <div className="min-h-screen bg-[#eaeded] pb-10">
      {/* Navbar */}
      <nav className="bg-[#131921] text-white">
        <div className="max-w-[1500px] mx-auto flex items-center gap-4 px-4 py-2">
          {/* Logo */}
          <div 
            className="flex flex-col items-center cursor-pointer border border-transparent hover:border-white p-1 rounded-sm"
            onClick={() => { setActiveTab('RENT'); setSearchTerm(''); setSelectedCategory('All'); setShowOnlyDeals(false); }}
          >
            <span className="text-2xl font-black text-white italic">farmico<span className="text-[#febd69]">.in</span></span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex h-10">
            <div className="bg-[#f3f3f3] text-gray-600 flex items-center px-3 rounded-l-md border-r border-gray-300 text-xs font-bold uppercase cursor-pointer hover:bg-gray-200">
              {activeTab === 'SHOP' ? 'Market' : 'Rental'}
            </div>
            <input 
              type="text" 
              className="flex-1 px-4 text-black focus:outline-none placeholder-gray-400"
              placeholder="Search for tractors, tools, or fresh produce..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-[#febd69] hover:bg-[#f3a847] px-5 rounded-r-md text-gray-900 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
          </div>

          <div className="hidden md:flex flex-col border border-transparent hover:border-white p-2 rounded-sm cursor-pointer" onClick={() => setIsListingModalOpen(true)}>
            <span className="text-[11px] leading-none text-gray-300">Start</span>
            <span className="text-sm font-bold">Selling</span>
          </div>

          <div 
            className={`flex flex-col border border-transparent hover:border-white p-2 rounded-sm cursor-pointer ${activeTab === 'RENT_HISTORY' ? 'border-white' : ''}`}
            onClick={() => setActiveTab('RENT_HISTORY')}
          >
            <span className="text-[11px] leading-none text-gray-300">Rent</span>
            <span className="text-sm font-bold">History</span>
          </div>

          <div 
            className={`flex items-center gap-1 border border-transparent hover:border-white p-2 rounded-sm cursor-pointer relative ${activeTab === 'WISHLIST' ? 'border-white' : ''}`}
            onClick={() => setActiveTab('WISHLIST')}
          >
            <svg className={`w-6 h-6 ${wishlist.length > 0 ? 'text-[#febd69] fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            <span className="text-sm font-bold hidden lg:inline">Wishlist ({wishlist.length})</span>
          </div>

          <div className="flex items-center gap-1 border border-transparent hover:border-white p-2 rounded-sm cursor-pointer relative">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span className="text-sm font-bold hidden lg:inline">Cart</span>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="bg-[#232f3e] px-4 py-1 flex items-center gap-6 text-[13px]">
          <button 
            onClick={() => { setActiveTab('RENT'); setSelectedCategory('All'); setShowOnlyDeals(false); }}
            className={`font-bold p-1 border border-transparent hover:border-white ${activeTab === 'RENT' ? 'text-[#febd69] border-b-white' : ''}`}
          >
            RENT VEHICLES
          </button>
          <button 
            onClick={() => { setActiveTab('SHOP'); setSelectedCategory('All'); setShowOnlyDeals(false); }}
            className={`font-bold p-1 border border-transparent hover:border-white ${activeTab === 'SHOP' ? 'text-[#febd69] border-b-white' : ''}`}
          >
            BUY PRODUCE
          </button>
          <button 
            onClick={() => { setActiveTab('RENT'); setShowOnlyDeals(true); }}
            className={`hidden sm:inline border border-transparent hover:border-white p-1 cursor-pointer font-medium ${showOnlyDeals ? 'text-[#febd69]' : ''}`}
          >
            Top Equipment Deals
          </button>
          <span className="hidden lg:inline border border-transparent hover:border-white p-1 cursor-pointer font-medium">Free Delivery</span>
        </div>
      </nav>

      <main className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-60 flex-shrink-0">
            <div className="bg-white p-4 rounded border border-gray-200 shadow-sm sticky top-4">
              <h3 className="font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2 text-xs uppercase">Departments</h3>
              <div className="space-y-1.5">
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className={`block w-full text-left text-sm hover:text-orange-600 transition-colors ${selectedCategory === 'All' ? 'font-bold text-orange-600' : 'text-gray-600'}`}
                >
                  All Items
                </button>
                {activeTab !== 'WISHLIST' && activeTab !== 'RENT_HISTORY' && (activeTab === 'RENT' ? EQUIPMENT_CATEGORIES : PRODUCE_CATEGORIES).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left text-sm hover:text-orange-600 transition-colors ${selectedCategory === cat ? 'font-bold text-orange-600' : 'text-gray-600'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2 text-xs uppercase">Your Farm Hub</h3>
                <div className="bg-blue-50 p-3 rounded border border-blue-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <span className="text-[10px] font-black text-blue-800 uppercase">Profile Status</span>
                  </div>
                  <p className="text-[10px] text-blue-700 leading-tight font-medium">
                    Wishlist: {wishlist.length} | Past Bookings: {rentHistory.length}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="mb-6 flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b border-gray-200 pb-3">
              <div className="flex items-baseline gap-2">
                <h2 className="text-xl font-bold">
                  {activeTab === 'WISHLIST' ? 'Your Saved Items' : 
                   activeTab === 'RENT_HISTORY' ? 'Your Rent History' : 
                   showOnlyDeals ? 'Top Equipment Deals' : 'Featured Selections'}
                </h2>
                <span className="text-xs text-gray-500 font-medium">
                  {activeTab === 'WISHLIST' ? `Managing ${filteredItems.length} saved equipment and products` : 
                   activeTab === 'RENT_HISTORY' ? `Tracking ${rentHistory.length} past rentals` :
                   'Verified local owners and premium farm products'}
                </span>
              </div>
              <div className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                {activeTab === 'WISHLIST' ? 'WISHLIST ACTIVE' : 
                 activeTab === 'RENT_HISTORY' ? 'HISTORY ACTIVE' :
                 showOnlyDeals ? 'HOT DEALS' : 'BEST MARKET RATES'}
              </div>
            </div>

            {activeTab === 'RENT_HISTORY' ? (
              <div className="space-y-4">
                {rentHistory.length === 0 ? (
                  <div className="bg-white p-20 text-center rounded border border-dashed border-gray-300">
                    <p className="text-gray-500 font-medium">You haven't rented any equipment yet.</p>
                    <button onClick={() => setActiveTab('RENT')} className="mt-4 text-[#007185] font-bold hover:underline">Start Renting Now</button>
                  </div>
                ) : (
                  rentHistory.map(entry => (
                    <div key={entry.id} className="bg-white border border-gray-200 rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-gray-900">{entry.equipmentName}</h4>
                        <div className="text-xs text-gray-500 flex gap-4 mt-1">
                          <span>Booking Date: <strong>{entry.bookingDate}</strong></span>
                          <span>Location: <strong>{entry.village}</strong></span>
                        </div>
                        <div className="text-[11px] text-gray-600 mt-2">
                          Period: {entry.startDate} to {entry.endDate}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[10px] text-gray-500 uppercase font-bold">Daily Rate</p>
                          <p className="font-black text-gray-900">₹{entry.pricePerDay}</p>
                        </div>
                        <button className="bg-white border border-gray-300 rounded px-4 py-2 text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm">
                          Rent Again
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white p-20 text-center rounded border border-dashed border-gray-300">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                <p className="text-gray-500 font-medium">No items found matching your criteria.</p>
                {activeTab === 'WISHLIST' && (
                  <button onClick={() => setActiveTab('RENT')} className="mt-4 text-[#007185] font-bold hover:underline">Browse Equipment</button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item: any) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded p-5 flex flex-col hover:border-orange-500 hover:shadow-lg transition-all group cursor-default relative">
                    <button 
                      onClick={() => toggleWishlist(item.id)}
                      className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors group/heart"
                    >
                      <svg className={`w-5 h-5 ${wishlist.includes(item.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                    </button>

                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase tracking-wider">{item.category}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#0F1111] leading-tight mb-1">{item.name}</h3>
                      <p className="text-[11px] text-gray-500 mb-3 font-medium">
                        {item.ownerName ? `Owned by: ${item.ownerName}` : `Seller: ${item.farmerName}`}
                      </p>
                      
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex text-[#ffa41c]">
                          {Array.from({length: 5}).map((_, i) => (
                            <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(item.rating) ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                          ))}
                        </div>
                        <span className="text-xs text-[#007185] font-medium">{item.reviews} reviews</span>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-baseline gap-1 text-[#0F1111]">
                          <span className="text-sm font-medium">₹</span>
                          <span className="text-3xl font-black">{item.pricePerDay || item.pricePerKg}</span>
                          <span className="text-xs text-gray-500 font-bold uppercase tracking-tighter">{item.pricePerDay ? '/ DAY' : '/ KG'}</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-3">{item.description}</p>
                        <ul className="text-[11px] text-gray-700 space-y-1.5">
                          {item.specs?.map((s: string, i: number) => (
                            <li key={i} className="flex items-center gap-2">
                               <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                               <span className="font-semibold">{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => item.pricePerDay ? setActiveBooking(item) : showToast(`Added ${item.name} to cart`)}
                      disabled={item.availability === 'Busy'}
                      className={`w-full py-3 rounded-full font-black shadow-sm transition-all text-xs border uppercase tracking-widest ${
                        item.pricePerDay 
                        ? 'bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 border-[#fcd200]'
                        : 'bg-[#ffa41c] hover:bg-[#fa8900] text-gray-900 border-[#ff8f00]'
                      } disabled:opacity-40`}
                    >
                      {item.pricePerDay ? (item.availability === 'Busy' ? 'Currently Booked' : 'Quick Rent') : 'Add to Cart'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {activeBooking && (
        <BookingModal 
          equipment={activeBooking} 
          onClose={() => setActiveBooking(null)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Seller Listing Modal */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white rounded shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#f0f2f2] p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wider">Start Selling on Farmico</h3>
              <button onClick={() => setIsListingModalOpen(false)} className="text-gray-500 hover:text-black">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <form onSubmit={handleSellSubmission} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black text-gray-700 mb-1 uppercase tracking-wider">Product/Vehicle Name</label>
                <input required type="text" placeholder="e.g. Sonalika Tiger or Basmati Rice" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-700 mb-1 uppercase tracking-wider">Asking Price (₹)</label>
                  <input required type="number" placeholder="per day/kg" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-700 mb-1 uppercase tracking-wider">Stock/Condition</label>
                  <input required type="text" placeholder="New, Good, or Kg" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-black py-3.5 rounded shadow-md border border-[#fcd200] uppercase text-xs tracking-widest mt-4">
                List Product Now
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-10 right-10 z-50 animate-in fade-in slide-in-from-right-10 duration-500">
          <div className="bg-[#131921] text-white px-6 py-4 rounded shadow-2xl border border-white/20 flex items-start gap-4 max-w-sm">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
               <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div className="flex-1">
               <p className="font-bold text-sm leading-tight text-white">{toast}</p>
               <button onClick={() => setToast(null)} className="text-[10px] text-gray-400 hover:text-white mt-1 uppercase font-black tracking-widest">Close Notification</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
