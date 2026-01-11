
# ReservCut 🎨💇‍♀️

Une plateforme de réservation en ligne pour salons de coiffure et beauté au Maroc, avec gestion des rendez-vous et notifications.

## 📋 Description

ReserveCut est une application web complète qui permet aux clients de réserver facilement des créneaux dans les salons de coiffure et instituts de beauté au Maroc. La plateforme offre également un tableau de bord pour les propriétaires de salons afin de gérer leurs réservations et services.

## 🚀 Stack Technique

### Frontend
- **Framework**: React 19
- **Style**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Structure du Projet

```
my-project/
├── backend/
│   ├── config/          # Configuration (database, JWT)
│   ├── controllers/     # Contrôleurs des routes
│   ├── database/        # Schéma SQL
│   ├── middleware/      # Middleware (auth, role, rate limit)
│   ├── models/          # Modèles de données
│   ├── routes/          # Routes API
│   ├── server.js        # Point d'entrée du serveur
│   └── package.json
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── pages/       # Pages React
│       ├── components/  # Composants réutilisables
│       ├── App.js       # Composant principal
│       └── index.js     # Point d'entrée React
│
└── README.md
```

## 🛠️ Installation

### Prérequis
- Node.js (v16 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn

### 1. Installation des dépendances

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
```

### 2. Configuration de la base de données

1. Créer une base de données MySQL :
```sql
CREATE DATABASE reservcut;
```

2. Exécuter le schéma SQL :
```bash
mysql -u root -p reservcut < backend/database/schema.sql
```

### 3. Configuration de l'environnement

#### Backend
Copier le fichier `backend/env.example` vers `backend/.env` et configurer les variables :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=reservcut

PORT=5000
NODE_ENV=development

JWT_SECRET=votre-secret-jwt-tres-securise
JWT_EXPIRES_IN=24h

FRONTEND_URL=http://localhost:3000
```

### 4. Initialisation de Tailwind CSS (Frontend)

Les fichiers de configuration Tailwind sont déjà créés :
- `frontend/tailwind.config.js`
- `frontend/postcss.config.js`
- `frontend/src/index.css` (avec les directives Tailwind)

## ▶️ Démarrage

### Backend
```bash
cd backend
npm start
# ou pour le développement avec nodemon
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### Frontend
```bash
cd frontend
npm start
```

L'application React démarre sur `http://localhost:3000`

## 📄 Pages Disponibles

- **/** - Page d'accueil (welcoming page)
- **/login** - Page de connexion (à créer)
- **/register** - Page d'inscription (à créer)
- **/salons** - Liste des salons (à créer)
- **/booking** - Réservation (à créer)
- **/dashboard-salon** - Tableau de bord salon (à créer)
- **/notifications** - Notifications (à créer)

## 🎨 Composants Disponibles

- **SalonCard** - Carte d'affichage d'un salon (à créer)
- **BookingCalendar** - Calendrier de réservation (à créer)
- **NotificationBadge** - Badge de notification (à créer)

## 🔌 API Routes

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur
- `PUT /api/auth/profile` - Mise à jour du profil

### Salons
- `GET /api/salons` - Liste des salons
- `GET /api/salons/:id` - Détails d'un salon
- `POST /api/salons` - Créer un salon (salon)
- `PUT /api/salons/:id` - Mettre à jour un salon (salon)

### Services
- `GET /api/services/salon/:salonId` - Services d'un salon
- `POST /api/services/salon/:salonId` - Créer un service (salon)
- `PUT /api/services/:id` - Mettre à jour un service (salon)
- `DELETE /api/services/:id` - Supprimer un service (salon)

### Réservations
- `GET /api/bookings/my-bookings` - Mes réservations
- `GET /api/bookings/available-slots` - Créneaux disponibles
- `POST /api/bookings` - Créer une réservation
- `PUT /api/bookings/:id/status` - Mettre à jour le statut (salon)
- `DELETE /api/bookings/:id` - Annuler une réservation

### Notifications
- `GET /api/notifications` - Mes notifications
- `PUT /api/notifications/:id/read` - Marquer comme lu
- `PUT /api/notifications/read-all` - Tout marquer comme lu

## 🔐 Rôles

- **client** : Peut réserver des créneaux, voir ses réservations
- **salon** : Peut gérer son salon, ses services et ses réservations

## 🎯 Fonctionnalités

- ✅ Inscription / Connexion avec JWT
- ✅ Réservation de créneaux
- ✅ Gestion de profil client et salon
- ✅ Notifications et rappels
- ✅ Dashboard pour salons
- ✅ Responsive Design avec Tailwind CSS

## 📝 Notes

- Assurez-vous que MySQL est démarré avant de lancer le backend
- Le schéma SQL crée automatiquement les tables nécessaires
- Les mots de passe sont hashés avec bcryptjs
- Les tokens JWT expirent après 24h par défaut

## 🤝 Contribution

Ce projet est en cours de développement. N'hésitez pas à contribuer !


