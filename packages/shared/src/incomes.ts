import { z } from 'zod';

export const createIncomeSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.number().positive('Valor deve ser positivo'),
  dataRecebimento: z.string().min(1, 'Data é obrigatória'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  recorrente: z.boolean().optional().default(false),
  recebido: z.boolean().optional().default(true),
});

export const updateIncomeSchema = createIncomeSchema.partial();
export type CreateIncomeDto = z.infer<typeof createIncomeSchema>;
export type UpdateIncomeDto = z.infer<typeof updateIncomeSchema>;
