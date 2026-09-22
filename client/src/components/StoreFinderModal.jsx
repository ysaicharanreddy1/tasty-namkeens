import React, { useEffect, useState } from 'react';
import { X, MapPin, Phone, Clock, Loader2, Navigation } from 'lucide-react';
import api from '../api/axios';

export default function StoreFinderModal({ product, isOpen, onClose }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product || !isOpen) return;

    const fetchStores = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${product._id}/stores`);
        if (res.data?.success) {
          setStores(res.data.stores || []);
        } else {
          setStores(product.availableStores || []);
        }
      } catch {
        setStores(product.availableStores || []);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();

    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, [product, isOpen]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/50" />

      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900">Stores with {product.name}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{product.netWeight}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-6 h-6 text-red-700 animate-spin" />
            </div>
          ) : stores.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-400">
              No stores currently stocking this item.
            </p>
          ) : (
            <div className="space-y-4">
              {stores.map((store, idx) => {
                const addr = store.address
                  ? [store.address.street, store.address.city, store.address.pincode].filter(Boolean).join(', ')
                  : '';
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.storeName + ' ' + addr)}`;

                return (
                  <div key={store._id || idx} className="p-4 rounded-lg border border-gray-100 space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900">{store.storeName}</h4>

                    {addr && (
                      <div className="flex items-start gap-2 text-xs text-gray-500">
                        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{addr}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {store.phone && (
                        <a href={`tel:${store.phone}`} className="flex items-center gap-1 hover:text-gray-700">
                          <Phone className="w-3.5 h-3.5" /> {store.phone}
                        </a>
                      )}
                      {store.openingHours && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {store.openingHours}
                        </span>
                      )}
                    </div>

                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 hover:underline mt-1"
                    >
                      <Navigation className="w-3 h-3" /> Get Directions
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
