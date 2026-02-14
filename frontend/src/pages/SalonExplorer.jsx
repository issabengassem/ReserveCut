import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Star, Filter, Heart } from 'lucide-react';

const SalonExplorer = () => {
  const [salons, setSalons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // T-akked anndak had l-endpoint f backend
    axios.get('http://localhost:5000/api/salons')
      .then(res => {
        // Hna l-fiks: ghadi n-checkiw ga3 l-i7timalat dyal tsawer
        const apiSalons = res.data.data.salons.map(salon => {
          
          if (salon.image && salon.image.data) {
            // 1. Ila kant tswira BLOB f database
            const bytes = new Uint8Array(salon.image.data);
            let binary = '';
            bytes.forEach(b => binary += String.fromCharCode(b));
            salon.displayImage = `data:image/png;base64,${window.btoa(binary)}`;
          } else if (salon.image_url) {
            // 2. Ila kant tswira URL (bhal dyal Google li chfna f database)
            salon.displayImage = salon.image_url;
          } else {
            // 3. Ila makan walo, ndiro placeholder khdam
            salon.displayImage = 'https://placehold.co/400x300?text=No+Image';
          }
          return salon;
        });
        setSalons(apiSalons);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur fetch salons:", err);
        setLoading(false);
      });
  }, []);

  const filteredSalons = salons.filter(salon => {
    return (
      (salon.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (salon.city?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (salon.address?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Chargement des salons...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header & Search */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Trouvez le salon parfait
          </h2>
          <div className="max-w-2xl mx-auto relative shadow-sm rounded-full overflow-hidden border bg-white">
            <input 
              type="text"
              placeholder="Rechercher un salon ou une ville..."
              className="w-full py-4 px-6 pl-12 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredSalons.map((salon) => (
            <div key={salon.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
              
              {/* Image Section */}
              <div className="relative h-48 bg-gray-200">
                <img 
                  src={salon.displayImage} 
                  alt={salon.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Error+Image'; }}
                />
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full cursor-pointer hover:bg-white transition-colors">
                  <Heart size={18} className="text-gray-600" />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{salon.name}</h3>
                  <span className="flex items-center bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-bold border border-green-100">
                    {salon.average_rating ? salon.average_rating.toFixed(1) : "5.0"}
                    <Star size={12} className="ml-1 fill-current" />
                  </span>
                </div>

                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPin size={14} className="mr-1" />
                  {salon.city}
                </div>

                <p className="text-sm text-gray-600 mb-2 line-clamp-2 italic">
                  {salon.address}
                </p>

                <p className="text-sm font-medium text-gray-700 mb-4">
                  📞 {salon.phone || "Non disponible"}
                </p>

                <div className="mt-auto pt-3 border-t flex justify-between items-center">
                  <span className="text-gray-400 text-xs">
                    {salon.review_count || 0} avis
                  </span>
                  <button className="text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors">
                    Réserver →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSalons.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Filter size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl">Aucun salon ne correspond à votre recherche.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default SalonExplorer;