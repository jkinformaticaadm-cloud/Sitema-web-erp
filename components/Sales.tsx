import React, { useState, useMemo } from 'react';
import { ShoppingCart, Zap, FileText, User, Search, Plus, Trash2, ArrowLeft, CreditCard, X, Check, Package, Smartphone } from 'lucide-react';
import { Product } from '../types';

// --- MOCK DATA ---

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Película 3D iPhone 11', category: 'Peliculas', price: 30.00, cost: 5.00, stock: 50, minStock: 10, image: '', type: 'PRODUCT' },
  { id: '2', name: 'Cabo Lightning Foxconn', category: 'Cabos', price: 60.00, cost: 20.00, stock: 20, minStock: 5, image: '', type: 'PRODUCT' },
  { id: '3', name: 'Carregador Samsung 25W', category: 'Carregadores', price: 120.00, cost: 70.00, stock: 15, minStock: 3, image: '', type: 'PRODUCT' },
  { id: '4', name: 'Capa Anti-Impacto S21', category: 'Capas', price: 45.00, cost: 10.00, stock: 30, minStock: 5, image: '', type: 'PRODUCT' },
  { id: '5', name: 'Formatação e Backup', category: 'Serviços', price: 100.00, cost: 0.00, stock: 0, minStock: 0, image: '', type: 'SERVICE' },
];

interface Customer {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email?: string;
}

const INITIAL_CUSTOMERS: Customer[] = [
  { id: '1', name: 'João da Silva', cpf: '123.456.789-00', phone: '(11) 99999-1234' },
  { id: '2', name: 'Maria Oliveira', cpf: '987.654.321-99', phone: '(21) 98888-5678' },
  { id: '3', name: 'Pedro Souza', cpf: '456.123.789-55', phone: '(31) 97777-1111' },
];

type SalesMode = 'MENU' | 'POS' | 'DETAILED';

