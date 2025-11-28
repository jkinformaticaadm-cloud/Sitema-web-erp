import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  Shield, 
  Link, 
  Save, 
  Upload, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Download, 
  FileJson, 
  FileSpreadsheet, 
  Key, 
  Smartphone, 
  Mail, 
  Check, 
  Globe,
  Database,
  Lock,
  User as UserIcon,
  X
} from 'lucide-react';
import { User } from '../types';

type SettingsTab = 'COMPANY' | 'USERS' | 'BACKUP' | 'INTEGRATIONS';

interface SettingsProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const Settings: React.FC<SettingsProps> = ({ users, setUsers }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('COMPANY');
  
  // State for Company Settings
  const [companyForm, setCompanyForm] = useState({
    name: 'TechFix Assistência',
    legalName: 'TechFix Soluções LTDA',
    cnpj: '00.000.000/0001-00',
    ie: '',
    address: 'Rua da Tecnologia, 123 - Centro, São Paulo - SP',
    phone1: '(11) 99999-9999',
    phone2: '(11) 3333-3333',
    email: 'contato@techfix.com.br',
    logo: ''
  });

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // New User Form State
  const [userForm, setUserForm] = useState<Partial<User>>({
      name: '',
      username: '',
      password: '',
      email: '',
      role: 'Técnico',
      permissions: {
          financial: false,
          sales: true,
          stock: true,
          support: true,
          settings: false,
          admin: false
      }
  });

  const handleOpenUserModal = (user?: User) => {
      if (user) {
          setEditingUser(user);
          setUserForm({ ...user });
      } else {
          setEditingUser(null);
          setUserForm({
            name: '',
            username: '',
            password: '',
            email: '',
            role: 'Técnico',
            permissions: {
                financial: false,
                sales: true,
                stock: true,
                support: true,
                settings: false,
                admin: false
            }
          });
      }
      setIsUserModalOpen(true);
  };

  const handleSaveUser = () => {
      // Validação final antes de salvar
      if (!userForm.name?.trim() || !userForm.username?.trim() || !userForm.password?.trim()) {
          return;
      }

      const defaultPermissions = {
        financial: false,
        sales: false,
        stock: false,
        support: false,
        settings: false,
        admin: false
      };

      const newUser: User = {
          id: editingUser ? editingUser.id : Date.now().toString(),
          name: userForm.name.trim(),
          username: userForm.username.trim(),
          password: userForm.password.trim(),
          email: userForm.email || '',
          role: userForm.permissions?.admin ? 'Administrador' : 'Técnico',
          permissions: userForm.permissions || defaultPermissions
      };

      if (editingUser) {
          setUsers(users.map(u => u.id === editingUser.id ? newUser : u));
      } else {
          setUsers([...users, newUser]);
      }
      setIsUserModalOpen(false);
  };

  const handleDeleteUser = (id: string) => {
      if(window.confirm("Deseja excluir este usuário?")) {
          setUsers(users.filter(u => u.id !== id));
      }
  };

  // Helper for rendering tabs
  const renderCompanySettings = () => (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
           <Building className="text-blue-600" size={20} /> Informações Gerais
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="md:col-span-2 flex items-center gap-6">
              <div className="h-24 w-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors relative overflow-hidden group">
                  {companyForm.logo ? (
                      <img src={companyForm.logo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                      <>
                        <Upload size={24} className="mb-1" />
                        <span className="text-xs">Logo</span>
                      </>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <div>
                  <h4 className="font-medium text-gray-700">Logotipo da Empresa</h4>
                  <p className="text-sm text-gray-500">Recomendado: PNG ou JPG, fundo transparente.</p>
              </div>
           </div>

           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia</label>
              <input 
                type="text" 
                value={companyForm.name}
                onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
              />
           </div>
           
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
              <input 
                type="text" 
                value={companyForm.legalName}
                onChange={(e) => setCompanyForm({...companyForm, legalName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
              />
           </div>

           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
              <input 
                type="text" 
                value={companyForm.cnpj}
                onChange={(e) => setCompanyForm({...companyForm, cnpj: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
              />
           </div>

           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inscrição Estadual 
                  <span className="text-xs font-normal text-gray-400 ml-2">(Opcional - Não aparece na OS)</span>
              </label>
              <input 
                type="text" 
                value={companyForm.ie}
                onChange={(e) => setCompanyForm({...companyForm, ie: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                placeholder="Isento ou Número"
              />
           </div>

           <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
              <input 
                type="text" 
                value={companyForm.address}
                onChange={(e) => setCompanyForm({...companyForm, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
              />
           </div>

           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Principal / WhatsApp</label>
              <input 
                type="text" 
                value={companyForm.phone1}
                onChange={(e) => setCompanyForm({...companyForm, phone1: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
              />
           </div>

           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Secundário</label>
              <input 
                type="text" 
                value={companyForm.phone2}
                onChange={(e) => setCompanyForm({...companyForm, phone2: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
              />
           </div>
           
           <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail de Contato</label>
              <input 
                type="email" 
                value={companyForm.email}
                onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
              />
           </div>
        </div>
        
        <div className="mt-8 flex justify-end">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20">
                <Save size={18} /> Salvar Alterações
            </button>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 animate-fade-in max-w-5xl">
       <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Gerenciamento de Usuários</h3>
            <button 
                onClick={() => handleOpenUserModal()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
                <Plus size={18} /> Novo Usuário
            </button>
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                    <tr>
                        <th className="px-6 py-3">Nome</th>
                        <th className="px-6 py-3">Usuário</th>
                        <th className="px-6 py-3">Cargo</th>
                        <th className="px-6 py-3">Permissões</th>
                        <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 text-gray-600">
                              <div className="flex items-center gap-1">
                                <UserIcon size={14} className="text-gray-400"/>
                                {user.username}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'Administrador' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">
                                {[
                                    user.permissions.admin ? 'ADMIN TOTAL' : '',
                                    user.permissions.financial ? 'Financ.' : '',
                                    user.permissions.sales ? 'Vendas' : '',
                                    user.permissions.stock ? 'Estoque' : ''
                                ].filter(Boolean).join(', ')}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => handleOpenUserModal(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
       </div>

       {/* User Modal */}
       {isUserModalOpen && (
           <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-0 md:p-4">
               <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-lg flex flex-col md:rounded-xl shadow-2xl animate-scale-in">
                   <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 md:rounded-t-xl flex justify-between items-center flex-shrink-0">
                       <h3 className="text-lg font-bold text-gray-800">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                       <button onClick={() => setIsUserModalOpen(false)}><X size={20} className="text-gray-400" /></button>
                   </div>
                   <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                <input type="text" className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900" 
                                    value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} placeholder="Ex: João Silva" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Usuário (Login)</label>
                                    <input type="text" className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900" 
                                        value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} placeholder="joao.silva" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                                    <input type="password" className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900" 
                                        value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} placeholder="******" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Opcional)</label>
                                <input type="email" className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900" 
                                    value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} />
                            </div>
                            
                            <div className="pt-4 border-t border-gray-100">
                                <label className="block text-sm font-bold text-gray-800 mb-3">Permissões de Acesso</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input type="checkbox" checked={userForm.permissions?.admin} 
                                            onChange={e => setUserForm({...userForm, permissions: {...userForm.permissions!, admin: e.target.checked}})} 
                                            className="rounded text-blue-600 focus:ring-blue-500" />
                                        <span className="text-sm">Administrador Total</span>
                                    </label>
                                    <label className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input type="checkbox" checked={userForm.permissions?.financial} 
                                            onChange={e => setUserForm({...userForm, permissions: {...userForm.permissions!, financial: e.target.checked}})} 
                                            className="rounded text-blue-600 focus:ring-blue-500" />
                                        <span className="text-sm">Financeiro</span>
                                    </label>
                                    <label className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input type="checkbox" checked={userForm.permissions?.sales} 
                                            onChange={e => setUserForm({...userForm, permissions: {...userForm.permissions!, sales: e.target.checked}})} 
                                            className="rounded text-blue-600 focus:ring-blue-500" />
                                        <span className="text-sm">Vendas</span>
                                    </label>
                                    <label className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input type="checkbox" checked={userForm.permissions?.stock} 
                                            onChange={e => setUserForm({...userForm, permissions: {...userForm.permissions!, stock: e.target.checked}})} 
                                            className="rounded text-blue-600 focus:ring-blue-500" />
                                        <span className="text-sm">Estoque</span>
                                    </label>
                                    <label className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input type="checkbox" checked={userForm.permissions?.support} 
                                            onChange={e => setUserForm({...userForm, permissions: {...userForm.permissions!, support: e.target.checked}})} 
                                            className="rounded text-blue-600 focus:ring-blue-500" />
                                        <span className="text-sm">OS / Suporte</span>
                                    </label>
                                    <label className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input type="checkbox" checked={userForm.permissions?.settings} 
                                            onChange={e => setUserForm({...userForm, permissions: {...userForm.permissions!, settings: e.target.checked}})} 
                                            className="rounded text-blue-600 focus:ring-blue-500" />
                                        <span className="text-sm">Configurações</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                   </div>
                   <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 md:rounded-b-xl flex-shrink-0">
                       <button onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancelar</button>
                       <button onClick={handleSaveUser} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Salvar Usuário</button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
            <h2 className="text-2xl font-bold text-gray-800">Configurações</h2>
            <p className="text-gray-500">Ajustes do sistema, usuários e dados da empresa.</p>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex overflow-x-auto">
            <button onClick={() => setActiveTab('COMPANY')} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'COMPANY' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
                <Building size={18} /> Dados da Empresa
            </button>
            <button onClick={() => setActiveTab('USERS')} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'USERS' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
                <Users size={18} /> Usuários e Permissões
            </button>
            <button onClick={() => setActiveTab('BACKUP')} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'BACKUP' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
                <Database size={18} /> Backup e Dados
            </button>
        </div>

        <div className="flex-1">
            {activeTab === 'COMPANY' && renderCompanySettings()}
            {activeTab === 'USERS' && renderUsers()}
            {activeTab === 'BACKUP' && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                    <Database size={48} className="mx-auto text-blue-200 mb-4" />
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Backup de Dados</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">Faça o download de todos os seus dados (Clientes, Vendas, Estoque) em formato JSON ou Planilha para segurança.</p>
                    <div className="flex justify-center gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                            <FileJson size={20} /> Exportar JSON
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-lg shadow-green-900/20">
                            <FileSpreadsheet size={20} /> Exportar Excel
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};