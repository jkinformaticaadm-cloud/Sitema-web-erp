import React, { useEffect, useState, ErrorInfo, ReactNode, Component } from 'react';
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
import { AdminDashboard } from './components/AdminDashboard'; 
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Plans } from './pages/Plans';
import { Payment } from './pages/Payment';
import { Expired } from './pages/Expired';
import { Home } from './pages/Home';
import { View, CashierTransaction, Customer, Goals, CompanySettings, Product, User } from './types';
import { Menu, Search, LogOut, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from './lib/supabase';

// Mocks iniciais
const INITIAL_TRANSACTIONS: CashierTransaction[] = [];
const INITIAL_GOALS: Goals = { globalRevenue: 40000, productRevenue: 15000, serviceRevenue: 25000 };
const INITIAL_COMPANY_SETTINGS: CompanySettings = { name: 'AssisTech', legalName: '', cnpj: '', ie: '', address: '', phone1: '', phone2: '', email: '', logo: '' };

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("Erro crítico na aplicação:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Ops! Algo deu errado.</h2>
            <p className="text-gray-500 mb-6">
              O sistema encontrou um erro inesperado. Isso geralmente acontece por dados antigos no navegador.
            </p>
            <div className="bg-gray-100 p-3 rounded-lg text-left text-xs font-mono text-gray-600 mb-6 overflow-auto max-h-32">
              {this.state.error?.toString()}
            </div>
            <button 
              onClick={this.handleReset}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Reiniciar Sistema
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

const MainLayout: React.FC = () => {
  const { signOut, profile, company, subscriptionStatus, loading } = useAuth();
  const [currentView, setCurrentView] = React.useState<View>(View.DASHBOARD);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  
  // Estados globais
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = React.useState(false);
  
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = React.useState(false);

  const [transactions, setTransactions] = React.useState<CashierTransaction[]>(INITIAL_TRANSACTIONS);
  const [goals, setGoals] = React.useState<Goals>(INITIAL_GOALS);
  const [companySettings, setCompanySettings] = React.useState<CompanySettings>(INITIAL_COMPANY_SETTINGS);
  const [users, setUsers] = React.useState<User[]>([]);

  // Verifica se é modo Mock (Admin Local)
  const isMockMode = profile?.id === 'mock-admin-id';

  // Initialize current user in users list if empty
  useEffect(() => {
      if (profile && users.length === 0) {
          const initialUser: User = {
              id: profile.id,
              name: profile.nome,
              email: profile.email,
              role: 'Administrador',
              username: profile.email.split('@')[0],
              permissions: { admin: true, financial: true, sales: true, stock: true, support: true, settings: true }
          };
          setUsers([initialUser]);
      }
  }, [profile, users.length]);

  // --- FETCH DATA ---

  const fetchCustomers = async () => {
    if (!profile?.empresa_id) return;
    setLoadingCustomers(true);
    
    // MOCK MODE: Usa LocalStorage
    if (isMockMode) {
        try {
            const saved = localStorage.getItem('techfix_mock_customers');
            if (saved) setCustomers(JSON.parse(saved));
        } catch (e) { console.error(e); }
        setLoadingCustomers(false);
        return;
    }

    // REAL MODE: Usa Supabase
    try {
      const { data, error } = await supabase.from('clientes').select('*').eq('empresa_id', profile.empresa_id).order('nome');
      if (error) throw error;
      if (data) {
        setCustomers(data.map(c => ({
          id: c.id,
          name: c.nome,
          cpfOrCnpj: c.cpf_cnpj || '',
          rg: c.rg || '',
          phone: c.telefone || '',
          email: c.email || '',
          zipCode: c.cep || '',
          address: c.endereco || '',
          complement: c.complemento || '',
          neighborhood: c.bairro || '',
          city: c.cidade || '',
          state: c.estado || '',
          deviceHistory: c.historico_aparelhos || '',
          notes: c.notas || '',
          storeCredit: c.credito_loja || 0,
          createdAt: c.created_at
        })));
      }
    } catch (err) { console.error('Erro ao carregar clientes:', err); } 
    finally { setLoadingCustomers(false); }
  };

  const fetchProducts = async () => {
    if (!profile?.empresa_id) return;
    setLoadingProducts(true);

    // MOCK MODE: Usa LocalStorage
    if (isMockMode) {
        try {
            const saved = localStorage.getItem('techfix_mock_products');
            if (saved) setProducts(JSON.parse(saved));
        } catch (e) { console.error(e); }
        setLoadingProducts(false);
        return;
    }

    // REAL MODE
    try {
        const { data, error } = await supabase.from('produtos').select('*').eq('empresa_id', profile.empresa_id).order('nome');
        if (error) throw error;
        if (data) {
            setProducts(data.map(p => ({
                id: p.id,
                name: p.nome,
                category: p.categoria || 'Geral',
                price: p.preco || 0,
                cost: p.custo || 0,
                stock: p.estoque || 0,
                minStock: p.estoque_minimo || 0,
                image: p.imagem || '',
                type: p.tipo || 'PRODUCT',
                compatible: p.modelo_compativel || ''
            })));
        }
    } catch(err) { console.error('Erro ao carregar produtos:', err); }
    finally { setLoadingProducts(false); }
  }

  useEffect(() => {
    if (company) {
      setCompanySettings(prev => ({ ...prev, name: company.nome, phone1: company.telefone || '' }));
      fetchCustomers();
      fetchProducts();
    }
  }, [company]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  if (subscriptionStatus === 'expired') return <Navigate to="/expired" replace />;
  if (subscriptionStatus === 'inactive') return <Navigate to="/plans" replace />;

  // --- ACTIONS ---

  const handleUpdateCustomerCredit = async (customerName: string, amount: number) => { 
     const customer = customers.find(c => c.name === customerName);
     if (customer && profile?.empresa_id) {
         const newCredit = (customer.storeCredit || 0) + amount;
         
         if (isMockMode) {
             const updated = customers.map(c => c.id === customer.id ? { ...c, storeCredit: newCredit } : c);
             setCustomers(updated);
             localStorage.setItem('techfix_mock_customers', JSON.stringify(updated));
             return;
         }

         try {
             await supabase.from('clientes').update({ credito_loja: newCredit }).eq('id', customer.id);
             fetchCustomers();
         } catch (e) { console.error(e); }
     }
  };

  const handleSaveCustomer = async (c: Customer) => {
      if (!profile?.empresa_id) return;
      
      if (isMockMode) {
          let updatedList;
          if (c.id && customers.some(cust => cust.id === c.id)) {
              updatedList = customers.map(cust => cust.id === c.id ? c : cust);
          } else {
              updatedList = [...customers, { ...c, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() }];
          }
          setCustomers(updatedList);
          localStorage.setItem('techfix_mock_customers', JSON.stringify(updatedList));
          return;
      }

      const dbCustomer = {
        empresa_id: profile.empresa_id,
        nome: c.name, telefone: c.phone, email: c.email, cpf_cnpj: c.cpfOrCnpj, rg: c.rg,
        cep: c.zipCode, endereco: c.address, complemento: c.complement, bairro: c.neighborhood,
        cidade: c.city, estado: c.state, historico_aparelhos: c.deviceHistory, notas: c.notes, credito_loja: c.storeCredit
      };
      try {
          if (c.id && c.id.length > 15) { 
             const { error } = await supabase.from('clientes').update(dbCustomer).eq('id', c.id);
             if (error) throw error;
          } else {
             const { error } = await supabase.from('clientes').insert([dbCustomer]);
             if (error) throw error;
          }
          await fetchCustomers();
      } catch (e) { alert("Erro ao salvar cliente."); console.error(e); }
  };

  const handleDeleteCustomer = async (id: string) => {
      if (!confirm("Tem certeza que deseja excluir?")) return;
      
      if (isMockMode) {
          const updated = customers.filter(c => c.id !== id);
          setCustomers(updated);
          localStorage.setItem('techfix_mock_customers', JSON.stringify(updated));
          return;
      }

      try {
          const { error } = await supabase.from('clientes').delete().eq('id', id);
          if (error) throw error;
          await fetchCustomers();
      } catch (e) { alert("Erro ao excluir cliente."); }
  };

  const handleSaveProduct = async (p: Product) => {
      if (!profile?.empresa_id) return;

      if (isMockMode) {
          let updatedList;
          if (p.id && products.some(prod => prod.id === p.id)) {
              updatedList = products.map(prod => prod.id === p.id ? p : prod);
          } else {
              updatedList = [...products, { ...p, id: Math.random().toString(36).substr(2, 9) }];
          }
          setProducts(updatedList);
          localStorage.setItem('techfix_mock_products', JSON.stringify(updatedList));
          return;
      }

      const dbProduct = {
          empresa_id: profile.empresa_id,
          nome: p.name,
          categoria: p.category,
          preco: p.price,
          custo: p.cost,
          estoque: p.stock,
          estoque_minimo: p.minStock,
          imagem: p.image,
          tipo: p.type,
          modelo_compativel: p.compatible
      };
      try {
          if (p.id && p.id.length > 15) {
              const { error } = await supabase.from('produtos').update(dbProduct).eq('id', p.id);
              if (error) throw error;
          } else {
              const { error } = await supabase.from('produtos').insert([dbProduct]);
              if (error) throw error;
          }
          await fetchProducts();
      } catch (e) { alert("Erro ao salvar produto."); console.error(e); }
  }

  const handleDeleteProduct = async (id: string) => {
      if (!confirm("Tem certeza?")) return;

      if (isMockMode) {
          const updated = products.filter(p => p.id !== id);
          setProducts(updated);
          localStorage.setItem('techfix_mock_products', JSON.stringify(updated));
          return;
      }

      try {
          const { error } = await supabase.from('produtos').delete().eq('id', id);
          if (error) throw error;
          await fetchProducts();
      } catch (e) { alert("Erro ao excluir produto."); }
  }
  
  const addTransaction = (t: CashierTransaction) => setTransactions(prev => [t, ...prev]);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard goals={goals} />;
      case View.SALES: return <Sales customers={customers} products={products} companySettings={companySettings} onUpdateCustomerCredit={handleUpdateCustomerCredit} />;
      case View.INVENTORY: return <Inventory products={products} onSave={handleSaveProduct} onDelete={handleDeleteProduct} />;
      case View.CASHIER: return <Cashier transactions={transactions} onAddTransaction={addTransaction} companySettings={companySettings} />;
      case View.ORDERS: return <Orders onAddTransaction={addTransaction} customers={customers} products={products} companySettings={companySettings} />;
      case View.CUSTOMERS: return <Customers customers={customers} onSave={handleSaveCustomer} onDelete={handleDeleteCustomer} />;
      case View.FINANCIAL: return <Financial goals={goals} onUpdateGoals={setGoals} />;
      case View.TEAM: return <Team users={users} />;
      case View.SETTINGS: return <Settings users={users} setUsers={setUsers} companySettings={companySettings} onUpdateCompanySettings={setCompanySettings} />;
      default: return <div>Em breve</div>;
    }
  };

  const sidebarUser = {
    id: profile?.id || '0',
    name: profile?.nome || 'Usuário',
    username: profile?.email,
    email: profile?.email || '',
    role: 'Admin',
    permissions: { admin: true, financial: true, sales: true, stock: true, support: true, settings: true }
  };

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
              <input type="text" placeholder="Buscar..." className="bg-transparent border-none outline-none text-sm w-full text-gray-600" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">{company?.nome || 'Minha Empresa'}</p>
              <div className="flex items-center justify-end gap-1">
                 {loadingCustomers && <Loader2 size={12} className="animate-spin text-blue-500"/>}
                 <p className="text-xs text-green-600 font-medium">
                    {profile?.nome}
                    {isMockMode && <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded border border-yellow-200">LOCAL MODE</span>}
                 </p>
              </div>
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

const ProtectedRoute: React.FC = () => {
  const { session, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  return session ? <Outlet /> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes (App and Admin) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/plans" element={<Plans />} />
              <Route path="/payment/:planId" element={<Payment />} />
              <Route path="/expired" element={<Expired />} />
              <Route path="/app" element={<MainLayout />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;