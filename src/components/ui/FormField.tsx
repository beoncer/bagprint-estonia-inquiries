
import React, { useState, useEffect } from 'react';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle, Mail, User, Phone } from 'lucide-react';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  placeholder?: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  description?: string;
  realTimeValidation?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  placeholder,
  required = false,
  error,
  success = false,
  value,
  onChange,
  disabled = false,
  description,
  realTimeValidation = true
}) => {
  const [localError, setLocalError] = useState<string>('');
  const [localSuccess, setLocalSuccess] = useState<boolean>(false);
  const [touched, setTouched] = useState<boolean>(false);

  // Real-time validation
  useEffect(() => {
    if (!realTimeValidation || !touched || !value) return;

    const validateField = () => {
      if (required && !value.trim()) {
        setLocalError('See väli on kohustuslik');
        setLocalSuccess(false);
        return;
      }

      if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setLocalError('Palun sisestage kehtiv e-posti aadress');
          setLocalSuccess(false);
          return;
        }
      }

      if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,}$/;
        if (!phoneRegex.test(value)) {
          setLocalError('Palun sisestage kehtiv telefoninumber');
          setLocalSuccess(false);
          return;
        }
      }

      setLocalError('');
      setLocalSuccess(true);
    };

    const timeoutId = setTimeout(validateField, 500);
    return () => clearTimeout(timeoutId);
  }, [value, type, required, realTimeValidation, touched]);

  const InputComponent = type === 'textarea' ? Textarea : Input;
  const currentError = error || localError;
  const currentSuccess = success || localSuccess;

  const getIcon = () => {
    if (currentError) return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (currentSuccess) return <CheckCircle className="h-4 w-4 text-green-500" />;
    
    // Type-specific icons
    if (type === 'email') return <Mail className="h-4 w-4 text-gray-400" />;
    if (type === 'tel') return <Phone className="h-4 w-4 text-gray-400" />;
    if (type === 'text') return <User className="h-4 w-4 text-gray-400" />;
    
    return null;
  };

  return (
    <FormItem>
      <FormLabel className="flex items-center gap-1 transition-colors duration-200">
        {label}
        {required && <span className="text-red-500">*</span>}
      </FormLabel>
      
      <FormControl>
        <div className="relative">
          <InputComponent
            type={type === 'textarea' ? undefined : type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              onChange?.(e.target.value);
              if (!touched) setTouched(true);
            }}
            onBlur={() => setTouched(true)}
            disabled={disabled}
            className={`pr-10 transition-all duration-200 ${
              currentError 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50' 
                : currentSuccess 
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20 bg-green-50/50'
                : 'focus:border-primary focus:ring-primary/20 hover:border-gray-400'
            }`}
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-200">
            {getIcon()}
          </div>
        </div>
      </FormControl>
      
      {description && !currentError && (
        <p className="text-sm text-gray-600 transition-opacity duration-200">{description}</p>
      )}
      
      {currentError && (
        <FormMessage className="text-red-500 flex items-center gap-1 animate-fade-in">
          <AlertCircle className="h-3 w-3" />
          {currentError}
        </FormMessage>
      )}

      {currentSuccess && !currentError && (
        <p className="text-sm text-green-600 flex items-center gap-1 animate-fade-in">
          <CheckCircle className="h-3 w-3" />
          Väli on korrektselt täidetud
        </p>
      )}
    </FormItem>
  );
};

export default FormField;
