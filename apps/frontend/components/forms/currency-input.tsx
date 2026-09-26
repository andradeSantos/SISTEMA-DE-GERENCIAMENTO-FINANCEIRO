'use client';

import React, { useState, useEffect } from 'react';
import { Input, type InputProps } from '@/components/ui/input';

export interface CurrencyInputProps extends Omit<InputProps, 'onChange' | 'value'> {
  value?: number;
  onChange?: (value: number) => void;
}

export function CurrencyInput({ value = 0, onChange, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState<string>('');

  useEffect(() => {
    if (value !== undefined && !isNaN(value)) {
      setDisplayValue(formatToBRL(value));
    } else {
      setDisplayValue('R$ 0,00');
    }
  }, [value]);

  function formatToBRL(cents: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawDigits = e.target.value.replace(/\D/g, '');
    const numericValue = parseInt(rawDigits || '0', 10) / 100;
    setDisplayValue(formatToBRL(numericValue));
    if (onChange) {
      onChange(numericValue);
    }
  }

  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
    />
  );
}
