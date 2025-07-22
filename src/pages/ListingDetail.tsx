import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

interface MockListing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  created_at: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  images: string[];
}

const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<MockListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchListing = async () => {
      setLoading(true);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockListing: MockListing = {
        id: id || '1',
        title: 'Casa em condomínio fechado com 3 quartos',
        description: `Linda casa localizada em condomínio fechado com segurança 24h. 
        
        Características:
        • 3 quartos (1 suíte)
        • 2 banheiros
        • Sala de estar e jantar
        • Cozinha americana
        • Garagem para 2 carros
        • Área de lazer com piscina
        • Jardim privativo
        
        A casa está em excelente estado de conservação, recém pintada e com acabamento de primeira linha. Localização privilegiada, próxima a escolas, shopping e transporte público.`,
        price: 450000,
        location: 'São Paulo, SP - Jardins',
        category: 'casa',
        created_at: '2024-01-15T10:30:00Z',
        user: {
          name: 'João Silva',
          email: 'joao.silva@email.com',
          phone: '(11) 99999-9999'
        },
        images: [
          'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
          'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
          'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
          'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg'
        ]
      };
      
      setListing(mockListing);
      setLoading(false);
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando anúncio...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Anúncio não encontrado</h2>
          <p className="text-gray-600 mb-6">O anúncio que você está procurando não existe ou foi removido.</p>
          <Link to="/">
            <Button>Voltar ao início</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="inline-flex items-center text-blue-700 hover:text-blue-800">
            <ArrowLeft size={20} className="mr-2" />
            Voltar aos anúncios
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={listing.images[selectedImage]}
                  alt={listing.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              
              {/* Thumbnail images */}
              {listing.images.length > 1 && (
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {listing.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold text-blue-700">
                  R$ {listing.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {listing.category}
                </span>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin size={20} className="mr-2" />
                {listing.location}
              </div>

              <div className="flex items-center text-gray-600 mb-6">
                <Calendar size={20} className="mr-2" />
                Publicado em {new Date(listing.created_at).toLocaleDateString('pt-BR')}
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">Descrição</h3>
                <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Informações de Contato</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-700 font-semibold">
                      {listing.user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{listing.user.name}</p>
                    <p className="text-sm text-gray-600">Anunciante</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Phone size={20} className="mr-3" />
                  <span>{listing.user.phone}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Mail size={20} className="mr-3" />
                  <span>{listing.user.email}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button className="w-full">
                  <Phone size={20} className="mr-2" />
                  Ligar agora
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Mail size={20} className="mr-2" />
                  Enviar mensagem
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;