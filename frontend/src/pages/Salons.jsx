import axios from 'axios';
import { useEffect, useState } from 'react';

function Salons() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/salons')
      .then(res => {
        setSalons(res.data.data.salons);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });    
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg">
        Loading salons...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-10">
        Beauty Salons
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {salons.map(salon => (
          <div
            key={salon.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-6 flex flex-col"
          >
            <h3 className="text-xl font-semibold mb-2">
              {salon.name}
            </h3>

            <p className="text-gray-600 text-sm mb-1">
              📍 {salon.city}, {salon.address}
            </p>

            <p className="text-gray-600 text-sm">
              📞 {salon.phone}
            </p>

            <p className="text-gray-600 text-sm mb-3">
              ✉️ {salon.email}
            </p>

            <p className="text-gray-700 text-sm flex-grow">
              {salon.description}
            </p>

            <div className="flex items-center justify-between mt-4">
              <span className="text-yellow-500 font-bold">
                ⭐ {Number(salon.average_rating).toFixed(1)}
                <span className="text-gray-500 text-sm ml-1">
                  ({salon.review_count})
                </span>
              </span>

              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                Book now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Salons;
