import React from 'react';
import { Button } from '../components/UI/Button';
import { Download, Upload, Trash2 } from 'lucide-react';
import { storage } from '../services/storage';

export const Settings: React.FC = () => {
  const handleExport = () => {
    const data = storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crm-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (storage.importData(content)) {
        alert('Dados importados com sucesso! A página será recarregada.');
        window.location.reload();
      } else {
        alert('Erro ao importar dados. Arquivo inválido.');
      }
    };
    reader.readAsText(file);
    
    // reset input
    e.target.value = '';
  };

  const handleClear = () => {
    if (window.confirm('CUIDADO: Isso apagará TODOS os dados do CRM (clientes, atividades, etc). Esta ação não pode ser desfeita. Deseja continuar?')) {
      if (window.confirm('Tem certeza absoluta?')) {
        storage.clearAll();
        window.location.reload();
      }
    }
  };

  return (
    <div className="animate-fade-in flex-col gap-lg" style={{ display: 'flex' }}>
      <div className="page-header">
        <h1 className="page-title">Configurações</h1>
        <p className="page-description">Ajuste as preferências e gerencie os dados do seu CRM.</p>
      </div>

      <div className="glass-card" style={{ padding: 'var(--spacing-lg)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Gerenciamento de Dados</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)', fontSize: '0.875rem' }}>
          Como os dados são salvos no seu navegador, é importante fazer backups regulares.
        </p>

        <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
          <Button variant="secondary" leftIcon={<Download size={18} />} onClick={handleExport}>
            Exportar Backup
          </Button>

          <div style={{ position: 'relative' }}>
            <Button variant="secondary" leftIcon={<Upload size={18} />} onClick={() => document.getElementById('import-file')?.click()}>
              Importar Backup
            </Button>
            <input 
              type="file" 
              id="import-file" 
              accept=".json" 
              style={{ display: 'none' }} 
              onChange={handleImport}
            />
          </div>

          <Button variant="danger" leftIcon={<Trash2 size={18} />} onClick={handleClear}>
            Apagar Todos os Dados
          </Button>
        </div>
      </div>
    </div>
  );
};
