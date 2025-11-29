import React, { useState } from 'react';
import { 
  Users, 
  Building, 
  TrendingUp, 
  ShieldAlert, 
  Search, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  LogOut, 
  CreditCard,
  Ban,
  Unlock,
  Filter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tenant } from '../types';

// Mock Data for Tenants
const MOCK_TENANTS: Tenant[] = [
    { id: '1', companyName: 'TecCell Centro', ownerName: 'João Silva', ownerEmail: 'joao@teccell.com', plan: 'anual', status: 'active', usersCount: 3, createdAt: '2023-10-10', lastLogin: '2024-03-20' },
    { id: '2', companyName: 'Rei do iPhone', ownerName: 'Pedro Souza', ownerEmail: 'pedro@reiiphone.com', plan: 'mensal', status: 'active', usersCount: 5, createdAt: '2024-01-15', lastLogin: '2024-03-21' },
    { id: '3', companyName: 'Assistência Express', ownerName: 'Maria Oliveira', ownerEmail: 'maria@express.com', plan: 'trial', status: 'expired', usersCount: 1, createdAt: '2024-02-28', lastLogin: '2024-03-05' },
    { id: '4', companyName: 'Cyber Fix', ownerName: 'Lucas Pereira', ownerEmail: 'lucas@cyberfix.com', plan: 'mensal', status: 'blocked', usersCount: 2, createdAt: '2023-11-05', lastLogin: '2024-02-20' },
    { id: '5', companyName: 'Global Tech', ownerName: 'Ana Costa', ownerEmail: 'ana@global.com', plan: 'anual', status: 'active', usersCount: 8, createdAt: '2023-08-12', lastLogin: '2024-03-21' },
];

export const AdminDashboard: React.FC = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Stats
    const totalRevenue = tenants.reduce((acc, t) => acc + (t.plan === 'anual' ? 29.90 : t.plan === 'mensal' ? 49.90 : 0), 0); // Mock MRR logic
    const activeTenants = tenants.filter(t => t.status === 'active').length;
    const totalUsers = tenants.reduce((acc, t) => acc + t.usersCount, 0);

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const toggleTenantStatus = (id: string) => {
        setTenants(tenants.map(t => {
            if (t.id === id) {
                return { ...t, status: t.status === 'blocked' ? 'active' : 'blocked' };
            }
            return t;
        }));
    };

    const filteredTenants = tenants.filter(t => {
        const matchesSearch = t.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              t.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || t.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'active': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Ativo</span>;
            case 'blocked': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Ban size={12}/> Bloqueado</span>;
            case 'expired': return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><ShieldAlert size={12}/> Expirado</span>;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Top Bar */}
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
                        <button onClick={handleLogout} className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 text-red-400 hover:text-red-300">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Empresas</p>
                                <h3 className="text-3xl font-bold text-gray-900">{tenants.length}</h3>
                            </div>
                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                <Building size={24} />
                            </div>
                        </div>
                        <div className="text-xs text-green-600 font-bold flex items-center gap-1">
                            <TrendingUp size={12} /> +2 esta semana
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Assinaturas Ativas</p>
                                <h3 className="text-3xl font-bold text-green-600">{activeTenants}</h3>
                            </div>
                            <div className="bg-green-50 p-2 rounded-lg text-green-600">
                                <CheckCircle size={24} />
                            </div>
                        </div>
                         <div className="text-xs text-gray-500">
                            Taxa de conversão: 85%
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Receita Estimada</p>
                                <h3 className="text-3xl font-bold text-blue-600">R$ {totalRevenue.toFixed(2)}</h3>
                            </div>
                            <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                                <CreditCard size={24} />
                            </div>
                        </div>
                         <div className="text-xs text-gray-500">
                            MRR (Receita Recorrente Mensal)
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Usuários</p>
                                <h3 className="text-3xl font-bold text-gray-800">{totalUsers}</h3>
                            </div>
                            <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                                <Users size={24} />
                            </div>
                        </div>
                         <div className="text-xs text-gray-500">
                            Média de {Math.round(totalUsers / tenants.length)} usuários por empresa
                        </div>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar empresa ou email..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter size={18} className="text-gray-400" />
                        <select 
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Todos os Status</option>
                            <option value="active">Ativos</option>
                            <option value="blocked">Bloqueados</option>
                            <option value="expired">Expirados</option>
                        </select>
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
                                    <th className="px-6 py-4">Usuários</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTenants.map((tenant) => (
                                    <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                    {tenant.companyName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{tenant.companyName}</p>
                                                    <p className="text-xs text-gray-400">ID: {tenant.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-900 font-medium">{tenant.ownerName}</p>
                                            <p className="text-gray-500 text-xs">{tenant.ownerEmail}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded border text-xs font-medium uppercase ${
                                                tenant.plan === 'trial' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                                'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}>
                                                {tenant.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Users size={14} /> {tenant.usersCount}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(tenant.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {tenant.status === 'blocked' ? (
                                                    <button 
                                                        onClick={() => toggleTenantStatus(tenant.id)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-gray-200 hover:border-green-200"
                                                        title="Desbloquear Acesso"
                                                    >
                                                        <Unlock size={16} />
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => toggleTenantStatus(tenant.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 hover:border-red-200"
                                                        title="Bloquear Acesso"
                                                    >
                                                        <Ban size={16} />
                                                    </button>
                                                )}
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredTenants.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                Nenhuma empresa encontrada.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};