import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, DollarSign, Calendar, MapPin, Home, Car, Building, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

interface EditListingFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  city: string;
  state: string;
  street: string;
  number: string;
  zipCode: string;
  contactInfo: string;
}

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
  images: string[];
  status: string;
  user_id: string;
}

const EditListing: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [listing, setListing] = useState<Listing | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<EditListingFormData>();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchListing();
  }, [id, user, navigate]);

  const fetchListing = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      setListing(data);
      
      // Preencher o formulário com os dados existentes
      setValue('title', data.title);
      setValue('description', data.description);
      setValue('price', data.price);
      setValue('category', data.category);
      setValue('city', data.city || '');
      setValue('state', data.state || '');
      setValue('street', data.street || '');
      setValue('number', data.number || '');
      setValue('zipCode', data.zip_code || '');
      setValue('contactInfo', data.contact_info || '');
      
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error('Erro ao carregar anúncio');
      navigate('/meus-anuncios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 5) {
      toast.error('Máximo 5 imagens permitidas');
      return;
    }
    setNewImages(files);
  };

  const uploadNewImages = async (listingId: string): Promise<string[]> => {
    if (newImages.length === 0) return [];

    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < newImages.length; i++) {
      const file = newImages[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${listingId}/${Date.now()}-${i}.${fileExt}`;
      
      try {
        const { data, error } = await supabase.storage
          .from('images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Error uploading image:', error);
          toast.error(`Erro ao fazer upload da imagem ${i + 1}`);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);

        uploadedUrls.push(urlData.publicUrl);
        setUploadProgress(((i + 1) / newImages.length) * 100);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(`Erro ao fazer upload da imagem ${i + 1}`);
        continue;
      }
    }

    return uploadedUrls;
  };

  const onSubmit = async (data: EditListingFormData) => {
    if (!listing || !user) {
      toast.error('Erro ao editar anúncio');
      return;
    }

    setIsSaving(true);
    
    try {
      // Upload de novas imagens
      const newImageUrls = await uploadNewImages(listing.id);
      
      // Combinar imagens existentes com novas
      const allImages = [...(listing.images || []), ...newImageUrls];

      // Preparar dados para atualização
      const updateData = {
        title: data.title.trim(),
        description: data.description.trim(),
        price: parseFloat(data.price.toString()),
        category: data.category,
        images: allImages,
        updated_at: new Date().toISOString()
      };

      // Adicionar campos opcionais se preenchidos
      if (data.city && data.city.trim()) updateData.city = data.city.trim();
      if (data.state && data.state.trim()) updateData.state = data.state.trim();
      if (data.street && data.street.trim()) updateData.street = data.street.trim();
      if (data.number && data.number.trim()) updateData.number = data.number.trim();
      if (data.zipCode && data.zipCode.trim()) updateData.zip_code = data.zipCode.trim();
      if (data.contactInfo && data.contactInfo.trim()) updateData.contact_info = data.contactInfo.trim();

      // Atualizar anúncio
      const { error: updateError } = await supabase
        .from('listings')
        .update(updateData)
        .eq('id', listing.id)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast.success('Anúncio atualizado com sucesso!');
      navigate('/meus-anuncios');

    } catch (error: any) {
      console.error('Error updating listing:', error);
      toast.error(`Erro ao atualizar anúncio: ${error.message || 'Tente novamente.'}`);
    } finally {
      setIsSaving(false);
      setUploadProgress(0);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Anúncio não encontrado</h2>
          <p className="text-gray-600 mb-6">O anúncio que você está tentando editar não foi encontrado.</p>
          <Button onClick={() => navigate('/meus-anuncios')}>
            Voltar aos Meus Anúncios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/meus-anuncios')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Editar Anúncio</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Anúncio *
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Título é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Casa com 3 quartos"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  {...register('category', { required: 'Categoria é obrigatória' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="imoveis">Imóveis</option>
                  <option value="veiculos">Veículos</option>
                  <option value="eletronicos">Eletrônicos</option>
                  <option value="servicos">Serviços</option>
                  <option value="outros">Outros</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                {...register('description', { required: 'Descrição é obrigatória' })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva detalhadamente o que está anunciando..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Preço e Localização */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço (R$) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { 
                      required: 'Preço é obrigatório',
                      min: { value: 0, message: 'Preço deve ser maior que zero' }
                    })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0,00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  {...register('city')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="São Paulo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <input
                  type="text"
                  {...register('state')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SP"
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rua
                </label>
                <input
                  type="text"
                  {...register('street')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Rua das Flores"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número
                </label>
                <input
                  type="text"
                  {...register('number')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  {...register('zipCode')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="01234-567"
                />
              </div>
            </div>

            {/* Informações de Contato */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Informações de Contato
              </label>
              <input
                type="text"
                {...register('contactInfo')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Telefone, WhatsApp, Email..."
              />
            </div>

            {/* Imagens Existentes */}
            {listing.images && listing.images.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagens Atuais
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {listing.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload de Novas Imagens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adicionar Novas Imagens (opcional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-2 w-full"
                />
                <p className="mt-2 text-sm text-gray-600">
                  Arraste as imagens aqui ou clique para selecionar
                </p>
              </div>
              {newImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {newImages.length} nova(s) imagem(ns) selecionada(s)
                  </p>
                  {uploadProgress > 0 && (
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/meus-anuncios')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditListing; 