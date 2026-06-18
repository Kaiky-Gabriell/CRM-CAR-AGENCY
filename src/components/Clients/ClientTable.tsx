import React, { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, MessageCircle } from 'lucide-react';
import { FunnelStage } from '../../types';
import type { Client } from '../../types';
import { STAGE_MAP, SOURCE_MAP } from '../../utils/constants';
import { formatCurrency, formatDate, getWhatsAppLink } from '../../utils/formatters';
import { Badge } from '../UI/Badge';
import './ClientTable.css';

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onUpdateStage: (id: string, stage: FunnelStage) => void;
}

export const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  onEdit,
  onDelete,
  onUpdateStage
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const closeMenu = () => setActiveMenu(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  if (clients.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhum cliente encontrado.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="client-table">
        <thead>
          <tr>
            <th>Nome / Contato</th>
            <th>Veículo de Interesse</th>
            <th>Valor</th>
            <th>Etapa</th>
            <th>Origem</th>
            <th>Último Contato</th>
            <th className="action-column">Ações</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => {
            const stage = STAGE_MAP[client.funnelStage];
            const source = SOURCE_MAP[client.source];

            return (
              <tr key={client.id}>
                <td>
                  <div className="client-name-cell">
                    <p className="client-name">{client.name}</p>
                    <p className="client-phone">{client.phone}</p>
                  </div>
                </td>
                <td>{client.vehicleInterest || '-'}</td>
                <td>{client.estimatedValue ? formatCurrency(client.estimatedValue) : '-'}</td>
                <td>
                  <Badge color={stage.color} icon={stage.emoji}>
                    {stage.label}
                  </Badge>
                </td>
                <td>
                  <span className="source-label" title={source.label}>
                    {source.emoji} {source.label}
                  </span>
                </td>
                <td>{formatDate(client.lastContactAt)}</td>
                <td className="action-column relative">
                  <div className="action-buttons">
                    <a
                      href={getWhatsAppLink(client.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-btn whatsapp-btn"
                      title="Chamar no WhatsApp"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle size={18} />
                    </a>

                    <button
                      className="icon-btn"
                      onClick={(e) => toggleMenu(client.id, e)}
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {activeMenu === client.id && (
                      <div className="action-menu glass-card" onClick={(e) => e.stopPropagation()}>
                        <button className="menu-item" onClick={() => { onEdit(client); setActiveMenu(null); }}>
                          <Edit size={16} /> Editar
                        </button>
                        <button className="menu-item danger" onClick={() => { onDelete(client.id); setActiveMenu(null); }}>
                          <Trash2 size={16} /> Excluir
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
