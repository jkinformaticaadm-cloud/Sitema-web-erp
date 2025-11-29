import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Plans } from './pages/Plans';
import { Payment } from './pages/Payment';
import { Expired } from './pages/Expired';
import { Home } from './pages/Home';
import { View, CashierTransaction, Customer, Goals, CompanySettings } from './types';
import { Menu, Bell, Search, LogOut, Loader2 } from 'lucide-react';

// Mocks iniciais mantidos para funcionamento das telas internas (dashboard, vendas, etc)
const INITIAL_CUSTOMERS: Customer[] = [
  { id: '1', name: 'João da Silva', cpfOrCnpj: '123.456.789-00', phone: '(11) 99999-1234', email: 'joao@email.com', address: 'Rua 1', city: 'SP', state: 'SP', createdAt: '2024-01-15', storeCredit: 0 }
];
const INITIAL_TRANSACTIONS: CashierTransaction[] = [];
const INITIAL_GOALS: Goals = { globalRevenue: 40000, productRevenue: 15000, serviceRevenue: 25000 };
const INITIAL_COMPANY_SETTINGS: CompanySettings = { name: 'TechFix', legalName: '', cnpj: '', ie: '', address: '', phone1: '', phone2: '', email: '', logo: '' };

// Layout protegido principal (Sidebar + Header + Conteudo)
const MainLayout: React.FC = () => {
  const { signOut, profile, company, subscriptionStatus, loading } = useAuth();
  const [currentView, setCurrentView] = React.useState<View>(View.DASHBOARD);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  
  // Estados globais locais
  const [customers, setCustomers] = React.useState<Customer[]>(INITIAL_CUSTOMERS);
  const [transactions, setTransactions] = React.useState<CashierTransaction[]>(INITIAL_TRANSACTIONS);
  const [goals, setGoals] = React.useState<Goals>(INITIAL_GOALS);
  const [companySettings, setCompanySettings] = React.useState<CompanySettings>(INITIAL_COMPANY_SETTINGS);
  const [users, setUsers] = React.useState<any[]>([]); // Mock users list for Team component

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  // Bloqueio de Assinatura
  if (subscriptionStatus === 'expired') return <Navigate to="/expired" replace />;
  if (subscriptionStatus === 'inactive') return <Navigate to="/plans" replace />;

  const handleUpdateCustomerCredit = (name: string, amount: number) => { /* Mock Logic */ };
  const handleSaveCustomer = (c: Customer) => setCustomers(prev => [...prev, c]);
  const handleDeleteCustomer = (id: string) => setCustomers(prev => prev.filter(c => c.id !== id));
  const addTransaction = (t: CashierTransaction) => setTransactions(prev => [t, ...prev]);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard goals={goals} />;
      case View.SALES: return <Sales customers={customers} companySettings={companySettings} onUpdateCustomerCredit={handleUpdateCustomerCredit} />;
      case View.INVENTORY: return <Inventory />;
      case View.CASHIER: return <Cashier transactions={transactions} onAddTransaction={addTransaction} companySettings={companySettings} />;
      case View.ORDERS: return <Orders onAddTransaction={addTransaction} customers={customers} companySettings={companySettings} />;
      case View.CUSTOMERS: return <Customers customers={customers} onSave={handleSaveCustomer} onDelete={handleDeleteCustomer} />;
      case View.FINANCIAL: return <Financial />;
      case View.TEAM: return <Team users={users} />;
      case View.SETTINGS: return <Settings users={users} setUsers={setUsers} goals={goals} onUpdateGoals={setGoals} companySettings={companySettings} onUpdateCompanySettings={setCompanySettings} />;
      default: return <div>Em breve</div>;
    }
  };

  // Convert Supabase Profile to the generic User type expected by Sidebar
  const sidebarUser = {
    id: profile?.id || '0',
    name: profile?.nome || 'Usuário',
    username: profile?.email,
    email: profile?.email || '',
    role: 'Admin',
    permissions: { admin: true, financial: true, sales: true, stock: true, support: true, settings: true }
  };

  // Sync Supabase Company Name to Settings
  React.useEffect(() => {
    if (company) {
      setCompanySettings(prev => ({ ...prev, name: company.nome, phone1: company.telefone || '' }));
    }
  }, [company]);

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        currentUser={sidebarUser}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600 hover:bg-gray-100 p-2 rounded-lg" onClick={() => setIsMobileSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
              <Search size={18} className="text-gray-400 mr-2" />
              <input type="text" placeholder="Buscar no sistema..." className="bg-transparent border-none outline-none text-sm w-full text-gray-600" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">{company?.nome || 'Minha Empresa'}</p>
              <p className="text-xs text-green-600 font-medium">{profile?.nome}</p>
            </div>
            <button onClick={() => signOut()} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2" title="Sair">
              <LogOut size={20} />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

// Rota Protegida (Exige Login)
const ProtectedRoute: React.FC = () => {
  const { session, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  return session ? <Outlet /> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Home />} />
          
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected App Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/plans" element={<Plans />} />
            <Route path="/payment/:planId" element={<Payment />} />
            <Route path="/expired" element={<Expired />} />
            
            {/* Dashboard / Main App System */}
            <Route path="/app" element={<MainLayout />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
