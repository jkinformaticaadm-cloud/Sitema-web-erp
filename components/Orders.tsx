import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Filter, X, Save, Smartphone, User, Wrench, FileText, Trash2, DollarSign, Edit, RefreshCw, CheckCircle, Wallet, CreditCard, Eye, Printer, Share2, FileCheck } from 'lucide-react';
import { Order, OrderStatus, CashierTransaction, OrderItem, Customer } from '../types';

interface OrdersProps {
  onAddTransaction: (t: CashierTransaction) => void;
  customers: Customer[];
}

const MOCK_SERVICES = [
  { id: 's1', name: 'Mão de Obra Geral', price: 80.00 },
  { id: 's2', name: 'Troca de Tela', price: 150.00 },
  { id: 's3', name: 'Troca de Bateria', price: 100.00 },
  { id: 's4', name: 'Desoxidação', price: 120.00 },
  { id: 's5', name: 'Atualização de Software', price: 90.00 },
];

const MOCK_PRODUCTS = [
  { id: 'p1', name: 'Tela iPhone 11 Original', price: 450.00 },
  { id: 'p2', name: 'Tela iPhone X OLED', price: 380.00 },
  { id: 'p3', name: 'Bateria Samsung A52', price: 120.00 },
  { id: 'p4', name: 'Conector de Carga Tipo-C', price: 45.00 },
  { id: 'p5', name: 'Película 3D', price: 30.00 },
];

const STATUS_OPTIONS: OrderStatus[] = [
  'Em Análise',
  'Aprovado',
  'Não Aprovado',
  'Aguardando Peça',
  'Em Andamento',
  'Aguardando Retirada',
  'Finalizado',
  'Entregue'
];

const INITIAL_ORDERS: Order[] = [
    { id: '1024', customerName: 'Maria Silva', customerPhone: '(11) 99999-9999', device: 'iPhone 11', status: 'Em Análise', date: '08/11/2024', total: 0, items: [] },
    { id: '1023', customerName: 'João Souza', device: 'Samsung A52', status: 'Aguardando Peça', date: '07/11/2024', total: 450, items: [{id: 'p1', name: 'Tela iPhone 11 Original', price: 450, type: 'PRODUCT'}] },
    { id: '1022', customerName: 'Pedro Santos', device: 'Xiaomi Note 10', status: 'Finalizado' as OrderStatus, date: '06/11/2024', total: 180, items: [] },
    { id: '1021', customerName: 'Ana Clara', device: 'Motorola G8', status: 'Entregue' as OrderStatus, date: '05/11/2024', total: 120, items: [] },
];

