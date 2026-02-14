const Salon = require('../models/Salon');
const Service = require('../models/Service');

// 1. جلب جميع الصالونات مع دعم البحث والفلترة بالمدينة
exports.getAllSalons = async (req, res) => {
  try {
    const { city, search } = req.query;
    let salons = await Salon.findAll(); // s.* كتجيب image_url أوتوماتيكياً

    if (city) {
      salons = salons.filter(salon => 
        salon.city.toLowerCase() === city.toLowerCase()
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      salons = salons.filter(salon =>
        salon.name.toLowerCase().includes(searchLower) ||
        salon.description?.toLowerCase().includes(searchLower)
      );
    }

    res.json({ success: true, data: { salons } });
  } catch (error) {
    console.error('Error in getAllSalons:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// 2. جلب صالون محدد بـ ID مع الخدمات ديالو
exports.getSalonById = async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ success: false, message: 'Salon non trouvé' });

    const services = await Service.findBySalonId(req.params.id);
    res.json({ success: true, data: { salon, services } });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// 3. إنشاء صالون جديد (يدعم الصور المرفوعة وروابط Google)
exports.createSalon = async (req, res) => {
  try {
    const salonData = {
      owner_id: 2, // المستخدم الافتراضي Salon Manager
      name: req.body.salonName || null,
      email: req.body.email || null,
      phone: req.body.phone || null,
      address: req.body.address || null, // NOT NULL في MySQL
      city: req.body.city || "default",   // NOT NULL في MySQL
      description: req.body.description || null,
      opening_hours: req.body.openingHours ? JSON.stringify(req.body.openingHours) : null,
      
      // دعم image_url للروابط الخارجية
      image_url: req.body.image_url || null, 
      
      // دعم image للصور الـ Binary
      image: req.file ? req.file.buffer : null 
    };

    const salon = await Salon.create(salonData);

    res.status(201).json({
      success: true,
      message: 'Salon créé avec succès',
      data: { salon }
    });
  } catch (error) {
    console.error('💥 Error in Salon.create:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création'
    });
  }
};

// 4. تحديث بيانات الصالون
exports.updateSalon = async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ success: false });

    // التحقق من الملكية (إلا كنتي مفعل الـ Auth)
    if (req.user && salon.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    const updatedData = {
      ...req.body,
      image: req.file ? req.file.buffer : undefined,
      image_url: req.body.image_url || undefined
    };

    const updatedSalon = await Salon.update(req.params.id, updatedData);
    res.json({ success: true, data: { salon: updatedSalon } });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// 5. جلب صالونات المستخدم الحالي
exports.getMySalons = async (req, res) => {
  try {
    const salons = await Salon.findByOwnerId(req.user.id);
    res.json({ success: true, data: { salons } });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};