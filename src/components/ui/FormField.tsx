
import React from 'react';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle } from 'lucide-react';

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
  description
}) => {
  const InputComponent = type === 'textarea' ? Textarea : Input;
  
  return (
    <FormItem>
      <FormLabel className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </FormLabel>
      
      <FormControl>
        <div className="relative">
          <InputComponent
            type={type === 'textarea' ? undefined : type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className={`pr-10 transition-all duration-200 ${
              error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : success 
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                : 'focus:border-primary focus:ring-primary'
            }`}
          />
          
          {(error || success) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {error ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
          )}
        </div>
      </FormControl>
      
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
      
      {error && <FormMessage className="text-red-500">{error}</FormMessage>}
    </FormItem>
  );
};

export default FormField;
