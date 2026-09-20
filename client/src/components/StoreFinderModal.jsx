import React, { useEffect, useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  Store, 
  ExternalLink, 
  AlertCircle,
  Loader2,
  Navigation
} from 'lucide-react';
import api from '../api/axios';

export default function StoreFinderModal({ product, isOpen, onClose }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!product || !isOpen) return;

    const fetchStoresForProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/products/${product._id}/stores`);
        if (res.data?.success) {
          setStores(res.data.stores || []);
        } else {
          setStores(product.availableStores || []);
        }
      } catch (err) {
        console.warn('Fallback to embedded store list:', err);
        // Fallback to embedded availableStores array if API call encounters issue
        setStores(product.availableStores || []);
      } finally {
        setLoading(false);
      }
    };

    fetchStoresForProduct();

    // Prevent body scrolling while modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-amber-200 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-brand-crimson to-red-700 text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-brand-gold/20 text-brand-gold text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <Store className="w-3.5 h-3.5" />
              <span>Authorized Retail Stockists</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Where to Buy: {product.name}
            </h2>
            <p className="text-xs text-red-100">
              Pack Size: <span className="font-bold text-brand-gold">{product.netWeight}</span> • Category: {product.category}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Notice for Retail Consumers */}
        <div className="bg-amber-50 px-6 py-3 border-b border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-brand-crimson shrink-0" />
          <span>
            Tasty Namkeens does not ship retail orders directly. Visit any authorized supermarket listed below to purchase.
          </span>
        </div>

        {/* Store List Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-500 gap-3">
              <Loader2 className="w-8 h-8 text-brand-crimson animate-spin" />
              <p className="text-sm font-semibold">Locating authorized supermarkets stocking this snack...</p>
            </div>
          ) : stores.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-brand-crimson rounded-full flex items-center justify-center mx-auto text-2xl">
                🏪
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-bold text-gray-800">Fresh Stock In Transit</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Supermarkets in your area are currently restocking this snack variety. Would you like to check with our central distribution office?
                </p>
                <a
                  href={`https://wa.me/919999999999?text=${encodeURIComponent(
                    `Hi Tasty Namkeens, which supermarket near me has stock of "${product.name} (${product.netWeight})"?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 bg-[#25D366] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow hover:bg-[#20bd5a] transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Ask Admin on WhatsApp for Nearest Stock</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-semibold">
                  Found <strong className="text-brand-crimson">{stores.length}</strong> supermarkets carrying this snack:
                </span>
                <span className="text-[11px] italic">Call ahead to confirm daily fresh stock</span>
              </div>

              {stores.map((store, idx) => {
                const storeWhatsapp = store.whatsappNumber || store.phone;
                const fullAddressString = store.fullAddress || (
                  store.address
                    ? [store.address.street, store.address.landmark, store.address.city, store.address.state, store.address.pincode].filter(Boolean).join(', ')
                    : 'Contact store for landmark'
                );

                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${store.storeName} ${fullAddressString}`
                )}`;

                return (
                  <div
                    key={store._id || idx}
                    className="p-5 rounded-2xl border-2 border-amber-100 hover:border-brand-crimson/40 bg-white hover:bg-amber-50/30 transition-all shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <h4 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                          <Store className="w-4 h-4 text-brand-crimson" />
                          {store.storeName}
                        </h4>
                        {store.ownerName && (
                          <span className="text-xs text-gray-500">Managed by {store.ownerName}</span>
                        )}
                      </div>

                      {store.openingHours && (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span>{store.openingHours}</span>
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-2.5 text-xs text-gray-600">
                      <MapPin className="w-4 h-4 text-brand-crimson shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{fullAddressString}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      {/* Call button */}
                      {store.phone && (
                        <a
                          href={`tel:${store.phone}`}
                          className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-brand-crimson" />
                          <span>Call: {store.phone}</span>
                        </a>
                      )}

                      {/* WhatsApp Store button */}
                      {storeWhatsapp && (
                        <a
                          href={`https://wa.me/${storeWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hello ${store.storeName}, do you have Tasty Namkeens "${product.name}" in stock right now?`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-emerald-800 text-xs font-bold px-3 py-2 rounded-lg border border-emerald-300 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-current" />
                          <span>WhatsApp Store</span>
                        </a>
                      )}

                      {/* Google Maps Directions */}
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-3 py-2 rounded-lg transition-colors ml-auto"
                      >
                        <Navigation className="w-3.5 h-3.5 text-brand-crimson" />
                        <span>Get Directions</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Are you a supermarket owner wanting to stock this?</span>
          <a
            href="https://wa.me/919999999999?text=I%20want%20to%20stock%20Tasty%20Namkeens"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-crimson hover:underline"
          >
            Register Store &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
