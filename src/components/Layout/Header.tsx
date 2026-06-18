import React from 'react';
import { Search, Bell, Plus } from 'lucide-react';
import { Button } from '../UI/Button';
import './Header.css';

export const Header: React.FC = () => {
  return (
    <header className="header glass">
      <div className="header-search">
        <Search className="search-icon" size={18} />
        <input 
          type="text" 
          placeholder="Buscar clientes, veículos, telefone..." 
          className="search-input"
        />
      </div>
      
      <div className="header-actions">
        <button className="notification-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        
        <Button 
          variant="primary" 
          leftIcon={<Plus size={18} />}
          onClick={() => {
            // This will be connected to a global state or context later
            // For now, it's just a UI element in the header
            document.dispatchEvent(new CustomEvent('open-add-client-modal'));
          }}
        >
          Novo Cliente
        </Button>
      </div>
    </header>
  );
};
