import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building, 
  TrendingUp, 
  ShieldAlert, 
  Search, 
  CheckCircle, 
  LogOut, 
  CreditCard,
  Ban,
  Unlock,
  Filter,
  Trash2,
  RefreshCw,
  Eye,
  DollarSign,
  X,
  Calendar,
  Mail,
  Smartphone,
  Database,
  Activity,
  Server,
  Download,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import { Tenant } from '../types';

// Mock Data for Tenants (Initial State)
const MOCK_TENANTS: Tenant[] = [
    { id: '1', companyName: 'TecCell Centro', ownerName: 'João Silva', ownerEmail: 'joao@teccell.com', plan: 'anual', status: 'active', usersCount: 3, createdAt: '2023-10-10', lastLogin: '2024-03-20' },
    { id: '2', companyName: 'Rei do iPhone', ownerName: 'Pedro Souza', ownerEmail: 'pedro@reiiphone.com', plan: 'mensal', status: 'active', usersCount: 5, createdAt: '2024-01-15', lastLogin: '2024-03-21' },
    { id: '3', companyName: 'Assistência Express', ownerName: 'Maria Oliveira', ownerEmail: 'maria@express.com', plan: 'trial', status: 'expired', usersCount: 1, createdAt: '2024-02-28', lastLogin: '2024-03-05' },
    { id: '4', companyName: 'Cyber Fix', ownerName: 'Lucas Pereira', ownerEmail: 'lucas@cyberfix.com', plan: 'mensal', status: 'blocked', usersCount: 2, createdAt: '2023-11-05', lastLogin: '2024-02-20' },
    { id: '5', companyName: 'Global Tech', ownerName: 'Ana Costa', ownerEmail: 'ana@global.com', plan: 'anual', status: 'active', usersCount: 8, createdAt: '2023-08-12', lastLogin: '2024-03-21' },
];

// Helper to generate stable mock stats based on ID
const getTenantStats = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = ((hash << 5) - hash) + id.charCodeAt(i);
        hash |= 0;
    }
    const seed = Math.abs(hash);
    
    return {
        customers: (seed % 200) + 45,
        sales: (seed % 1000) + 120,
        products: (seed % 500) + 80,
        revenue: ((seed % 50000) / 100) * 100 + 2500,
        storage: (seed % 20) + 2, // GB
        lastBackup: new Date(Date.now() - (seed % 86400000)).toLocaleString()
    };
};

