import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Search, Plus } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-blue-700 font-bold text-2xl flex items-center gap-2">
                <Home size={24} />
                <span>AnúnciosFácil</span>
              </Link>
            </div>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-50">
              Início
            </Link>
            <Link to="/buscar" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-50">
              Buscar
            </Link>
            <Link to="/criar-anuncio" className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 flex items-center gap-1">
              <Plus size={16} /> Anunciar
            </Link>
            <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-50">
              Entrar
            </Link>
            <Link to="/cadastro" className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-700 hover:bg-blue-800">
              Cadastrar
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/buscar"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Buscar
            </Link>
            <Link
              to="/criar-anuncio"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Anunciar
            </Link>
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Cadastrar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;