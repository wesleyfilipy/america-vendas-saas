import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

interface CreateListingFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  contactPhone: string;
  contactEmail: string;
}

const CreateListing: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError
  } = useForm<CreateListingFormData>();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );
    
    if (validFiles.length + images.length > 10) {
      alert('Máximo de 10 imagens permitido');
      return;
    }
    
    setImages(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateListingFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      console.log('Creating listing:', data);
      console.log('Images:', images);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to success page or home
      navigate('/', { 
        state: { message: 'Anúncio criado com sucesso!' }
      });
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Erro ao criar anúncio. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-blue-700 hover:text-blue-800"
            >
              <ArrowLeft size={20} className="mr-2" />
              Voltar
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Criar Anúncio</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Título do anúncio *
                  </label>
                  <input
                    type="text"
                    id="title"
                    {...register('title', {
                      required: 'Título é obrigatório',
                      minLength: {
                        value: 10,
                        message: 'Título deve ter pelo menos 10 caracteres'
                      }
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Casa com 3 quartos em condomínio fechado"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Categoria *
                  </label>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: 'Categoria é obrigatória' }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Selecione uma categoria</option>
                        <option value="casa">Casa</option>
                        <option value="carro">Carro</option>
                        <option value="terreno">Terreno</option>
                        <option value="comercio">Comércio</option>
                      </select>
                    )}
                  />
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    {...register('price', {
                      required: 'Preço é obrigatório',
                      min: {
                        value: 0,
                        message: 'Preço deve ser maior que zero'
                      }
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0,00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Localização *
                  </label>
                  <input
                    type="text"
                    id="location"
                    {...register('location', {
                      required: 'Localização é obrigatória'
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: São Paulo, SP - Jardins"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição detalhada *
              </label>
              <textarea
                id="description"
                rows={6}
                {...register('description', {
                  required: 'Descrição é obrigatória',
                  minLength: {
                    value: 50,
                    message: 'Descrição deve ter pelo menos 50 caracteres'
                  }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descreva detalhadamente o que está anunciando..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagens (máximo 10)
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Arraste e solte as imagens aqui, ou clique para selecionar
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 cursor-pointer"
                  >
                    <Plus size={16} className="mr-2" />
                    Selecionar imagens
                  </label>
                </div>
              </div>

              {/* Image previews */}
              {images.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Imagens selecionadas ({images.length}/10)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações de Contato</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    {...register('contactPhone', {
                      required: 'Telefone é obrigatório'
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(11) 99999-9999"
                  />
                  {errors.contactPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    {...register('contactEmail', {
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="seu@email.com"
                  />
                  {errors.contactEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{errors.root.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Criando anúncio...' : 'Criar anúncio'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;