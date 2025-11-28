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

  // Validar formulário (Check robusto)
  const isUserFormValid = Boolean(
      userForm.name?.trim() && 
      userForm.username?.trim() && 
      userForm.password?.trim()
  );

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
           <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-scale-in">
                   <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl flex justify-between items-center">
                       <h3 className="text-lg font-bold text-gray-800">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                       <button onClick={() => setIsUserModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                   </div>
                   
                   <div className="p-6 overflow-y-auto custom-scrollbar">
                       <div className="space-y-4">
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                               <input 
                                    type="text" 
                                    placeholder="Ex: João da Silva" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 outline-none focus:border-blue-500" 
                                    value={userForm.name || ''}
                                    onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                               />
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                               <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-1">Usuário de Acesso *</label>
                                   <input 
                                        type="text" 
                                        placeholder="Ex: joao.silva" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 outline-none focus:border-blue-500" 
                                        value={userForm.username || ''}
                                        onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                                   />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-1">Senha *</label>
                                   <input 
                                        type="text" 
                                        placeholder="••••••" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 outline-none focus:border-blue-500" 
                                        value={userForm.password || ''}
                                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                                   />
                               </div>
                           </div>
                           
                           <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Opcional)</label>
                                <input 
                                        type="email" 
                                        placeholder="email@empresa.com" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 outline-none focus:border-blue-500" 
                                        value={userForm.email || ''}
                                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                                />
                           </div>
                           
                           <div>
                               <label className="block text-sm font-bold text-gray-700 mb-2">Permissões de Acesso</label>
                               <div className="grid grid-cols-2 gap-3">
                                    <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                                        <input 
                                            type="checkbox" 
                                            checked={userForm.permissions?.financial || false} 
                                            onChange={(e) => setUserForm({...userForm, permissions: {...(userForm.permissions || {}), financial: e.target.checked} as any})}
                                        /> Financeiro
                                    </label>
                                    <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                                        <input 
                                            type="checkbox" 
                                            checked={userForm.permissions?.sales || false} 
                                            onChange={(e) => setUserForm({...userForm, permissions: {...(userForm.permissions || {}), sales: e.target.checked} as any})}
                                        /> Vendas
                                    </label>
                                    <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                                        <input 
                                            type="checkbox" 
                                            checked={userForm.permissions?.stock || false} 
                                            onChange={(e) => setUserForm({...userForm, permissions: {...(userForm.permissions || {}), stock: e.target.checked} as any})}
                                        /> Estoque
                                    </label>
                                    <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                                        <input 
                                            type="checkbox" 
                                            checked={userForm.permissions?.support || false} 
                                            onChange={(e) => setUserForm({...userForm, permissions: {...(userForm.permissions || {}), support: e.target.checked} as any})}
                                        /> Suporte
                                    </label>
                                    <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                                        <input 
                                            type="checkbox" 
                                            checked={userForm.permissions?.settings || false} 
                                            onChange={(e) => setUserForm({...userForm, permissions: {...(userForm.permissions || {}), settings: e.target.checked} as any})}
                                        /> Configurações
                                    </label>
                                    <label className="flex items-center gap-2 p-2 border rounded cursor-pointer bg-red-50 border-red-100 text-red-800">
                                        <input 
                                            type="checkbox" 
                                            checked={userForm.permissions?.admin || false} 
                                            onChange={(e) => setUserForm({...userForm, permissions: {...(userForm.permissions || {}), admin: e.target.checked} as any})}
                                        /> Administrador
                                    </label>
                               </div>
                           </div>
                       </div>
                   </div>

                   <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                       <button onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                       <button 
                            onClick={handleSaveUser}
                            disabled={!isUserFormValid}
                            className={`px-4 py-2 rounded-lg text-white transition-colors shadow-sm flex items-center gap-2 font-medium
                                ${isUserFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}
                            `}
                        >
                            <Save size={18} /> Salvar
                        </button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );

  const renderBackup = () => (
    <div className="space-y-6 animate-fade-in max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Data Management */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Database size={20} className="text-purple-600" /> Dados e Backup
                </h3>
                <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded text-blue-600"><Save size={18} /></div>
                            <span className="font-medium text-gray-700">Fazer Backup Manual</span>
                        </div>
                        <span className="text-xs text-gray-400 group-hover:text-blue-600">Iniciar</span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600">
                            <Download size={16} /> Exportar CSV
                        </button>
                        <button className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600">
                            <FileJson size={16} /> Exportar JSON
                        </button>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-500 mt-2">
                         <Upload size={16} /> Importar Dados
                    </button>

                    <button className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors text-sm font-bold text-red-600 mt-4">
                         <RefreshCw size={16} /> Resetar Configurações de Fábrica
                    </button>
                </div>
            </div>

            {/* Security */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Shield size={20} className="text-green-600" /> Segurança
                </h3>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                             <div className="bg-white p-2 rounded shadow-sm text-gray-600"><Smartphone size={18}/></div>
                             <div>
                                 <p className="font-medium text-sm text-gray-800">Verificação em Duas Etapas</p>
                                 <p className="text-xs text-gray-500">Proteção extra no login</p>
                             </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                    </div>

                    <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded text-orange-600"><Key size={18} /></div>
                            <span className="font-medium text-gray-700">Alterar Senha do Usuário</span>
                        </div>
                    </button>

                    <div className="mt-6">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Sessões Ativas</h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Globe size={14} /> Chrome - Windows (Atual)
                                </div>
                                <span className="text-xs text-green-600 font-medium">Online</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Smartphone size={14} /> App Mobile - iPhone 13
                                </div>
                                <span className="text-xs text-gray-400">Há 2h</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6 animate-fade-in max-w-3xl">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Link size={20} className="text-indigo-600" /> Integrações de Sistema
            </h3>

            <div className="space-y-6">
                
                {/* API Key */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chave de API (API Key)</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            readOnly 
                            value="sk_live_51M...x89s" 
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 font-mono text-sm"
                        />
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 text-sm font-medium">
                            Gerar Nova
                        </button>
                    </div>
                </div>

                {/* Webhooks */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Webhooks (URL de Eventos)</label>
                    <input 
                        type="url" 
                        placeholder="https://seu-sistema.com/api/webhook" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-1">Eventos: venda.criada, os.atualizada, cliente.novo</p>
                </div>

                <div className="border-t border-gray-100 my-4"></div>

                {/* External Services */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                             <div className="bg-green-100 p-2 rounded-lg text-green-600"><Smartphone size={24} /></div>
                             <div>
                                 <h4 className="font-bold text-gray-800">WhatsApp API</h4>
                                 <p className="text-xs text-gray-500">Envio automático de mensagens</p>
                             </div>
                        </div>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm font-medium hover:bg-gray-200">Configurar</button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                             <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Database size={24} /></div>
                             <div>
                                 <h4 className="font-bold text-gray-800">ERP Externo</h4>
                                 <p className="text-xs text-gray-500">Sincronização Fiscal/NFe</p>
                             </div>
                        </div>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm font-medium hover:bg-gray-200">Conectar</button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                             <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><Mail size={24} /></div>
                             <div>
                                 <h4 className="font-bold text-gray-800">SMTP Email</h4>
                                 <p className="text-xs text-gray-500">Servidor de disparo de emails</p>
                             </div>
                        </div>
                        <button className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded text-sm font-medium">Ativo</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Configurações</h2>
          <p className="text-gray-500">Gerencie preferências, usuários e sistema.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex overflow-x-auto">
        <button
            onClick={() => setActiveTab('COMPANY')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${activeTab === 'COMPANY' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
        >
            <Building size={18} /> Empresa
        </button>
        <button
            onClick={() => setActiveTab('USERS')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${activeTab === 'USERS' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
        >
            <Users size={18} /> Usuários
        </button>
        <button
            onClick={() => setActiveTab('BACKUP')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${activeTab === 'BACKUP' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
        >
            <Shield size={18} /> Backup & Segurança
        </button>
        <button
            onClick={() => setActiveTab('INTEGRATIONS')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${activeTab === 'INTEGRATIONS' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
        >
            <Link size={18} /> Integrações
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6 custom-scrollbar">
          {activeTab === 'COMPANY' && renderCompanySettings()}
          {activeTab === 'USERS' && renderUsers()}
          {activeTab === 'BACKUP' && renderBackup()}
          {activeTab === 'INTEGRATIONS' && renderIntegrations()}
      </div>
    </div>
  );
};