import React, { useState } from 'react';
import { Camera, MapPin, Mail, Phone, Scissors, CheckCircle, Upload } from 'lucide-react';

const SalonRegistration = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    salonName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    description: "",
    openingHours: "",
    services: [],
  });

  const servicesList = ["Coiffure Femme", "Barbier", "Manucure", "Maquillage", "Spa & Soins", "Coloration"];

  const toggleService = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service) 
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("salonName", formData.salonName || "");
    payload.append("ownerName", formData.ownerName || "");
    payload.append("email", formData.email || "");
    payload.append("phone", formData.phone || "");
    payload.append("address", formData.address || "");
    payload.append("city", formData.city || "");
    payload.append("description", formData.description || "");
    payload.append("openingHours", formData.openingHours || "");
    payload.append("services", JSON.stringify(formData.services));

    if (selectedFile) {
      payload.append("image", selectedFile);
    }

    try {
      const res = await fetch("http://localhost:5000/api/salons", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (data.success) {
        alert("Salon enregistré avec succès !");
        setFormData({
          salonName: "",
          ownerName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          description: "",
          openingHours: "",
          services: [],
        });
        setSelectedFile(null);
      } else {
        console.log("Erreur serveur : " + (data.message || "Veuillez réessayer"));
      }
    } catch (err) {
      console.error(err);
      console.log("Erreur lors de l'enregistrement du salon.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row relative z-10">
        
        {/* Left side branding */}
        <div className="hidden md:block w-1/2 bg-cover bg-center relative" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1521590832169-7dad6c8cc8c8?auto=format&fit=crop&q=80&w=1000")' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-rose-900/80 backdrop-blur-sm"></div>
          <div className="relative z-10 p-12 h-full flex flex-col justify-center text-white">
            <h2 className="text-4xl font-bold mb-6">Boostez votre visibilité</h2>
            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              Rejoignez plus de 500 professionnels de la beauté. Gérez vos rendez-vous, attirez de nouveaux clients et développez votre activité simplement.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center"><CheckCircle className="mr-3 text-rose-400" /> Agenda en ligne 24/7</li>
              <li className="flex items-center"><CheckCircle className="mr-3 text-rose-400" /> Rappels SMS automatiques</li>
              <li className="flex items-center"><CheckCircle className="mr-3 text-rose-400" /> Page vitrine personnalisée</li>
            </ul>
          </div>
        </div>

        {/* Right side form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Inscrivez votre établissement</h1>
            <p className="text-gray-500 text-sm mt-2">Commencez dès aujourd'hui, c'est gratuit pendant 30 jours.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Salon & Owner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Nom du Salon</label>
                <div className="relative">
                  <Scissors className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="salonName"
                    value={formData.salonName}
                    onChange={e => setFormData({ ...formData, salonName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition"
                    placeholder="Ex: Studio Chic"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Votre Nom</label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition"
                  placeholder="Nom complet"
                  required
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Email Pro</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition"
                    placeholder="contact@salon.com"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition"
                    placeholder="06 00 00 00 00"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="relative">
              <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Adresse complète</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition"
                  placeholder="123 Boulevard Massira, Casablanca"
                />
              </div>
            </div>

            {/* Services */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">Services proposés</label>
              <div className="flex flex-wrap gap-2">
                {servicesList.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      formData.services.includes(service)
                        ? "bg-rose-50 border-rose-500 text-rose-600"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>

            {/* File upload */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer group">
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                  <Camera size={24} />
                </div>
                <p className="text-sm text-gray-600 font-medium">Ajouter une photo du salon</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5Mo)</p>
              </label>
              {selectedFile && <p className="text-xs mt-2 text-green-600">{selectedFile.name} sélectionné</p>}
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              className="w-full py-3.5 mt-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:opacity-95 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
            >
              <Upload size={20} className="mr-2" />
              Créer mon compte partenaire
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SalonRegistration;
