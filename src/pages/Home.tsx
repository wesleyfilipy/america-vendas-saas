import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home as HomeIcon, Car, Building, MapPin, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-blue-700 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
            alt="Imóveis"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 md:py-28">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Encontre Imóveis e Veículos<br />de Maneira Fácil e Rápida
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Anuncie ou encontre casas, terrenos, carros ou comércios em uma única plataforma
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/buscar">
                <Button 
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50"
                >
                  <Search size={20} className="mr-2" />
                  Buscar Anúncios
                </Button>
              </Link>
              <Link to="/criar-anuncio">
                <Button
                  size="lg"
                  variant="secondary"
                >
                  <TrendingUp size={20} className="mr-2" />
                  Publicar Anúncio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Encontre o que você procura
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: 'Casas', icon: <HomeIcon size={32} />, category: 'casa', color: 'bg-green-100 text-green-600' },
              { name: 'Carros', icon: <Car size={32} />, category: 'carro', color: 'bg-blue-100 text-blue-600' },
              { name: 'Terrenos', icon: <MapPin size={32} />, category: 'terreno', color: 'bg-yellow-100 text-yellow-600' },
              { name: 'Comércios', icon: <Building size={32} />, category: 'comercio', color: 'bg-purple-100 text-purple-600' },
            ].map((category) => (
              <Link 
                key={category.name}
                to={`/buscar?categoria=${category.category}`}
                className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 text-center transition-all duration-200 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 mx-auto rounded-full ${category.color} flex items-center justify-center mb-4`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{category.name}</h3>
                <p className="text-gray-500">Encontre os melhores {category.name.toLowerCase()}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Recent Listings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Anúncios Recentes
            </h2>
            <Link to="/buscar" className="text-blue-700 hover:text-blue-800 font-medium">
              Ver todos →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder cards */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Imagem do anúncio</span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Anúncio de exemplo {i}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    Este é um anúncio de exemplo para demonstrar como o site funciona.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-700">
                      R$ {(i * 100000).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      Localização
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Por que escolher o AnúnciosFácil?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Search size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Busca Fácil</h3>
              <p className="text-gray-600">
                Encontre exatamente o que procura com nossos filtros avançados
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Anúncios Gratuitos</h3>
              <p className="text-gray-600">
                Publique seus anúncios gratuitamente e alcance mais pessoas
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <HomeIcon size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Variedade</h3>
              <p className="text-gray-600">
                Imóveis, veículos e muito mais em uma única plataforma
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;