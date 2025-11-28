import React, { useState, useMemo } from 'react';
import { Search, Plus, User, Phone, Mail, MapPin, Smartphone, FileText, Edit, Trash2, X, Save, Users, CreditCard, Lock, Unlock, ShoppingBag, Wrench, Clock, ChevronRight } from 'lucide-react';
import { Customer } from '../types';

interface CustomersProps {
    customers: Customer[];
    onSave: (customer: Customer) => void;
    onDelete: (id: string) => void;
}

// Mock Data for History (In a real app, this would come from the API based on customer ID)
const MOCK_SALES_HISTORY = [
    { id: '1001', date: '10/05/2024', items: 'Cabo USB-C, Película 3D', total: 60.00, status: 'Pago' },
    { id: '1042', date: '15/06/2024', items: 'Capa Anti-Impacto', total: 45.00, status: 'Pago' },
    { id: '1105', date: '20/07/2024', items: 'Carregador Turbo', total: 85.00, status: 'Pago' },
];

const MOCK_SERVICE_HISTORY = [
    { id: '5002', date: '15/04/2024', device: 'iPhone 11', defect: 'Tela Quebrada', total: 350.00, status: 'Finalizado' },
    { id: '5230', date: '22/08/2024', device: 'iPhone 11', defect: 'Bateria Viciada', total: 180.00, status: 'Em Andamento' },
];

