const Service = require('../models/Service');
const Salon = require('../models/Salon');

exports.getServicesBySalon = async (req, res) => {
  try {
    const services = await Service.findBySalonId(req.params.salonId);

    res.json({
      success: true,
      data: { services }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

exports.createService = async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.salonId);

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: 'Salon non trouvé'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire du salon
    if (salon.owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas l\'autorisation d\'ajouter un service à ce salon'
      });
    }

    const serviceData = {
      ...req.body,
      salon_id: req.params.salonId
    };

    const service = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      message: 'Service créé avec succès',
      data: { service }
    });
  } catch (error) {
    console.error('Erreur lors de la création du service:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création'
    });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }

    const salon = await Salon.findById(service.salon_id);

    // Vérifier que l'utilisateur est le propriétaire du salon
    if (salon.owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas l\'autorisation de modifier ce service'
      });
    }

    const updatedService = await Service.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Service mis à jour avec succès',
      data: { service: updatedService }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du service:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour'
    });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }

    const salon = await Salon.findById(service.salon_id);

    // Vérifier que l'utilisateur est le propriétaire du salon
    if (salon.owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas l\'autorisation de supprimer ce service'
      });
    }

    await Service.delete(req.params.id);

    res.json({
      success: true,
      message: 'Service supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du service:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression'
    });
  }
};
