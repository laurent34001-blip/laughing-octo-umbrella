import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">DealConnect</h3>
            <p className="text-sm text-gray-400">
              La plateforme de trading peer-to-peer pour vendre et acheter facilement.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Accès rapide</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Toutes les annonces
                </Link>
              </li>
              <li>
                <Link to="/creer-annonce" className="hover:text-blue-400 transition">
                  Créer une annonce
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blue-400 transition">
                  Mon tableau de bord
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Centre d'aide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Contactez-nous
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p className="text-sm text-gray-400 mb-2">Email</p>
            <a href="mailto:info@dealconnect.com" className="text-blue-400 hover:text-blue-300 text-sm">
              info@dealconnect.com
            </a>
            <p className="text-sm text-gray-400 mt-4">Téléphone</p>
            <a href="tel:+33612345678" className="text-blue-400 hover:text-blue-300 text-sm">
              +33 6 12 34 56 78
            </a>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-700 my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2025 DealConnect. Tous droits réservés.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-400 transition">
              Facebook
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              Twitter
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              Instagram
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}