export const Customers: React.FC<CustomersProps> = ({ customers, onSave, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'SALES' | 'SERVICES'>('DETAILS');

  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '', cpfOrCnpj: '', rg: '',
    phone: '', email: '',
    zipCode: '', address: '', complement: '', neighborhood: '', city: '', state: 'SP',
    deviceHistory: '', notes: ''
  });

  // Filter Logic
  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.cpfOrCnpj.includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.deviceHistory && c.deviceHistory.toLowerCase().includes(q))
    );
  }, [customers, searchQuery]);

  // CRUD Actions
  const handleNewCustomer = () => {
    setEditingCustomer(null);
    setFormData({
      name: '', cpfOrCnpj: '', rg: '',
      phone: '', email: '',
      zipCode: '', address: '', complement: '', neighborhood: '', city: '', state: 'SP',
      deviceHistory: '', notes: ''
    });
    setActiveTab('DETAILS');
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({ ...customer });
    setActiveTab('DETAILS');
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      onDelete(id);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone) {
      alert('Nome e Celular são obrigatórios.');
      return;
    }

    const newCustomer: Customer = {
      ...(formData as Customer),
      id: editingCustomer ? editingCustomer.id : Math.floor(Math.random() * 1000).toString(),
      createdAt: editingCustomer ? editingCustomer.createdAt : new Date().toISOString().split('T')[0]
    };
    
    onSave(newCustomer);
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
          <p className="text-gray-500">Gerencie sua base de clientes e histórico.</p>
        </div>
        <button 
          onClick={handleNewCustomer}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 font-medium"
        >
          <Plus size={20} />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <Search className="ml-3 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Buscar por Nome, CPF, CNPJ, Email, Telefone ou IMEI do aparelho..." 
                className="w-full px-4 py-2 outline-none text-gray-600 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <div className="bg-blue-50 border border-blue-100 p-2 rounded-xl flex items-center justify-center gap-3 text-blue-700">
            <Users size={24} />
            <div className="text-left leading-tight">
                <span className="block font-bold text-lg">{customers.length}</span>
                <span className="text-xs">Total Clientes</span>
            </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="overflow-x-auto">
             <table className="w-full text-left">
                 <thead className="bg-gray-50 border-b border-gray-200">
                     <tr>
                         <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                         <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Contatos</th>
                         <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Documento / Local</th>
                         <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Ações</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {filteredCustomers.map(customer => (
                         <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold bg-blue-100 text-blue-600`}>
                                         {customer.name.charAt(0).toUpperCase()}
                                     </div>
                                     <div>
                                         <p className="font-medium text-gray-900">{customer.name}</p>
                                         <p className="text-xs text-gray-500">ID: {customer.id} • Desde: {customer.createdAt}</p>
                                     </div>
                                 </div>
                             </td>
                             <td className="px-6 py-4">
                                 <div className="space-y-1">
                                     <div className="flex items-center gap-2 text-sm text-gray-600">
                                         <Phone size={14} className="text-gray-400" /> {customer.phone}
                                     </div>
                                     {customer.email && (
                                         <div className="flex items-center gap-2 text-sm text-gray-600">
                                             <Mail size={14} className="text-gray-400" /> {customer.email}
                                         </div>
                                     )}
                                 </div>
                             </td>
                             <td className="px-6 py-4 text-sm text-gray-600">
                                 <div className="flex flex-col gap-1">
                                     <div className="flex items-center gap-2">
                                        <FileText size={14} className="text-gray-400" />
                                        {customer.cpfOrCnpj || '-'}
                                     </div>
                                     <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-gray-400" />
                                        {customer.city}/{customer.state}
                                     </div>
                                 </div>
                             </td>
                             <td className="px-6 py-4 text-right">
                                 <div className="flex justify-end gap-2">
                                     <button 
                                        onClick={() => handleEditCustomer(customer)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar"
                                     >
                                         <Edit size={18} />
                                     </button>
                                     <button 
                                        onClick={() => handleDeleteCustomer(customer.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Excluir"
                                     >
                                         <Trash2 size={18} />
                                     </button>
                                 </div>
                             </td>
                         </tr>
                     ))}
                     {filteredCustomers.length === 0 && (
                         <tr>
                             <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                 Nenhum cliente encontrado com os termos pesquisados.
                             </td>
                         </tr>
                     )}
                 </tbody>
             </table>
         </div>
      </div>

      {/* Modern Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-scale-in">
                  
                  {/* Modal Header */}
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <User size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingCustomer ? 'Detalhes do Cliente' : 'Novo Cliente'}
                            </h3>
                            {editingCustomer && <p className="text-xs text-gray-500">ID: {editingCustomer.id}</p>}
                        </div>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                  </div>

                  {/* Tabs Navigation */}
                  <div className="flex px-6 border-b border-gray-100 bg-white">
                      <button 
                        onClick={() => setActiveTab('DETAILS')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'DETAILS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                          <User size={16} /> Dados Cadastrais
                      </button>
                      <button 
                        onClick={() => setActiveTab('SALES')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'SALES' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                          <ShoppingBag size={16} /> Histórico de Compras
                      </button>
                      <button 
                        onClick={() => setActiveTab('SERVICES')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'SERVICES' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                          <Wrench size={16} /> Histórico de Serviços
                      </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/50">
                      
                      {/* TAB 1: DETAILS (FORM) */}
                      {activeTab === 'DETAILS' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                            
                            {/* Dados Pessoais */}
                            <div className="md:col-span-2">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Dados Pessoais</h4>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase bg-white text-gray-900" 
                                    placeholder="Nome do Cliente"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CPF / CNPJ</label>
                                <input 
                                    type="text" 
                                    name="cpfOrCnpj" 
                                    value={formData.cpfOrCnpj} 
                                    onChange={handleChange} 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900" 
                                    placeholder="000.000.000-00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
                                <input 
                                    type="text" 
                                    name="rg" 
                                    value={formData.rg} 
                                    onChange={handleChange} 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900" 
                                    placeholder="00.000.000-0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Celular / WhatsApp *</label>
                                <input 
                                    type="text" 
                                    name="phone" 
                                    value={formData.phone} 
                                    onChange={handleChange} 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900" 
                                    placeholder="(00) 90000-0000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none lowercase bg-white text-gray-900" 
                                    placeholder="cliente@email.com"
                                />
                            </div>

                            {/* Endereço */}
                            <div className="md:col-span-2 mt-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Endereço</h4>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                                <input 
                                    type="text" 
                                    name="zipCode" 
                                    value={formData.zipCode} 
                                    onChange={handleChange} 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900" 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                                <input 
                                    type="text" 
                                    name="city" 
                                    value={formData.city} 
                                    onChange={handleChange} 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase bg-white text-gray-900" 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estado (UF)</label>
                                <input 
                                    type="text" 
                                    name="state" 
                                    value={formData.state} 
                                    onChange={handleChange} 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase bg-white text-gray-900" 
                                    maxLength={2}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                                <input 
                                    type="text" 
                                    name="neighborhood" 
                                    value={formData.neighborhood} 
                                    onChange={handleChange} 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase bg-white text-gray-900" 
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço (Rua, Av, etc)</label>
                                <input 
                                    type="text" 
                                    name="address" 
                                    value={formData.address} 
                                    onChange={handleChange} 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase bg-white text-gray-900" 
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Complemento / Número</label>
                                <input 
                                    type="text" 
                                    name="complement" 
                                    value={formData.complement} 
                                    onChange={handleChange} 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase bg-white text-gray-900" 
                                />
                            </div>
                            
                            {/* Obs */}
                            <div className="md:col-span-2 mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Observações Gerais</label>
                                <textarea 
                                    name="notes" 
                                    value={formData.notes} 
                                    onChange={handleChange} 
                                    rows={3} 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white text-gray-900"
                                ></textarea>
                            </div>
                        </div>
                      )}

                      {/* TAB 2: SALES HISTORY */}
                      {activeTab === 'SALES' && (
                          <div className="animate-fade-in space-y-4">
                             <div className="flex justify-between items-center mb-2">
                                 <h4 className="text-sm font-bold text-gray-700">Compras Realizadas</h4>
                                 <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">Total: {MOCK_SALES_HISTORY.length}</div>
                             </div>
                             
                             <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3">Data</th>
                                            <th className="px-4 py-3">Itens</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 text-right">Valor</th>
                                            <th className="px-4 py-3 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {MOCK_SALES_HISTORY.map((sale) => (
                                            <tr key={sale.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-600 flex items-center gap-2">
                                                    <Clock size={14} className="text-gray-400"/> {sale.date}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800">{sale.items}</td>
                                                <td className="px-4 py-3">
                                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{sale.status}</span>
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold text-gray-800">R$ {sale.total.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-center text-gray-400">
                                                    <ChevronRight size={16} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                             
                             {MOCK_SALES_HISTORY.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-2" />
                                    <p>Nenhuma compra registrada para este cliente.</p>
                                </div>
                             )}
                          </div>
                      )}

                      {/* TAB 3: SERVICES HISTORY */}
                      {activeTab === 'SERVICES' && (
                          <div className="animate-fade-in space-y-4">
                             <div className="flex justify-between items-center mb-2">
                                 <h4 className="text-sm font-bold text-gray-700">Ordens de Serviço (OS)</h4>
                                 <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">Total: {MOCK_SERVICE_HISTORY.length}</div>
                             </div>
                             
                             <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3">OS / Data</th>
                                            <th className="px-4 py-3">Aparelho</th>
                                            <th className="px-4 py-3">Defeito</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 text-right">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {MOCK_SERVICE_HISTORY.map((service) => (
                                            <tr key={service.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div className="font-bold text-gray-800">#{service.id}</div>
                                                    <div className="text-xs text-gray-500">{service.date}</div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-700">{service.device}</td>
                                                <td className="px-4 py-3 text-gray-500 italic">{service.defect}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${service.status === 'Finalizado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {service.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold text-gray-800">R$ {service.total.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>

                             {MOCK_SERVICE_HISTORY.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Wrench size={48} className="mx-auto text-gray-300 mb-2" />
                                    <p>Nenhum serviço registrado para este cliente.</p>
                                </div>
                             )}
                          </div>
                      )}

                  </div>

                  {/* Footer Actions */}
                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                      <button 
                        onClick={() => setIsModalOpen(false)} 
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg border border-gray-300 bg-white transition-colors"
                      >
                          Fechar
                      </button>
                      {activeTab === 'DETAILS' && (
                        <button 
                            onClick={handleSave} 
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20 font-medium"
                        >
                            <Save size={18} />
                            Salvar Cliente
                        </button>
                      )}
                  </div>

              </div>
          </div>
      )}
    </div>
  );
};
