import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ClientModal } from '../Clients/ClientModal';
import { useClients } from '../../hooks/useClients';
import './Layout.css';

export const Layout: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { addClient } = useClients();

  React.useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    document.addEventListener('open-add-client-modal', handleOpenModal);
    return () => document.removeEventListener('open-add-client-modal', handleOpenModal);
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-content">
        <Header />
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      <ClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addClient}
      />
    </div>
  );
};
