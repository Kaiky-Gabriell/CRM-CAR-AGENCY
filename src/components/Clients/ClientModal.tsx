import React, { useState, useEffect } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { FunnelStage, LeadSource } from '../../types';
import type { ClientFormData } from '../../types';
import { FUNNEL_STAGES, LEAD_SOURCES } from '../../utils/constants';
import { phoneMask } from '../../utils/formatters';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClientFormData) => void;
  initialData?: Partial<ClientFormData>;
  title?: string;
}

const defaultData: ClientFormData = {
  name: '',
  phone: '',
  email: '',
  vehicleInterest: '',
  estimatedValue: 0,
  funnelStage: FunnelStage.FIRST_CONTACT,
  source: LeadSource.WHATSAPP,
  notes: '',
};

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = 'Novo Cliente',
}) => {
  const [formData, setFormData] = useState<ClientFormData>(defaultData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData ? { ...defaultData, ...initialData } : defaultData);
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, [name]: phoneMask(value) }));
    } else if (name === 'estimatedValue') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="600px"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit}>Salvar</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex-col gap-md" style={{ display: 'flex' }}>
        <div className="flex gap-md">
          <Input
            label="Nome Completo *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ex: João Silva"
          />
          <Input
            label="WhatsApp / Telefone *"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="flex gap-md">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="joao@email.com"
          />
          <Input
            label="Veículo de Interesse"
            name="vehicleInterest"
            value={formData.vehicleInterest}
            onChange={handleChange}
            placeholder="Ex: Honda Civic 2022"
          />
        </div>

        <div className="flex gap-md">
          <Input
            label="Valor Estimado (R$)"
            name="estimatedValue"
            type="number"
            value={formData.estimatedValue || ''}
            onChange={handleChange}
            placeholder="120.000,00"
          />

          <div className="input-wrapper" style={{ flex: 1 }}>
            <label className="input-label">Etapa do Funil</label>
            <select
              name="funnelStage"
              className="input-field"
              value={formData.funnelStage}
              onChange={handleChange}
            >
              {FUNNEL_STAGES.map((stage) => (
                <option key={stage.key} value={stage.key}>
                  {stage.emoji} {stage.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-wrapper">
          <label className="input-label">Origem do Lead</label>
          <select
            name="source"
            className="input-field"
            value={formData.source}
            onChange={handleChange}
          >
            {LEAD_SOURCES.map((source) => (
              <option key={source.key} value={source.key}>
                {source.emoji} {source.label}
              </option>
            ))}
          </select>
        </div>

        <div className="input-wrapper">
          <label className="input-label">Notas e Observações</label>
          <textarea
            name="notes"
            className="input-field"
            style={{ minHeight: '100px', resize: 'vertical' }}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Detalhes da negociação, preferências do cliente, etc."
          />
        </div>
      </form>
    </Modal>
  );
};
