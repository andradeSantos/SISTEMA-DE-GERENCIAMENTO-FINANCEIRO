import { z } from 'zod';
import { MetodoPagamento } from './enums.js';

export const createExpenseSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.number().positive('Valor deve ser positivo'),
  dataPagamento: z.string().min(1, 'Data é obrigatória'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  metodoPagamento: z.nativeEnum(MetodoPagamento),
  totalParcelas: z.number().int().min(1).optional().default(1),
  recorrente: z.boolean().optional().default(false),
  cartaoId: z.string().uuid().optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();
export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseDto = z.infer<typeof updateExpenseSchema>;
