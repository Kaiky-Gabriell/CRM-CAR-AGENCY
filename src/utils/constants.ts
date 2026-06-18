// ========================================
// CRM — Constants
// ========================================

import { FunnelStage, LeadSource } from '../types';
import type { FunnelStageInfo, LeadSourceInfo } from '../types';

export const FUNNEL_STAGES: FunnelStageInfo[] = [
  {
    key: FunnelStage.FIRST_CONTACT,
    label: 'Primeiro Contato',
    emoji: '👋',
    color: '#ffd93d',
    description: 'Cliente entrou em contato inicial',
  },
  {
    key: FunnelStage.ANALYZING,
    label: 'Analisando Opções',
    emoji: '🔍',
    color: '#6c9fff',
    description: 'Cliente está comparando veículos e opções',
  },
  {
    key: FunnelStage.NEGOTIATION,
    label: 'Negociação',
    emoji: '🤝',
    color: '#f0932b',
    description: 'Discussão de preço e condições',
  },
  {
    key: FunnelStage.FINANCING,
    label: 'Financiamento',
    emoji: '🏦',
    color: '#a855f7',
    description: 'Cliente em processo de financiamento',
  },
  {
    key: FunnelStage.CLOSING,
    label: 'Fechamento',
    emoji: '✅',
    color: '#22c55e',
    description: 'Venda concluída com sucesso',
  },
  {
    key: FunnelStage.LOST,
    label: 'Perdido',
    emoji: '❌',
    color: '#ef4444',
    description: 'Cliente desistiu da compra',
  },
];

export const LEAD_SOURCES: LeadSourceInfo[] = [
  { key: LeadSource.WHATSAPP, label: 'WhatsApp', emoji: '💬' },
  { key: LeadSource.INSTAGRAM, label: 'Instagram', emoji: '📸' },
  { key: LeadSource.FACEBOOK, label: 'Facebook', emoji: '📘' },
  { key: LeadSource.PRESENTIAL, label: 'Presencial', emoji: '🏪' },
  { key: LeadSource.REFERRAL, label: 'Indicação', emoji: '🗣️' },
  { key: LeadSource.WEBSITE, label: 'Site', emoji: '🌐' },
  { key: LeadSource.OTHER, label: 'Outro', emoji: '📋' },
];

export const STAGE_MAP: Record<FunnelStage, FunnelStageInfo> = Object.fromEntries(
  FUNNEL_STAGES.map((s) => [s.key, s])
) as Record<FunnelStage, FunnelStageInfo>;

export const SOURCE_MAP: Record<LeadSource, LeadSourceInfo> = Object.fromEntries(
  LEAD_SOURCES.map((s) => [s.key, s])
) as Record<LeadSource, LeadSourceInfo>;

export const DEFAULT_FOLLOW_UP_DAYS = 3;
