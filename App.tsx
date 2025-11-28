import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Cashier } from './components/Cashier';
import { Orders } from './components/Orders';
import { Sales } from './components/Sales';
import { Customers } from './components/Customers';
import { Financial } from './components/Financial';
import { Settings } from './components/Settings';
import { View, CashierTransaction, Customer } from './types';
import { Menu, Bell, Search, PieChart } from 'lucide-react';

const INITIAL_CUSTOMERS: Customer[] = [
  { 
    id: '1', name: 'João da Silva', cpfOrCnpj: '123.456.789-00', phone: '(11) 99999-1234', email: 'joao@email.com', 
    address: 'Rua das Palmeiras, 123', city: 'São Paulo', state: 'SP', zipCode: '12230-000', neighborhood: 'Jardim Satélite',
    deviceHistory: 'iPhone 11 (IMEI: 3569888...)', createdAt: '2024-01-15' 
  },
  { 
    id: '2', name: 'Maria Oliveira', cpfOrCnpj: '987.654.321-99', phone: '(21) 98888-5678', email: 'maria@email.com', 
    address: 'Av. Brasil, 500', city: 'Rio de Janeiro', state: 'RJ',
    deviceHistory: 'Samsung S21', createdAt: '2024-02-20' 
  },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global State for Customers
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);

  const handleSaveCustomer = (customer: Customer) => {
    setCustomers(prev => {
      const exists = prev.find(c => c.id === customer.id);
      if (exists) {
        return prev.map(c => c.id === customer.id ? customer : c);
      }
      return [customer, ...prev];
    });
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  // Shared state for Financial Transactions (Cashier)
  const [transactions, setTransactions] = useState<CashierTransaction[]>([
    { id: '1', type: 'ENTRY', category: 'Venda #1024', amount: 1200, description: 'Venda de Tela iPhone', date: '08/11/2024 14:30', operator: 'Administrador' },
    { id: '2', type: 'EXIT', category: 'Alimentação', amount: 45, description: 'Almoço Equipe', date: '08/11/2024 12:00', operator: 'Administrador' },
    { id: '3', type: 'ENTRY', category: 'Serviço #552', amount: 250, description: 'Troca de Bateria', date: '08/11/2024 10:15', operator: 'Carlos Técnico' },
    { id: '4', type: 'EXIT', category: 'Fornecedor', amount: 600, description: 'Peças Reposição', date: '08/11/2024 09:00', operator: 'Administrador' },
  ]);

  const addTransaction = (transaction: CashierTransaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.SALES:
        return <Sales customers={customers} />;
      case View.INVENTORY:
        return <Inventory />;
      case View.CASHIER:
        return <Cashier transactions={transactions} onAddTransaction={addTransaction} />;
      case View.ORDERS:
        return <Orders onAddTransaction={addTransaction} customers={customers} />;
      case View.CUSTOMERS:
        return <Customers customers={customers} onSave={handleSaveCustomer} onDelete={handleDeleteCustomer} />;
      case View.FINANCIAL:
        return <Financial />;
      case View.SETTINGS:
        return <Settings />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-gray-400">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <span className="text-4xl">🚧</span>
            </div>
            <h2 className="text-xl font-bold text-gray-600">Módulo em Desenvolvimento</h2>
            <p>A funcionalidade {currentView} será implementada em breve.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-gray-600 hover:bg-gray-100 p-2 rounded-lg"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
              <Search size={18} className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Buscar no sistema..." 
                className="bg-transparent border-none outline-none text-sm w-full text-gray-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">Loja Matriz</p>
                <p className="text-xs text-green-600 font-medium">Online</p>
              </div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;