export const Orders: React.FC<OrdersProps> = ({ onAddTransaction, customers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos Status');

  // Customer Autocomplete State
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);

  // Print Mode State
  const [printMode, setPrintMode] = useState<'A4' | 'THERMAL'>('A4');

  // Orders State with LocalStorage Persistence
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('techfix_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('techfix_orders', JSON.stringify(orders));
  }, [orders]);

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    device: '',
    model: '',
    imei: '',
    defect: '',
  });

  const [addedItems, setAddedItems] = useState<OrderItem[]>([]);
  const [serviceInput, setServiceInput] = useState({ name: '', price: '' });
  const [productInput, setProductInput] = useState({ name: '', price: '' });

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = statusFilter === 'Todos Status' || order.status === statusFilter;
      
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        (order.customerPhone && order.customerPhone.toLowerCase().includes(query)) ||
        order.device.toLowerCase().includes(query) ||
        (order.imei && order.imei.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [orders, searchQuery, statusFilter]);

  const filteredCustomers = useMemo(() => {
    if (!customerSearchQuery) return [];
    const q = customerSearchQuery.toLowerCase();
    return customers.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q));
  }, [customers, customerSearchQuery]);

  // Reset or Populate form when Modal opens/closes or selection changes
  useEffect(() => {
    if (isModalOpen) {
      if (selectedOrder) {
        setFormData({
          customerName: selectedOrder.customerName,
          customerPhone: selectedOrder.customerPhone || '',
          address: selectedOrder.address || '',
          device: selectedOrder.device,
          model: selectedOrder.model || '',
          imei: selectedOrder.imei || '',
          defect: selectedOrder.defect || '',
        });
        setAddedItems(selectedOrder.items || []);
        setCustomerSearchQuery('');
      } else {
        // Reset for new order
        setFormData({
          customerName: '',
          customerPhone: '',
          address: '',
          device: '',
          model: '',
          imei: '',
          defect: '',
        });
        setAddedItems([]);
        setCustomerSearchQuery('');
      }
    }
  }, [isModalOpen, selectedOrder]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectCustomer = (customer: Customer) => {
    setFormData(prev => ({
      ...prev,
      customerName: customer.name,
      customerPhone: customer.phone,
      address: customer.address || prev.address
    }));
    setCustomerSearchQuery('');
    setShowCustomerSuggestions(false);
  };

  // Logic to handle selecting a preset service
  const handleServiceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = MOCK_SERVICES.find(s => s.id === e.target.value);
    if (selected) {
      setServiceInput({ name: selected.name, price: selected.price.toString() });
    } else {
      setServiceInput({ name: '', price: '' });
    }
  };

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = MOCK_PRODUCTS.find(p => p.id === e.target.value);
    if (selected) {
      setProductInput({ name: selected.name, price: selected.price.toString() });
    } else {
      setProductInput({ name: '', price: '' });
    }
  };

  const addItem = (type: 'SERVICE' | 'PRODUCT') => {
    const input = type === 'SERVICE' ? serviceInput : productInput;
    if (!input.name || !input.price) return;

    const newItem: OrderItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: input.name,
      price: parseFloat(input.price),
      type
    };

    setAddedItems([...addedItems, newItem]);
    if (type === 'SERVICE') {
        setServiceInput({ name: '', price: '' });
    } else {
        setProductInput({ name: '', price: '' });
    }
  };

  const removeItem = (id: string) => {
    setAddedItems(addedItems.filter(item => item.id !== id));
  };

  const totalValue = useMemo(() => {
    return addedItems.reduce((acc, item) => acc + item.price, 0);
  }, [addedItems]);

  const handleSaveOrder = () => {
    if (!formData.customerName || !formData.device) {
      alert("Por favor, preencha o nome do cliente e o aparelho.");
      return;
    }

    const orderToSave: Order = {
      id: selectedOrder ? selectedOrder.id : Math.floor(Math.random() * 100000).toString(),
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      address: formData.address,
      device: formData.device,
      model: formData.model,
      imei: formData.imei,
      defect: formData.defect,
      status: selectedOrder ? selectedOrder.status : 'Em Análise',
      date: selectedOrder ? selectedOrder.date : new Date().toLocaleDateString('pt-BR'),
      total: totalValue,
      items: addedItems
    };

    if (selectedOrder) {
      setOrders(orders.map(o => o.id === orderToSave.id ? orderToSave : o));
    } else {
      setOrders([orderToSave, ...orders]);
    }

    setIsModalOpen(false);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const openStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
  };

  const changeStatus = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;

    if (newStatus === 'Finalizado') {
      setIsStatusModalOpen(false);
      setIsPaymentModalOpen(true); // Trigger payment flow
      return;
    }

    const updatedOrders = orders.map(o => 
      o.id === selectedOrder.id ? { ...o, status: newStatus } : o
    );
    setOrders(updatedOrders);
    setIsStatusModalOpen(false);
    setSelectedOrder(null);
  };

  const finalizeOrder = (paymentMethod: string) => {
    if (!selectedOrder) return;

    const transaction: CashierTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'ENTRY',
      category: 'Serviço',
      amount: selectedOrder.total > 0 ? selectedOrder.total : 150, 
      description: `Faturamento OS #${selectedOrder.id} - ${selectedOrder.customerName}`,
      date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    
    onAddTransaction(transaction);

    const updatedOrders = orders.map(o => 
      o.id === selectedOrder.id ? { ...o, status: 'Finalizado' as OrderStatus } : o
    );
    setOrders(updatedOrders);

    setIsPaymentModalOpen(false);
    setSelectedOrder(null);
  };

  // Helper for Status Colors
  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'Em Análise':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Aprovado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Não Aprovado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Aguardando Peça':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Em Andamento':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Aguardando Retirada':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Finalizado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Entregue':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = (mode: 'A4' | 'THERMAL') => {
    setPrintMode(mode);
    // Use setTimeout to ensure the DOM updates with new classes/layout before printing
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleWhatsApp = () => {
    if (!selectedOrder) return;
    const text = `Olá ${selectedOrder.customerName}, sua Ordem de Serviço #${selectedOrder.id} referente ao aparelho ${selectedOrder.device} está com status: ${selectedOrder.status}. Total: R$ ${selectedOrder.total.toFixed(2)}.`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ordens de Serviço</h2>
          <p className="text-gray-500">Gerencie os reparos, orçamentos e garantias.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedOrder(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
        >
          <Plus size={18} />
          <span>Nova OS</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por cliente, OS, telefone ou aparelho..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>Todos Status</option>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nº OS</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aparelho</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">#{order.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.customerName}
                      <div className="text-xs text-gray-400 font-normal">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{order.device}</td>
                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {order.total > 0 ? `R$ ${order.total.toFixed(2)}` : 'A definir'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                         <button 
                          onClick={() => handleViewOrder(order)}
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Visualizar OS"
                         >
                          <Eye size={18} />
                        </button>
                         <button 
                          onClick={() => openStatusModal(order)}
                          className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Alterar Status"
                         >
                          <RefreshCw size={18} />
                        </button>
                        <button 
                          onClick={() => handleEditOrder(order)}
                          className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Editar OS"
                        >
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma ordem de serviço encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View/Print Modal */}
      {isViewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] animate-scale-in">
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl print:hidden">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FileCheck className="text-blue-600" />
                  Visualizar OS #{selectedOrder.id}
                </h3>
                <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
             </div>
             
             <div 
               className={`p-8 overflow-y-auto bg-white flex-1 ${printMode === 'THERMAL' ? 'print-thermal' : ''}`} 
               id="printable-area"
             >
                <div className="border-b-2 border-gray-800 pb-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">TechFix Assistência</h1>
                            <p className="text-gray-500 text-sm mt-1">Rua da Tecnologia, 123 - Centro</p>
                            <p className="text-gray-500 text-sm">CNPJ: 00.000.000/0001-00</p>
                            <p className="text-gray-500 text-sm">Tel: (11) 99999-9999</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold text-gray-800">Ordem de Serviço</h2>
                            <p className="text-2xl font-mono text-blue-600 mt-1">#{selectedOrder.id}</p>
                            <p className="text-sm text-gray-500 mt-1">Data: {selectedOrder.date}</p>
                            <p className={`text-sm font-bold mt-1 inline-block px-2 rounded ${getStatusStyle(selectedOrder.status)}`}>{selectedOrder.status}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">Cliente</h3>
                        <p className="text-gray-700"><span className="font-medium">Nome:</span> {selectedOrder.customerName}</p>
                        <p className="text-gray-700"><span className="font-medium">Telefone:</span> {selectedOrder.customerPhone || 'Não informado'}</p>
                        <p className="text-gray-700"><span className="font-medium">Endereço:</span> {selectedOrder.address || 'Não informado'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                         <h3 className="font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">Aparelho</h3>
                        <p className="text-gray-700"><span className="font-medium">Produto:</span> {selectedOrder.device}</p>
                        <p className="text-gray-700"><span className="font-medium">Modelo:</span> {selectedOrder.model || 'Não informado'}</p>
                        <p className="text-gray-700"><span className="font-medium">IMEI:</span> {selectedOrder.imei || 'Não informado'}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="font-bold text-gray-800 mb-2">Defeito Relatado / Observações</h3>
                    <div className="p-4 border border-gray-200 rounded-lg text-gray-700 bg-white italic min-h-[80px]">
                        {selectedOrder.defect || "Nenhuma observação registrada."}
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="font-bold text-gray-800 mb-2">Serviços e Peças</h3>
                    <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                            <tr>
                                <th className="px-4 py-2">Descrição</th>
                                <th className="px-4 py-2 text-right">Qtd</th>
                                <th className="px-4 py-2 text-right">Unitário</th>
                                <th className="px-4 py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {selectedOrder.items && selectedOrder.items.length > 0 ? (
                             selectedOrder.items.map(item => (
                               <tr key={item.id}>
                                  <td className="px-4 py-2">{item.name} <span className="text-xs text-gray-400">({item.type === 'SERVICE' ? 'Serviço' : 'Produto'})</span></td>
                                  <td className="px-4 py-2 text-right">1</td>
                                  <td className="px-4 py-2 text-right">R$ {item.price.toFixed(2)}</td>
                                  <td className="px-4 py-2 text-right">R$ {item.price.toFixed(2)}</td>
                               </tr>
                             ))
                           ) : (
                             <tr>
                               <td colSpan={4} className="px-4 py-4 text-center text-gray-500 italic">Nenhum item adicionado ainda.</td>
                             </tr>
                           )}
                        </tbody>
                        <tfoot className="bg-gray-50 font-bold text-gray-900">
                             <tr>
                                <td colSpan={3} className="px-4 py-3 text-right">TOTAL</td>
                                <td className="px-4 py-3 text-right text-lg">R$ {selectedOrder.total.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="mt-12 pt-6 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-500 mb-4">
                        Garantia de 90 dias para peças substituídas e mão de obra, não cobrindo danos causados por mau uso, líquidos ou quedas.
                        A não retirada do aparelho em até 90 dias implicará na venda do mesmo para custear despesas.
                    </p>
                    <div className="flex justify-between items-end mt-12 px-12">
                         <div className="text-center w-64 border-t border-gray-400 pt-2">
                             <p className="text-sm font-medium">Assinatura do Técnico</p>
                         </div>
                         <div className="text-center w-64 border-t border-gray-400 pt-2">
                             <p className="text-sm font-medium">Assinatura do Cliente</p>
                         </div>
                    </div>
                </div>
             </div>

             <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl flex justify-between items-center print:hidden">
                 <div className="flex gap-2">
                     <button onClick={handleWhatsApp} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm">
                         <Share2 size={18} />
                         <span>WhatsApp (PDF)</span>
                     </button>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => handlePrint('THERMAL')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Printer size={18} />
                        <span>Imprimir Térmica</span>
                    </button>
                    <button onClick={() => handlePrint('A4')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
                        <Printer size={18} />
                        <span>Imprimir A4</span>
                    </button>
                 </div>
             </div>
          </div>
        </div>
      )}

      {isStatusModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm animate-scale-in">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Atualizar Status</h3>
                <button onClick={() => setIsStatusModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
             </div>
             <p className="text-sm text-gray-500 mb-4">OS #{selectedOrder.id} - {selectedOrder.device}</p>
             <div className="space-y-2">
                {STATUS_OPTIONS.map(status => (
                  <button
                    key={status}
                    onClick={() => changeStatus(status)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex justify-between items-center border
                      ${selectedOrder.status === status 
                        ? `${getStatusStyle(status)} ring-1`
                        : `bg-white border-gray-100 hover:bg-gray-50 text-gray-700`}`}
                  >
                    {status}
                    {selectedOrder.status === status && <CheckCircle size={16}/>}
                  </button>
                ))}
             </div>
          </div>
        </div>
      )}

      {isPaymentModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Wallet className="text-green-600" />
                Faturar Ordem de Serviço
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                 <p className="text-gray-500 text-sm mb-1">Valor Total a Receber</p>
                 <p className="text-3xl font-bold text-gray-900">R$ {selectedOrder.total > 0 ? selectedOrder.total.toFixed(2) : '150.00'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => finalizeOrder('Dinheiro')} className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors">
                    <DollarSign size={24} className="mb-1"/>
                    <span className="text-sm">Dinheiro</span>
                  </button>
                  <button onClick={() => finalizeOrder('Pix')} className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors">
                    <Smartphone size={24} className="mb-1"/>
                    <span className="text-sm">Pix</span>
                  </button>
                  <button onClick={() => finalizeOrder('Cartão Crédito')} className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors">
                    <CreditCard size={24} className="mb-1"/>
                    <span className="text-sm">Crédito</span>
                  </button>
                  <button onClick={() => finalizeOrder('Cartão Débito')} className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors">
                    <CreditCard size={24} className="mb-1"/>
                    <span className="text-sm">Débito</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
               <button onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Main OS Modal (Create/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FileText className="text-blue-600" size={20} />
                {selectedOrder ? `Editar OS #${selectedOrder.id}` : 'Nova Ordem de Serviço'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                
                {/* Section: Dados do Cliente */}
                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide flex items-center gap-2">
                      <User size={16} /> Dados do Cliente
                    </h4>
                    {/* Customer Autocomplete Search */}
                    <div className="relative w-64">
                       <input 
                         type="text"
                         className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-blue-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none text-gray-900"
                         placeholder="Buscar cliente cadastrado..."
                         value={customerSearchQuery}
                         onChange={(e) => {
                           setCustomerSearchQuery(e.target.value);
                           setShowCustomerSuggestions(true);
                         }}
                         onFocus={() => setShowCustomerSuggestions(true)}
                       />
                       <Search size={14} className="absolute left-2.5 top-2 text-gray-400" />
                       {showCustomerSuggestions && customerSearchQuery && (
                         <div className="absolute top-full left-0 w-full bg-white shadow-xl border border-gray-200 rounded-lg mt-1 z-20 max-h-40 overflow-y-auto">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map(c => (
                                  <button
                                    key={c.id}
                                    onClick={() => handleSelectCustomer(c)}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 border-b border-gray-50 last:border-0"
                                  >
                                    <span className="font-bold text-gray-800 block">{c.name}</span>
                                    <span className="text-xs text-gray-500">{c.phone}</span>
                                  </button>
                                ))
                            ) : (
                              <div className="p-2 text-xs text-gray-500 text-center">Nenhum encontrado</div>
                            )}
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente</label>
                      <input 
                        type="text" 
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900" 
                        placeholder="Nome completo" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                      <input 
                        type="tel" 
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900" 
                        placeholder="(00) 00000-0000" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                      <input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900" 
                        placeholder="Rua, Número, Bairro" 
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Informações do Produto */}
                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Smartphone size={16} /> Informações do Produto
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                      <input 
                        type="text" 
                        name="device"
                        value={formData.device}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900" 
                        placeholder="Ex: iPhone 11" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                      <input 
                        type="text" 
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900" 
                        placeholder="Ex: A2111" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IMEI / Serial Number</label>
                      <input 
                        type="text" 
                        name="imei"
                        value={formData.imei}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900" 
                        placeholder="Opcional" 
                      />
                    </div>
                    <div className="col-span-1 md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Observação do defeito</label>
                      <textarea 
                        rows={3} 
                        name="defect"
                        value={formData.defect}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900" 
                        placeholder="Descreva o problema relatado pelo cliente..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Section: Serviços e Peças */}
                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm space-y-6">
                  <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Wrench size={16} /> Serviços e Peças
                  </h4>
                  
                  {/* Serviços */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Mão de Obra / Serviços</label>
                    <div className="flex flex-col md:flex-row gap-2">
                      <select 
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                        onChange={handleServiceSelect}
                        defaultValue=""
                      >
                        <option value="" disabled>Selecione um serviço salvo...</option>
                        {MOCK_SERVICES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        <option value="custom">Outro (Digitar)</option>
                      </select>
                      <input 
                        type="text" 
                        placeholder="Nome do Serviço"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                        value={serviceInput.name}
                        onChange={(e) => setServiceInput({...serviceInput, name: e.target.value})}
                      />
                      <input 
                        type="number" 
                        placeholder="Valor R$"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                        value={serviceInput.price}
                        onChange={(e) => setServiceInput({...serviceInput, price: e.target.value})}
                      />
                      <button 
                        type="button"
                        onClick={() => addItem('SERVICE')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Plus size={18} /> Add
                      </button>
                    </div>
                  </div>

                  {/* Produtos */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700">Peças e Produtos</label>
                    <div className="flex flex-col md:flex-row gap-2">
                      <select 
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                        onChange={handleProductSelect}
                        defaultValue=""
                      >
                        <option value="" disabled>Selecione um produto salvo...</option>
                        {MOCK_PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        <option value="custom">Outro (Digitar)</option>
                      </select>
                      <input 
                        type="text" 
                        placeholder="Nome do Produto"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                        value={productInput.name}
                        onChange={(e) => setProductInput({...productInput, name: e.target.value})}
                      />
                      <input 
                        type="number" 
                        placeholder="Valor R$"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                        value={productInput.price}
                        onChange={(e) => setProductInput({...productInput, price: e.target.value})}
                      />
                      <button 
                        type="button"
                        onClick={() => addItem('PRODUCT')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <Plus size={18} /> Add
                      </button>
                    </div>
                  </div>

                  {/* List of Added Items */}
                  {addedItems.length > 0 && (
                    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-2">Tipo</th>
                            <th className="px-4 py-2 w-full">Descrição</th>
                            <th className="px-4 py-2 text-right">Valor</th>
                            <th className="px-4 py-2 w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {addedItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-4 py-2">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${item.type === 'SERVICE' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                  {item.type === 'SERVICE' ? 'Serviço' : 'Produto'}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-gray-800">{item.name}</td>
                              <td className="px-4 py-2 text-right font-medium">R$ {item.price.toFixed(2)}</td>
                              <td className="px-4 py-2 text-center">
                                <button 
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-bold text-gray-800 border-t border-gray-200">
                           <tr>
                            <td colSpan={2} className="px-4 py-3 text-right">TOTAL GERAL:</td>
                            <td className="px-4 py-3 text-right text-lg text-blue-600">R$ {totalValue.toFixed(2)}</td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}

                  {/* Garantia */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Garantia</label>
                        <div className="flex gap-2">
                          <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900" placeholder="90" />
                          <select className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 outline-none">
                            <option>Dias</option>
                            <option>Meses</option>
                          </select>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Observação da Garantia</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900" placeholder="Ex: Garantia cobre apenas defeitos de peça" />
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between gap-3">
              <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">Total Previsto:</span>
                  <span className="text-xl font-bold text-gray-800">R$ {totalValue.toFixed(2)}</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg border border-gray-300 bg-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveOrder}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20 font-medium"
                >
                  <Save size={18} />
                  Salvar OS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};