import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Cashier } from './components/Cashier';
import { Orders } from './components/Orders';
import { Sales } from './components/Sales';
import { Customers } from './components/Customers';
import { Financial } from './components/Financial';
import { Settings } from './components/Settings';
import { Team } from './components/Team';
import { Login } from './components/Login';
import { View, CashierTransaction, Customer, User } from './types';
import { Menu, Bell, Search, LogOut } from 'lucide-react';

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

const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'Administrador',
    username: 'admin',
    password: 'admin1234', // Senha padrão solicitada
    email: 'admin@rtjk.com',
    role: 'Administrador',
    permissions: {
      financial: true,
      sales: true,
      stock: true,
      support: true,
      settings: true,
      admin: true
    }
  },
  {
    id: '2',
    name: 'Técnico Padrão',
    username: 'tecnico',
    password: '123',
    email: 'tecnico@rtjk.com',
    role: 'Técnico',
    permissions: {
      financial: false,
      sales: true,
      stock: true,
      support: true,
      settings: false,
      admin: false
    }
  }
];

const INITIAL_TRANSACTIONS: CashierTransaction[] = [
    { id: '1', type: 'ENTRY', category: 'Venda #1024', amount: 1200, description: 'Venda de Tela iPhone', date: '08/11/2024 14:30', operator: 'Administrador' },
    { id: '2', type: 'EXIT', category: 'Alimentação', amount: 45, description: 'Almoço Equipe', date: '08/11/2024 12:00', operator: 'Administrador' },
    { id: '3', type: 'ENTRY', category: 'Serviço #552', amount: 250, description: 'Troca de Bateria', date: '08/11/2024 10:15', operator: 'Carlos Técnico' },
    { id: '4', type: 'EXIT', category: 'Fornecedor', amount: 600, description: 'Peças Reposição', date: '08/11/2024 09:00', operator: 'Administrador' },
];

const App: React.FC = () => {
  // Auth State - Armazena o objeto do usuário logado
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rtjk_session_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global State with LocalStorage Persistence
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('techfix_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('techfix_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validação de migração: Verifica se os dados salvos possuem a nova estrutura (username)
        // Se não tiverem, ou se a lista estiver vazia, reseta para os usuários iniciais
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].username) {
            return parsed;
        }
      } catch (e) {
        console.error("Erro ao carregar usuários do localStorage", e);
      }
    }
    // Fallback para usuários iniciais se não houver dados salvos ou se forem incompatíveis
    return INITIAL_USERS;
  });

  const [transactions, setTransactions] = useState<CashierTransaction[]>(() => {
    const saved = localStorage.getItem('techfix_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Effects to save data whenever it changes
  useEffect(() => {
    localStorage.setItem('techfix_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('techfix_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('techfix_transactions', JSON.stringify(transactions));
  }, [transactions]);


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

  const addTransaction = (transaction: CashierTransaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleLogin = (user: User) => {
    localStorage.setItem('rtjk_session_user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('rtjk_session_user');
    setCurrentUser(null);
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
      case View.TEAM:
        return <Team users={users} />;
      case View.SETTINGS:
        return <Settings users={users} setUsers={setUsers} />;
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

  // Se não estiver autenticado, exibe apenas a tela de Login
  if (!currentUser) {
    return <Login onLogin={handleLogin} users={users} />;
  }

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        currentUser={currentUser}
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
                <p className="text-sm font-bold text-gray-800">RTJK INFOCELL</p>
                <p className="text-xs text-green-600 font-medium">
                  {currentUser.name}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
                title="Sair do Sistema"
              >
                <LogOut size={20} />
              </button>
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