export const AdminDashboard: React.FC = () => {
    const { signOut } = useAuth();
    const history = useHistory();
    
    const [tenants, setTenants] = useState<Tenant[]>(() => {
        try {
            const saved = localStorage.getItem('assistech_admin_tenants');
            return saved ? JSON.parse(saved) : MOCK_TENANTS;
        } catch (e) {
            return MOCK_TENANTS;
        }
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    
    // Modal State
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [modalTab, setModalTab] = useState<'OVERVIEW' | 'USAGE' | 'LOGS'>('OVERVIEW');

    useEffect(() => {
        localStorage.setItem('assistech_admin_tenants', JSON.stringify(tenants));
    }, [tenants]);

    // Stats Logic
    const totalRevenue = tenants.reduce((acc, t) => {
        if(t.status !== 'active') return acc;
        if(t.plan === 'anual') return acc + 29.90; // MRR aproximado
        if(t.plan === 'mensal') return acc + 49.90;
        return acc;
    }, 0); 
    
    const activeTenants = tenants.filter(t => t.status === 'active').length;
    const totalUsers = tenants.reduce((acc, t) => acc + t.usersCount, 0);

    const handleLogout = async () => {
        await signOut();
        history.push('/');
    };

    const handleResetData = () => {
        if(confirm("Deseja restaurar os dados originais de exemplo?")) {
            setTenants(MOCK_TENANTS);
        }
    };

    const toggleTenantStatus = (id: string) => {
        setTenants(tenants.map(t => {
            if (t.id === id) {
                const newStatus = t.status === 'blocked' ? 'active' : 'blocked';
                return { ...t, status: newStatus };
            }
            return t;
        }));
    };

    const handleDeleteTenant = (id: string) => {
        if(confirm("ATENÇÃO: Tem certeza que deseja excluir esta empresa e todos os seus dados? Esta ação é irreversível.")) {
            setTenants(prev => prev.filter(t => t.id !== id));
            setIsViewModalOpen(false);
        }
    };

    const handleCyclePlan = (id: string) => {
        setTenants(tenants.map(t => {
            if (t.id === id) {
                const plans: Tenant['plan'][] = ['trial', 'mensal', 'anual'];
                const currentIndex = plans.indexOf(t.plan);
                const nextIndex = (currentIndex + 1) % plans.length;
                return { ...t, plan: plans[nextIndex] };
            }
            return t;
        }));
    };

    const handleViewTenant = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setModalTab('OVERVIEW');
        setIsViewModalOpen(true);
    };

    const filteredTenants = tenants.filter(t => {
        const matchesSearch = t.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              t.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || t.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'active': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={12}/> Ativo</span>;
            case 'blocked': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Ban size={12}/> Bloqueado</span>;
            case 'expired': return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><ShieldAlert size={12}/> Expirado</span>;
            default: return null;
        }
    };

    // Render logic for the modal stats
    const tenantStats = selectedTenant ? getTenantStats(selectedTenant.id) : null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <header className="bg-[#0f172a] text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <ShieldAlert size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">Painel Super Admin</h1>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Gestão Multi-Tenant</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold">Administrador</p>
                            <p className="text-xs text-gray-400">admin@assistech.com</p>
                        </div>
                        <button onClick={handleLogout} className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 text-red-400 hover:text-red-300" title="Sair">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 h-full w-1 bg-blue-500"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Empresas</p>
                                <h3 className="text-3xl font-bold text-gray-900">{tenants.length}</h3>
                            </div>
                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                                <Building size={24} />
                            </div>
                        </div>
                        <div className="text-xs text-green-600 font-bold flex items-center gap-1">
                            <TrendingUp size={12} /> Base crescendo
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
                         <div className="absolute right-0 top-0 h-full w-1 bg-green-500"></div>
                         <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Assinaturas Ativas</p>
                                <h3 className="text-3xl font-bold text-green-600">{activeTenants}</h3>
                            </div>
                            <div className="bg-green-50 p-2 rounded-lg text-green-600 group-hover:scale-110 transition-transform">
                                <CheckCircle size={24} />
                            </div>
                        </div>
                         <div className="text-xs text-gray-500">
                            Taxa de conversão: {tenants.length > 0 ? Math.round((activeTenants / tenants.length) * 100) : 0}%
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
                         <div className="absolute right-0 top-0 h-full w-1 bg-purple-500"></div>
                         <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Receita Estimada</p>
                                <h3 className="text-3xl font-bold text-blue-600">R$ {totalRevenue.toFixed(2)}</h3>
                            </div>
                            <div className="bg-purple-50 p-2 rounded-lg text-purple-600 group-hover:scale-110 transition-transform">
                                <CreditCard size={24} />
                            </div>
                        </div>
                         <div className="text-xs text-gray-500">
                            MRR (Receita Recorrente Mensal)
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
                         <div className="absolute right-0 top-0 h-full w-1 bg-orange-500"></div>
                         <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Usuários</p>
                                <h3 className="text-3xl font-bold text-gray-800">{totalUsers}</h3>
                            </div>
                            <div className="bg-orange-50 p-2 rounded-lg text-orange-600 group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                        </div>
                         <div className="text-xs text-gray-500">
                            Média de {tenants.length > 0 ? Math.round(totalUsers / tenants.length) : 0} usuários/empresa
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar empresa ou email..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter size={18} className="text-gray-400" />
                        <select 
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto cursor-pointer"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Todos os Status</option>
                            <option value="active">Ativos</option>
                            <option value="blocked">Bloqueados</option>
                            <option value="expired">Expirados</option>
                        </select>
                        <button 
                            onClick={handleResetData}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-gray-200 transition-colors ml-2"
                            title="Restaurar Dados Originais"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                {/* Tenants Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Empresa</th>
                                    <th className="px-6 py-4">Proprietário / Email</th>
                                    <th className="px-6 py-4">Plano</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Usuários</th>
                                    <th className="px-6 py-4 text-right">Ações Rápidas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTenants.map((tenant) => (
                                    <tr key={tenant.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-bold text-lg shadow-sm border border-white">
                                                    {tenant.companyName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{tenant.companyName}</p>
                                                    <p className="text-xs text-gray-400 font-mono">ID: {tenant.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-900 font-medium">{tenant.ownerName}</p>
                                            <p className="text-gray-500 text-xs flex items-center gap-1">
                                                {tenant.ownerEmail}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => handleCyclePlan(tenant.id)}
                                                className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-xs font-bold uppercase transition-all hover:shadow-md ${
                                                tenant.plan === 'trial' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100' : 
                                                tenant.plan === 'anual' ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' :
                                                'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                            }`} title="Clique para alterar o plano">
                                                {tenant.plan === 'anual' && <DollarSign size={12} />}
                                                {tenant.plan}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(tenant.status)}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600">
                                            <div className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                                                <Users size={14} /> {tenant.usersCount}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-100 sm:opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleViewTenant(tenant)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                                                    title="Ver Detalhes e Estatísticas"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {tenant.status === 'blocked' ? (
                                                    <button 
                                                        onClick={() => toggleTenantStatus(tenant.id)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-200"
                                                        title="Desbloquear"
                                                    >
                                                        <Unlock size={18} />
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => toggleTenantStatus(tenant.id)}
                                                        className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-200"
                                                        title="Bloquear"
                                                    >
                                                        <Ban size={18} />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleDeleteTenant(tenant.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* View Details Modal */}
            {isViewModalOpen && selectedTenant && tenantStats && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-0 md:p-4">
                    <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-3xl flex flex-col md:rounded-xl shadow-2xl animate-scale-in">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 md:rounded-t-xl flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl shadow-sm border border-blue-200">
                                    {selectedTenant.companyName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{selectedTenant.companyName}</h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>ID: {selectedTenant.id}</span>
                                        <span>•</span>
                                        <span>Criado em: {selectedTenant.createdAt}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 bg-white">
                            <button 
                                onClick={() => setModalTab('OVERVIEW')}
                                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${modalTab === 'OVERVIEW' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                Visão Geral
                            </button>
                            <button 
                                onClick={() => setModalTab('USAGE')}
                                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${modalTab === 'USAGE' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                Uso & Sistema
                            </button>
                            <button 
                                onClick={() => setModalTab('LOGS')}
                                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${modalTab === 'LOGS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                Logs e Segurança
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/50">
                            
                            {modalTab === 'OVERVIEW' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                            <Building size={16} className="text-blue-500"/> Status da Conta
                                        </h4>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-semibold">Situação Atual</p>
                                                <div className="mt-1">{getStatusBadge(selectedTenant.status)}</div>
                                            </div>
                                            <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold">Plano Contratado</p>
                                                    <p className="font-bold text-gray-800 uppercase flex items-center gap-1">
                                                        {selectedTenant.plan}
                                                    </p>
                                                </div>
                                                {selectedTenant.plan === 'anual' && <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">PRO</div>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                            <Users size={16} className="text-purple-500"/> Contato Principal
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><Users size={14}/></div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Responsável</p>
                                                    <p className="font-medium text-gray-800 text-sm">{selectedTenant.ownerName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><Mail size={14}/></div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Email de Acesso</p>
                                                    <p className="font-medium text-gray-800 text-sm">{selectedTenant.ownerEmail}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Danger Zone */}
                                    <div className="md:col-span-2 bg-red-50 p-5 rounded-xl border border-red-100">
                                        <h4 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                                            <ShieldAlert size={16}/> Zona de Perigo
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            <button 
                                                onClick={() => toggleTenantStatus(selectedTenant.id)}
                                                className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors shadow-sm"
                                            >
                                                {selectedTenant.status === 'blocked' ? 'Desbloquear Empresa' : 'Bloquear Acesso da Empresa'}
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteTenant(selectedTenant.id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
                                            >
                                                Excluir Empresa Definitivamente
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'USAGE' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Clientes</p>
                                            <p className="text-2xl font-bold text-blue-600">{tenantStats.customers}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Vendas Totais</p>
                                            <p className="text-2xl font-bold text-green-600">{tenantStats.sales}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Produtos</p>
                                            <p className="text-2xl font-bold text-purple-600">{tenantStats.products}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Usuários</p>
                                            <p className="text-2xl font-bold text-orange-600">{selectedTenant.usersCount}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <Database size={16} /> Uso de Armazenamento
                                        </h4>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600">Espaço em Disco</span>
                                                    <span className="font-bold text-gray-800">{tenantStats.storage} GB / 50 GB</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(tenantStats.storage / 50) * 100}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                                <div className="text-xs text-gray-500">
                                                    Último Backup: <span className="font-medium text-gray-700">{tenantStats.lastBackup}</span>
                                                </div>
                                                <button className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1">
                                                    <Download size={14} /> Baixar Dump
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'LOGS' && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-50 text-gray-500 uppercase">
                                            <tr>
                                                <th className="px-4 py-3">Evento</th>
                                                <th className="px-4 py-3">Data/Hora</th>
                                                <th className="px-4 py-3 text-right">IP</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                                                    <Activity size={14} className="text-green-500"/> Login Sucesso
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">{selectedTenant.lastLogin}</td>
                                                <td className="px-4 py-3 text-right font-mono text-gray-400">192.168.1.10</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                                                    <Server size={14} className="text-blue-500"/> Backup Automático
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">{tenantStats.lastBackup}</td>
                                                <td className="px-4 py-3 text-right font-mono text-gray-400">System</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                                                    <FileText size={14} className="text-orange-500"/> Atualização de Plano
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">2024-02-15 10:30</td>
                                                <td className="px-4 py-3 text-right font-mono text-gray-400">192.168.1.10</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 md:rounded-b-xl flex justify-end">
                            <button 
                                onClick={() => setIsViewModalOpen(false)}
                                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors shadow-sm"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};