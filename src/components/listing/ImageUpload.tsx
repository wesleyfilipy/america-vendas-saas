import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onChange: (files: File[]) => void;
  maxFiles?: number;
  value?: File[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onChange, 
  maxFiles = 10,
  value = []
}) => {
  const [files, setFiles] = useState<File[]>(value);
  const [previews, setPreviews] = useState<string[]>([]);
  
  React.useEffect(() => {
    // Create preview URLs for existing files
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
    
    // Cleanup function to revoke URLs to avoid memory leaks
    return () => {
      newPreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [files]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Limit to maxFiles
    const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
    setFiles(newFiles);
    onChange(newFiles);
  }, [files, onChange, maxFiles]);

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onChange(newFiles);
    
    // Revoke the preview URL
    URL.revokeObjectURL(previews[index]);
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles
  });

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 transition-colors duration-200 flex flex-col items-center justify-center ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        } ${files.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />
        <Upload className={`mb-2 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} size={32} />
        <p className="text-center text-gray-600 mb-1">
          {isDragActive 
            ? 'Solte as imagens aqui...'
            : 'Arraste e solte imagens aqui, ou clique para selecionar'
          }
        </p>
        <p className="text-sm text-gray-500 text-center">
          {files.length >= maxFiles 
            ? 'Número máximo de imagens atingido'
            : `Formatos suportados: JPEG, PNG, GIF, WEBP (máximo ${maxFiles} imagens)`
          }
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {`${files.length} de ${maxFiles} imagens selecionadas`}
        </p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="relative pb-[75%] rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={preview}
                  alt={`Imagem ${index + 1}`}
                  className="absolute h-full w-full object-cover"
                />
              </div>
              <button
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                type="button"
                aria-label="Remover imagem"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;