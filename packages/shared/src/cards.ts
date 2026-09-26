import { z } from 'zod';

export const createCardSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  instituicaoFinanceira: z.string().min(1, 'Instituição é obrigatória'),
  ultimosDigitos: z.string().length(4, 'Deve conter exatamente 4 dígitos').optional(),
});

export const updateCardSchema = createCardSchema.partial();
export type CreateCardDto = z.infer<typeof createCardSchema>;
export type UpdateCardDto = z.infer<typeof updateCardSchema>;
