const Salon = require('../models/Salon');
const Service = require('../models/Service');

exports.getAllSalons = async (req, res) => {
  try {
    const { city, search } = req.query;
    let salons = await Salon.findAll();

    // Filtrer par ville si spécifié
    if (city) {
      salons = salons.filter(salon => 
        salon.city.toLowerCase() === city.toLowerCase()
      );
    }

    // Filtrer par recherche textuelle
    if (search) {
      const searchLower = search.toLowerCase();
      salons = salons.filter(salon =>
        salon.name.toLowerCase().includes(searchLower) ||
        salon.description?.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      data: { salons }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des salons:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

exports.getSalonById = async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);
    
    if (!salon) {
      return res.status(404).json({
        success: false,
        message: 'Salon non trouvé'
      });
    }

    // Récupérer les services du salon
    const services = await Service.findBySalonId(req.params.id);

    res.json({
      success: true,
      data: {
        salon,
        services
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du salon:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

exports.createSalon = async (req, res) => {
  try {
    const salonData = {
      ...req.body,
      owner_id: req.user.id
    };

    const salon = await Salon.create(salonData);

    res.status(201).json({
      success: true,
      message: 'Salon créé avec succès',
      data: { salon }
    });
  } catch (error) {
    console.error('Erreur lors de la création du salon:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création'
    });
  }
};

exports.updateSalon = async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: 'Salon non trouvé'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (salon.owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas l\'autorisation de modifier ce salon'
      });
    }

    const updatedSalon = await Salon.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Salon mis à jour avec succès',
      data: { salon: updatedSalon }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du salon:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour'
    });
  }
};

exports.getMySalons = async (req, res) => {
  try {
    const salons = await Salon.findByOwnerId(req.user.id);

    res.json({
      success: true,
      data: { salons }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des salons:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};
