import React, { useState } from 'react';
import { User as UserIcon, Shield, Mail, CheckCircle, XCircle, Search, Eye, X, Briefcase } from 'lucide-react';
import { User } from '../types';

interface TeamProps {
  users: User[];
}

export const Team: React.FC<TeamProps> = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const PermissionItem = ({ label, active }: { label: string; active: boolean }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${active ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
      <span className={`text-sm font-medium ${active ? 'text-green-800' : 'text-gray-500'}`}>{label}</span>
      {active ? <CheckCircle size={18} className="text-green-600" /> : <XCircle size={18} className="text-gray-300" />}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Equipe</h2>
          <p className="text-gray-500">Histórico de colaboradores e níveis de acesso.</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Buscar colaborador..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 w-full md:w-64"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white ${user.role === 'Administrador' ? 'bg-purple-600' : 'bg-blue-500'}`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{user.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === 'Administrador' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  {user.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase size={16} className="text-gray-400" />
                  {user.role === 'Administrador' ? 'Acesso Total' : 'Acesso Restrito'}
                </div>
              </div>

              <button 
                onClick={() => setSelectedUser(user)}
                className="w-full py-2 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 border border-gray-200"
              >
                <Eye size={18} /> Visualizar Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-lg flex flex-col md:rounded-xl shadow-2xl animate-scale-in">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 md:rounded-t-xl flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <UserIcon className="text-blue-600" size={20} />
                Detalhes do Colaborador
              </h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
              <div className="text-center mb-6">
                 <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-3 ${selectedUser.role === 'Administrador' ? 'bg-purple-600' : 'bg-blue-500'}`}>
                    {selectedUser.name.charAt(0).toUpperCase()}
                 </div>
                 <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                 <p className="text-gray-500">{selectedUser.email}</p>
                 <div className="mt-2 inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                    ID: {selectedUser.id}
                 </div>
              </div>

              <div className="mb-2">
                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3 uppercase tracking-wide">
                    <Shield size={16} /> Permissões de Acesso
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <PermissionItem label="Financeiro" active={selectedUser.permissions.financial} />
                    <PermissionItem label="Vendas" active={selectedUser.permissions.sales} />
                    <PermissionItem label="Estoque" active={selectedUser.permissions.stock} />
                    <PermissionItem label="Suporte" active={selectedUser.permissions.support} />
                    <PermissionItem label="Configurações" active={selectedUser.permissions.settings} />
                    <PermissionItem label="Administrador" active={selectedUser.permissions.admin} />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 md:rounded-b-xl flex justify-end flex-shrink-0">
              <button 
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
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