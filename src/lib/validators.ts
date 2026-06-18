import { z } from 'zod';
import { sanitizeString } from './sanitize';
import { FunnelStage, LeadSource } from '../types';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export const signupSchema = z.object({
  companyName: z
    .string()
    .min(2, 'O nome da agência deve ter no mínimo 2 caracteres')
    .max(100, 'O nome da agência deve ter no máximo 100 caracteres')
    .transform(sanitizeString),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export const clientFormSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter no mínimo 2 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres')
    .transform(sanitizeString),
  phone: z
    .string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Formato de telefone inválido'),
  email: z.union([z.string().email('Email inválido'), z.string().length(0)]).optional(),
  vehicleInterest: z
    .string()
    .max(200, 'O veículo de interesse deve ter no máximo 200 caracteres')
    .transform(sanitizeString),
  estimatedValue: z.number().nonnegative('O valor não pode ser negativo'),
  funnelStage: z.nativeEnum(FunnelStage),
  source: z.nativeEnum(LeadSource),
  notes: z
    .string()
    .max(2000, 'As notas devem ter no máximo 2000 caracteres')
    .transform(sanitizeString),
});

export const activitySchema = z.object({
  clientId: z.string().uuid('ID de cliente inválido'),
  clientName: z.string().transform(sanitizeString),
  action: z.enum(['created', 'moved', 'updated', 'deleted']),
  fromStage: z.nativeEnum(FunnelStage).optional(),
  toStage: z.nativeEnum(FunnelStage).optional(),
});
