import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  city: string;
  state: string;
  street: string;
  number: string;
  zip_code: string;
  contact_info: string;
  created_at: string;
  images: string[];
  user_id: string;
  user: {
    name: string;
    email: string;
  };
}

const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    if (!id) return;

    try {
      setLoading(true);
      
      // Buscar o anúncio com dados do usuário
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          user:users(name, email)
        `)
        .eq('id', id)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('Error fetching listing:', error);
        setListing(null);
        return;
      }

      setListing(data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      setListing(null);
    } finally {
      setLoading(false);
    }
  };

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

  const getLocation = () => {
    const parts = [];
    if (listing.city) parts.push(listing.city);
    if (listing.state) parts.push(listing.state);
    if (listing.street) parts.push(listing.street);
    if (listing.number) parts.push(listing.number);
    
    return parts.length > 0 ? parts.join(', ') : 'Localização não informada';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'imoveis': 'Imóveis',
      'veiculos': 'Veículos',
      'eletronicos': 'Eletrônicos',
      'servicos': 'Serviços',
      'outros': 'Outros'
    };
    return labels[category] || category;
  };

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
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[selectedImage]}
                    alt={listing.title}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Sem imagem</span>
                  </div>
                )}
              </div>
              
              {/* Thumbnail images */}
              {listing.images && listing.images.length > 1 && (
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
                  {getCategoryLabel(listing.category)}
                </span>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin size={20} className="mr-2" />
                {getLocation()}
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
              
              {listing.user && (
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Mail size={20} className="mr-3 text-gray-400" />
                    <span>{listing.user.email}</span>
                  </div>
                  
                  {listing.contact_info && (
                    <div className="flex items-center text-gray-700">
                      <Phone size={20} className="mr-3 text-gray-400" />
                      <span>{listing.contact_info}</span>
                    </div>
                  )}
                </div>
              )}
              
              {!listing.user && listing.contact_info && (
                <div className="flex items-center text-gray-700">
                  <Phone size={20} className="mr-3 text-gray-400" />
                  <span>{listing.contact_info}</span>
                </div>
              )}
            </div>

            {/* Additional Details */}
            {(listing.street || listing.number || listing.zip_code) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Endereço Completo</h3>
                <div className="space-y-2 text-gray-700">
                  {listing.street && <p>Rua: {listing.street}</p>}
                  {listing.number && <p>Número: {listing.number}</p>}
                  {listing.city && <p>Cidade: {listing.city}</p>}
                  {listing.state && <p>Estado: {listing.state}</p>}
                  {listing.zip_code && <p>CEP: {listing.zip_code}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;