export const Sales: React.FC = () => {
  const [mode, setMode] = useState<SalesMode>('MENU');
  
  // Sale State
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Search States
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  
  // Modal States
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false); // For Detailed View

  // Data
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);

  // --- Actions ---

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    // If in detailed view adding via modal, visualize feedback (optional)
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Filtered Lists
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      p.id.includes(productSearchQuery)
    );
  }, [productSearchQuery]);

  const filteredCustomers = useMemo(() => {
    if (!customerSearchQuery) return [];
    const q = customerSearchQuery.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.cpf.includes(q) || 
      c.phone.includes(q)
    );
  }, [customers, customerSearchQuery]);

  const handleCreateCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCustomer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      cpf: formData.get('cpf') as string,
      phone: formData.get('phone') as string,
    };
    setCustomers([...customers, newCustomer]);
    setSelectedCustomer(newCustomer);
    setIsNewCustomerModalOpen(false);
    setCustomerSearchQuery(''); // Clear search to hide dropdown
  };

  // --- Sub-Components ---

  const SalesMenu = () => (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Nova Venda</h2>
      <p className="text-gray-500 mb-10">Selecione o tipo de venda que deseja realizar</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-4">
        {/* Button 1: Quick POS */}
        <button 
          onClick={() => setMode('POS')}
          className="group bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition-all duration-300 text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={120} className="text-blue-600" />
          </div>
          <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
            <ShoppingCart size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">Venda PDV Rápido</h3>
          <p className="text-gray-500">Ideal para vendas de balcão, poucos itens e agilidade. Interface simplificada para fluxo contínuo.</p>
        </button>

        {/* Button 2: Detailed Sale */}
        <button 
          onClick={() => setMode('DETAILED')}
          className="group bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-green-500 hover:shadow-xl transition-all duration-300 text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText size={120} className="text-green-600" />
          </div>
          <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
            <User size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">Venda Detalhada</h3>
          <p className="text-gray-500">Ideal para orçamentos, vendas para clientes cadastrados e negociações com múltiplas formas de pagamento.</p>
        </button>
      </div>
    </div>
  );

  const POSView = () => (
    <div className="flex h-[calc(100vh-140px)] gap-4 animate-fade-in">
      
      {/* Left: Product Selection (Full Height) */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-3 items-center">
            <button onClick={() => setMode('MENU')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                autoFocus
                type="text" 
                placeholder="Buscar produto (Nome, Código ou Barras)..." 
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
              />
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50/30">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <button 
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="flex flex-col p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left group"
                >
                  <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-300 group-hover:bg-blue-50 relative overflow-hidden transition-colors">
                    {product.type === 'SERVICE' ? <FileText size={40} /> : <Package size={40} />}
                  </div>
                  <h4 className="font-semibold text-gray-800 line-clamp-2 mb-1">{product.name}</h4>
                  <div className="flex justify-between items-end mt-auto">
                     <p className="text-xs text-gray-500">{product.category}</p>
                     <p className="font-bold text-blue-600">R$ {product.price.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
        </div>
      </div>

      {/* Right: Customer & Cart & Checkout */}
      <div className="w-96 flex flex-col gap-4">
        
        {/* Customer Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 shrink-0">
           <div className="flex items-center gap-2 mb-2">
              <User size={18} className="text-blue-600"/>
              <span className="text-sm font-bold text-gray-700">Identificar Cliente</span>
           </div>
           
           {selectedCustomer ? (
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                 <div className="overflow-hidden">
                    <p className="font-bold text-blue-900 truncate">{selectedCustomer.name}</p>
                    <p className="text-xs text-blue-600 font-mono">{selectedCustomer.cpf}</p>
                 </div>
                 <button onClick={() => setSelectedCustomer(null)} className="text-blue-400 hover:text-blue-600 p-1 hover:bg-blue-100 rounded">
                    <X size={16} />
                 </button>
              </div>
           ) : (
              <div className="relative">
                 <input 
                   type="text" 
                   placeholder="Buscar Cliente (CPF/Nome)..."
                   className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                   value={customerSearchQuery}
                   onChange={(e) => setCustomerSearchQuery(e.target.value)}
                 />
                 {customerSearchQuery && (
                   <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-lg border border-gray-100 mt-1 z-50 max-h-60 overflow-y-auto">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map(c => (
                          <button 
                            key={c.id} 
                            onClick={() => { setSelectedCustomer(c); setCustomerSearchQuery(''); }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                          >
                            <p className="text-sm font-medium text-gray-800">{c.name}</p>
                            <p className="text-xs text-gray-500">{c.cpf}</p>
                          </button>
                        ))
                      ) : (
                        <button 
                          onClick={() => setIsNewCustomerModalOpen(true)}
                          className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium"
                        >
                          + Novo: "{customerSearchQuery}"
                        </button>
                      )}
                   </div>
                 )}
              </div>
           )}
        </div>

        {/* Cart Card */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                <ShoppingCart size={18} className="text-gray-500" />
                Itens no Carrinho
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {cart.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                      <Zap size={32} className="mb-2" />
                      <p className="text-sm">Carrinho vazio</p>
                   </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 border border-gray-100 rounded-lg bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all animate-scale-in">
                      <div className="flex-1 overflow-hidden mr-2">
                         <p className="font-medium text-gray-800 text-sm truncate">{item.product.name}</p>
                         <p className="text-xs text-gray-500 flex items-center gap-1">
                            {item.quantity}x <span className="text-blue-600">R$ {item.product.price.toFixed(2)}</span>
                         </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800 text-sm">R$ {(item.quantity * item.product.price).toFixed(2)}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="ml-2 text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Qtd. Itens</span>
                  <span className="font-medium">{cart.reduce((acc, i) => acc + i.quantity, 0)}</span>
                </div>
                <div className="flex justify-between items-end pb-2 border-b border-gray-200">
                  <span className="text-base font-bold text-gray-800">TOTAL</span>
                  <span className="text-2xl font-bold text-blue-600">R$ {cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full py-3 bg-green-600 text-white rounded-xl font-bold text-base hover:bg-green-700 shadow-lg shadow-green-900/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <Check size={20} />
                  FINALIZAR (F2)
                </button>
            </div>
        </div>
      </div>
    </div>
  );

  const DetailedView = () => (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in h-[calc(100vh-140px)] flex flex-col">
       <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
             <button onClick={() => setMode('MENU')} className="p-2 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition-all text-gray-500">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h2 className="text-xl font-bold text-gray-800">Venda Detalhada</h2>
                <p className="text-xs text-gray-500">Venda #00124 • {new Date().toLocaleDateString()}</p>
             </div>
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">
             Rascunho
          </div>
       </div>

       <div className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
          {/* Step 1: Customer */}
          <section className="space-y-4">
             <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wide flex items-center gap-2 border-b border-gray-100 pb-2">
                <User size={16} /> Identificação do Cliente
             </h3>
             <div className="flex gap-4 items-start">
                <div className="flex-1 relative">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Buscar cliente (Nome, CPF, Telefone)..." 
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${selectedCustomer ? 'border-blue-300 bg-blue-50 text-blue-800 font-medium' : 'border-gray-300'}`}
                        value={selectedCustomer ? selectedCustomer.name : customerSearchQuery}
                        onChange={(e) => {
                           if(selectedCustomer) setSelectedCustomer(null);
                           setCustomerSearchQuery(e.target.value);
                        }}
                      />
                      {selectedCustomer && (
                         <button onClick={() => setSelectedCustomer(null)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:bg-blue-100 rounded-full p-1">
                            <X size={16} />
                         </button>
                      )}
                   </div>
                   
                   {/* Search Dropdown for Detailed View */}
                   {customerSearchQuery && !selectedCustomer && (
                      <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-lg border border-gray-100 mt-2 z-50">
                          {filteredCustomers.length > 0 ? (
                             filteredCustomers.map(c => (
                               <button 
                                 key={c.id} 
                                 onClick={() => { setSelectedCustomer(c); setCustomerSearchQuery(''); }}
                                 className="w-full text-left px-4 py-3 hover:bg-gray-50 flex justify-between items-center border-b border-gray-50 last:border-0"
                               >
                                 <div>
                                   <p className="font-medium text-gray-800">{c.name}</p>
                                   <p className="text-xs text-gray-500">CPF: {c.cpf}</p>
                                 </div>
                                 <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{c.phone}</span>
                               </button>
                             ))
                          ) : (
                             <div className="p-4 text-center">
                               <p className="text-sm text-gray-500 mb-2">Nenhum cliente encontrado.</p>
                             </div>
                          )}
                      </div>
                   )}
                </div>
                <button 
                  onClick={() => setIsNewCustomerModalOpen(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 font-medium border border-gray-200"
                >
                   <Plus size={18} /> Novo Cliente
                </button>
             </div>
             {selectedCustomer && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-6 text-sm">
                   <div><span className="text-blue-500 font-semibold">CPF:</span> <span className="text-blue-900">{selectedCustomer.cpf}</span></div>
                   <div><span className="text-blue-500 font-semibold">Telefone:</span> <span className="text-blue-900">{selectedCustomer.phone}</span></div>
                   <div className="text-green-600 flex items-center gap-1"><Check size={14}/> Cadastro Ativo</div>
                </div>
             )}
          </section>

          {/* Step 2: Items */}
          <section className="space-y-4">
             <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wide flex items-center gap-2">
                   <ShoppingCart size={16} /> Produtos e Serviços
                </h3>
                {cart.length > 0 && (
                   <button 
                     onClick={() => setIsProductModalOpen(true)}
                     className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                   >
                      <Plus size={14} /> Adicionar mais
                   </button>
                )}
             </div>

             {cart.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg border border-dashed border-gray-300 text-center">
                   <p className="text-gray-500 mb-4">Nenhum item adicionado à venda</p>
                   <button 
                     onClick={() => setIsProductModalOpen(true)}
                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm inline-flex items-center gap-2"
                   >
                      <Plus size={18} /> Adicionar Itens
                   </button>
                </div>
             ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                   <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500 font-medium">
                         <tr>
                            <th className="px-4 py-3">Descrição</th>
                            <th className="px-4 py-3 text-right">Qtd</th>
                            <th className="px-4 py-3 text-right">Unitário</th>
                            <th className="px-4 py-3 text-right">Total</th>
                            <th className="w-10"></th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {cart.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                               <td className="px-4 py-3">
                                  <p className="text-gray-900 font-medium">{item.product.name}</p>
                                  <p className="text-xs text-gray-500">{item.product.category}</p>
                               </td>
                               <td className="px-4 py-3 text-right">{item.quantity}</td>
                               <td className="px-4 py-3 text-right">R$ {item.product.price.toFixed(2)}</td>
                               <td className="px-4 py-3 text-right font-medium">R$ {(item.product.price * item.quantity).toFixed(2)}</td>
                               <td className="px-4 py-3 text-center">
                                  <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                      <tfoot className="bg-gray-50 font-bold text-gray-800">
                         <tr>
                            <td colSpan={3} className="px-4 py-3 text-right">TOTAL</td>
                            <td className="px-4 py-3 text-right text-lg text-blue-600">R$ {cartTotal.toFixed(2)}</td>
                            <td></td>
                         </tr>
                      </tfoot>
                   </table>
                </div>
             )}
          </section>

          {/* Step 3: Payment */}
          <section className={`space-y-4 transition-opacity ${cart.length > 0 && selectedCustomer ? 'opacity-100' : 'opacity-50'}`}>
             <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2 border-b border-gray-100 pb-2">
                <CreditCard size={16} /> Pagamento e Entrega
             </h3>
             {cart.length > 0 && selectedCustomer ? (
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-colors bg-white">
                      <p className="font-bold text-gray-800">Pagamento Agora</p>
                      <p className="text-sm text-gray-500">Receber pagamento e finalizar</p>
                   </div>
                   <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-colors bg-white">
                      <p className="font-bold text-gray-800">Gerar Orçamento</p>
                      <p className="text-sm text-gray-500">Salvar para aprovação futura</p>
                   </div>
                </div>
             ) : (
                <p className="text-sm text-gray-400 italic">Adicione itens e identifique o cliente para liberar as opções de pagamento.</p>
             )}
          </section>
       </div>
        
       <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={() => setMode('MENU')} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
          <button 
            disabled={!cart.length || !selectedCustomer}
            className={`px-6 py-2 text-white font-medium rounded-lg shadow-lg transition-all
              ${cart.length && selectedCustomer 
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20' 
                : 'bg-gray-400 cursor-not-allowed opacity-70'}`}
          >
            Finalizar Venda
          </button>
       </div>
    </div>
  );

  return (
    <div className="h-full relative">
      {mode === 'MENU' && <SalesMenu />}
      {mode === 'POS' && <POSView />}
      {mode === 'DETAILED' && <DetailedView />}

      {/* MODAL: New Customer */}
      {isNewCustomerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-scale-in">
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
               <h3 className="font-bold text-gray-800">Novo Cliente</h3>
               <button onClick={() => setIsNewCustomerModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
             </div>
             <form onSubmit={handleCreateCustomer} className="p-6 space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                   <input required name="name" type="text" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" autoFocus />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                   <input required name="cpf" type="text" placeholder="000.000.000-00" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                   <input required name="phone" type="text" placeholder="(00) 00000-0000" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Salvar Cliente</button>
             </form>
          </div>
        </div>
      )}

      {/* MODAL: Select Product (For Detailed View) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col animate-scale-in">
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
               <div className="flex-1">
                 <h3 className="font-bold text-gray-800">Adicionar Itens</h3>
                 <p className="text-xs text-gray-500">Selecione produtos ou serviços para adicionar à venda</p>
               </div>
               <button onClick={() => setIsProductModalOpen(false)}><X size={24} className="text-gray-400 hover:text-gray-600" /></button>
             </div>
             
             <div className="p-4 border-b border-gray-100 bg-white">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Buscar..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                  />
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredProducts.map(product => (
                    <button 
                      key={product.id}
                      onClick={() => {
                        addToCart(product);
                        // Optional: Close modal on add? No, better to allow multiple adds.
                        // setIsProductModalOpen(false); 
                      }}
                      className="flex flex-col p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left"
                    >
                      <div className="h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                        {product.type === 'SERVICE' ? <FileText size={32} /> : <Package size={32} />}
                      </div>
                      <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">{product.name}</h4>
                      <div className="flex justify-between items-end mt-auto">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{product.category}</span>
                        <p className="font-bold text-blue-600">R$ {product.price.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                </div>
             </div>
             
             <div className="p-4 border-t border-gray-100 bg-white flex justify-between items-center rounded-b-xl">
                <span className="text-sm text-gray-500">
                   {cart.length} itens no carrinho (R$ {cartTotal.toFixed(2)})
                </span>
                <button 
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Concluir Seleção
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};