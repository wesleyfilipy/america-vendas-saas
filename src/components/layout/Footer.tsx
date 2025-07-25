import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Home } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="text-white font-bold text-2xl flex items-center gap-2">
              <Home size={24} />
              <span>AnúnciosFácil</span>
            </Link>
            <p className="mt-2 text-gray-300 text-sm">
              Sua plataforma confiável para anúncios de imóveis, veículos e muito mais.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/buscar" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">
                  Buscar Anúncios
                </Link>
              </li>
              <li>
                <Link to="/criar-anuncio" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">
                  Publicar Anúncio
                </Link>
              </li>
              <li>
                <Link to="/meus-anuncios" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">
                  Meus Anúncios
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/buscar?categoria=carro" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">
                  Carros
                </Link>
              </li>
              <li>
                <Link to="/buscar?categoria=casa" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">
                  Casas
                </Link>
              </li>
              <li>
                <Link to="/buscar?categoria=terreno" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">
                  Terrenos
                </Link>
              </li>
              <li>
                <Link to="/buscar?categoria=comercio" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">
                  Comércios
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span className="text-gray-300">(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span className="text-gray-300">contato@anunciosfacil.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span className="text-gray-300">São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} AnúnciosFácil. Todos os direitos reservados.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4 text-sm text-gray-300">
            <Link to="/termos" className="hover:text-white">Termos de Uso</Link>
            <Link to="/privacidade" className="hover:text-white">Política de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;