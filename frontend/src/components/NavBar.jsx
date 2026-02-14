import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
                <Link to={"/"}>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                ReservCut
              </h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity shadow-md"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
