import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Upload, DollarSign, Calendar, MapPin, Home, Car, Building } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

interface CreateListingFormData {
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

const CreateListing: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm<CreateListingFormData>();



  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 5) {
      toast.error('Máximo 5 imagens permitidas');
      return;
    }
    setImages(files);
  };

  const uploadImages = async (listingId: string): Promise<string[]> => {
    if (images.length === 0) return [];

    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
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
        setUploadProgress(((i + 1) / images.length) * 100);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(`Erro ao fazer upload da imagem ${i + 1}`);
        continue;
      }
    }

    return uploadedUrls;
  };

  const onSubmit = async (data: CreateListingFormData) => {
    if (!user) {
      toast.error('Você precisa estar logado para criar um anúncio');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('User ID:', user.id);
      console.log('Form data:', data);

      // Preparar dados do anúncio (sempre como rascunho primeiro)
      const listingData = {
        title: data.title.trim(),
        description: data.description.trim(),
        price: parseFloat(data.price.toString()),
        category: data.category,
        user_id: user.id,
        status: 'published', // Publicar diretamente
        is_paid: false,
        images: [], // Inicializar array vazio
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias padrão
      };

      // Adicionar campos opcionais se preenchidos
      if (data.city && data.city.trim()) listingData.city = data.city.trim();
      if (data.state && data.state.trim()) listingData.state = data.state.trim();
      if (data.street && data.street.trim()) listingData.street = data.street.trim();
      if (data.number && data.number.trim()) listingData.number = data.number.trim();
      if (data.zipCode && data.zipCode.trim()) listingData.zip_code = data.zipCode.trim();
      if (data.contactInfo && data.contactInfo.trim()) listingData.contact_info = data.contactInfo.trim();

      console.log('Creating listing with data:', listingData);

      // Verificar se o usuário existe na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, name')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('User not found in users table:', userError);
        // Criar usuário na tabela users se não existir
        const { error: insertUserError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || 'Usuário',
            phone: user.user_metadata?.phone || ''
          });

        if (insertUserError) {
          console.error('Error creating user:', insertUserError);
          throw new Error('Erro ao criar perfil de usuário');
        }
      }

      // Criar o anúncio
      const { data: createdListing, error: listingError } = await supabase
        .from('listings')
        .insert(listingData)
        .select()
        .single();

      if (listingError) {
        console.error('Supabase error details:', {
          message: listingError.message,
          details: listingError.details,
          hint: listingError.hint,
          code: listingError.code
        });
        
        // Se for erro 409, tentar identificar o problema
        if (listingError.code === '409') {
          throw new Error('Conflito na criação do anúncio. Verifique se todos os campos estão corretos.');
        }
        
        throw new Error(`Erro ao criar anúncio: ${listingError.message}`);
      }

      if (!createdListing) {
        throw new Error('Anúncio não foi criado');
      }

      console.log('Listing created successfully:', createdListing);

      // Upload das imagens
      const imageUrls = await uploadImages(createdListing.id);

      // Atualizar anúncio com as imagens
      if (imageUrls.length > 0) {
        const { error: updateError } = await supabase
          .from('listings')
          .update({ images: imageUrls })
          .eq('id', createdListing.id);

        if (updateError) {
          console.error('Error updating images:', updateError);
        }
      }

      toast.success('Anúncio criado com sucesso!');

      // Sempre redirecionar para a página de pagamento para escolher a opção
      navigate(`/payment/${createdListing.id}`);

    } catch (error: any) {
      console.error('Error creating listing:', error);
      toast.error(`Erro ao criar anúncio: ${error.message || 'Tente novamente.'}`);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Criar Novo Anúncio</h1>

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
                  Cidade *
                </label>
                <input
                  type="text"
                  {...register('city', { required: 'Cidade é obrigatória' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="São Paulo"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado *
                </label>
                <input
                  type="text"
                  {...register('state', { required: 'Estado é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SP"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                )}
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

            {/* Contato */}
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

            {/* Upload de Imagens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagens (máximo 5)
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
              {images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {images.length} imagem(ns) selecionada(s)
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



            {/* Botão de Envio */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3"
              >
                {isLoading ? 'Criando Anúncio...' : 'Criar Anúncio'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;