import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Zap, FileText, User, Search, Plus, Trash2, ArrowLeft, CreditCard, X, Check, Package, Smartphone, History, RefreshCcw, DollarSign, Wallet, Calendar, Edit, Tag, AlignLeft, Phone, ArrowLeftRight, Eye, Printer, Truck, CalendarClock, UserCheck, MapPin } from 'lucide-react';
import { Product } from '../types';

// --- MOCK DATA ---

const INITIAL_MOCK_PRODUCTS: Product[] = [
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
  address?: string; // Added Address
}

// Interface for Cart Item with details
interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  note: string;
}

// Interface for a completed sale
interface CompletedSale {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerCpf?: string; // Added CPF to Sale Record
  customerAddress?: string; // Added Address to Sale Record
  items: CartItem[];
  total: number;
  date: string; // ISO string or formatted time
  paymentMethod: 'Pix' | 'Dinheiro' | 'Débito' | 'Crédito' | 'Crediário' | 'Outros';
  status: 'Pago' | 'A Receber' | 'Não Pago' | 'Estornado' | 'Estornado (Crédito)' | 'Estornado (Dinheiro)' | 'Encomenda';
  refundType?: 'CREDIT' | 'MONEY';
}

const INITIAL_CUSTOMERS: Customer[] = [
  { id: '1', name: 'João da Silva', cpf: '123.456.789-00', phone: '(11) 99999-1234', address: 'Rua A, 123' },
  { id: '2', name: 'Maria Oliveira', cpf: '987.654.321-99', phone: '(21) 98888-5678', address: 'Av. Brasil, 500' },
  { id: '3', name: 'Pedro Souza', cpf: '456.123.789-55', phone: '(31) 97777-1111', address: 'Rua das Flores, 10' },
];

type SalesMode = 'MENU' | 'POS' | 'DETAILED' | 'PREORDER';

export const Sales: React.FC = () => {
  const [mode, setMode] = useState<SalesMode>('MENU');
  
  // Data State (Lifted up to allow updates)
  const [availableProducts, setAvailableProducts] = useState<Product[]>(INITIAL_MOCK_PRODUCTS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);

  // Sale State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Detailed Sale Specific State
  const [detailedCustomerForm, setDetailedCustomerForm] = useState({
    name: '',
    phone: '',
    cpf: '',
    address: ''
  });
  
  // Search States
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  
  // Sales History State
  const [salesHistory, setSalesHistory] = useState<CompletedSale[]>([
    {
      id: '1001',
      customerName: 'Cliente Balcão',
      customerPhone: '',
      items: [{ product: INITIAL_MOCK_PRODUCTS[0], quantity: 1, unitPrice: 30.00, discount: 0, note: '' }],
      total: 30.00,
      date: new Date().toLocaleTimeString(),
      paymentMethod: 'Dinheiro',
      status: 'Pago'
    },
    {
      id: '1002',
      customerName: 'João da Silva',
      customerPhone: '(11) 99999-1234',
      items: [{ product: INITIAL_MOCK_PRODUCTS[2], quantity: 1, unitPrice: 120.00, discount: 0, note: '' }],
      total: 120.00,
      date: new Date().toLocaleTimeString(),
      paymentMethod: 'Pix',
      status: 'Pago'
    }
  ]);
  
  // Modal States
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  // View Sale Details State
  const [isViewSaleModalOpen, setIsViewSaleModalOpen] = useState(false);
  const [saleToView, setSaleToView] = useState<CompletedSale | null>(null);
  
  // Refund Modal State
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [saleToRefund, setSaleToRefund] = useState<CompletedSale | null>(null);
  
  // Item Details Modal State
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [itemDetails, setItemDetails] = useState({ quantity: 1, unitPrice: 0, discount: 0, note: '' });

  // Payment Logic State
  const [paymentMethod, setPaymentMethod] = useState<CompletedSale['paymentMethod']>('Dinheiro');
  const [paymentStatus, setPaymentStatus] = useState<CompletedSale['status']>('Pago');
  const [amountPaid, setAmountPaid] = useState(''); // For change calculation

  // Pre-Order State
  const [preOrderForm, setPreOrderForm] = useState({
    name: '',
    phone: '',
    product: '',
    totalValue: '',
    entryValue: '',
    date: '',
    paymentMethod: 'Pix',
    authorizedPickup: ''
  });
  // Helper for PreOrder Search
  const [showPreOrderProductSuggestions, setShowPreOrderProductSuggestions] = useState(false);
  const [showPreOrderCustomerSuggestions, setShowPreOrderCustomerSuggestions] = useState(false);

  // --- Actions ---

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex] = { 
          ...newCart[existingIndex], 
          quantity: newCart[existingIndex].quantity + 1 
        };
        return newCart;
      }
      return [...prev, { 
        product, 
        quantity: 1, 
        unitPrice: product.price, 
        discount: 0, 
        note: '' 
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const openItemDetails = (index: number) => {
    const item = cart[index];
    setEditingItemIndex(index);
    setItemDetails({
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
      note: item.note
    });
  };

  const saveItemDetails = () => {
    if (editingItemIndex === null) return;
    
    setCart(prev => {
      const newCart = [...prev];
      newCart[editingItemIndex] = {
        ...newCart[editingItemIndex],
        quantity: itemDetails.quantity,
        unitPrice: itemDetails.unitPrice,
        discount: itemDetails.discount,
        note: itemDetails.note
      };
      return newCart;
    });
    setEditingItemIndex(null);
  };

  const cartTotal = cart.reduce((acc, item) => {
    const itemTotal = (item.unitPrice * item.quantity) - item.discount;
    return acc + Math.max(0, itemTotal);
  }, 0);

  const handleFinalizeSale = () => {
    // Determine customer info based on mode
    let finalCustomerName = 'Cliente Balcão';
    let finalCustomerPhone = '';
    let finalCustomerCpf = '';
    let finalCustomerAddress = '';

    if (mode === 'DETAILED') {
        finalCustomerName = detailedCustomerForm.name || 'Cliente Balcão';
        finalCustomerPhone = detailedCustomerForm.phone;
        finalCustomerCpf = detailedCustomerForm.cpf;
        finalCustomerAddress = detailedCustomerForm.address;
    } else {
        if (selectedCustomer) {
            finalCustomerName = selectedCustomer.name;
            finalCustomerPhone = selectedCustomer.phone;
            finalCustomerCpf = selectedCustomer.cpf;
            finalCustomerAddress = selectedCustomer.address || '';
        }
    }

    const newSale: CompletedSale = {
      id: Math.floor(Math.random() * 100000).toString(),
      customerName: finalCustomerName,
      customerPhone: finalCustomerPhone,
      customerCpf: finalCustomerCpf,
      customerAddress: finalCustomerAddress,
      items: [...cart],
      total: cartTotal,
      date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: paymentMethod,
      status: paymentStatus
    };

    setSalesHistory([newSale, ...salesHistory]);
    
    // Reset
    setCart([]);
    setSelectedCustomer(null);
    setDetailedCustomerForm({ name: '', phone: '', cpf: '', address: '' }); // Reset detailed form
    setIsPaymentModalOpen(false);
    setAmountPaid('');
    setPaymentStatus('Pago');
    setPaymentMethod('Dinheiro');
  };

  const handleSavePreOrder = () => {
    if(!preOrderForm.name || !preOrderForm.product || !preOrderForm.totalValue || !preOrderForm.date) {
        alert("Preencha os campos obrigatórios!");
        return;
    }

    // 1. Check and Save Customer if new
    let customerToUse = customers.find(c => c.name.toLowerCase() === preOrderForm.name.toLowerCase());
    if (!customerToUse) {
        customerToUse = {
            id: Math.random().toString(36).substr(2, 9),
            name: preOrderForm.name,
            cpf: '',
            phone: preOrderForm.phone
        };
        setCustomers(prev => [...prev, customerToUse!]);
    }

    // 2. Check and Save Product if new
    let productToUse = availableProducts.find(p => p.name.toLowerCase() === preOrderForm.product.toLowerCase());
    if (!productToUse) {
        productToUse = {
            id: Math.random().toString(36).substr(2, 9),
            name: preOrderForm.product,
            category: 'Encomendas',
            price: parseFloat(preOrderForm.totalValue) || 0,
            cost: 0,
            stock: 0, // Registered but no stock yet
            minStock: 1,
            image: '',
            type: 'PRODUCT'
        };
        setAvailableProducts(prev => [...prev, productToUse!]);
    }

    // 3. Create Sale Record for History
    const total = parseFloat(preOrderForm.totalValue) || 0;
    const entry = parseFloat(preOrderForm.entryValue) || 0;
    
    const newPreOrderSale: CompletedSale = {
        id: Math.floor(Math.random() * 100000).toString(),
        customerName: preOrderForm.name,
        customerPhone: preOrderForm.phone,
        items: [{
            product: productToUse,
            quantity: 1,
            unitPrice: total,
            discount: 0,
            note: `Encomenda. Entrega: ${preOrderForm.date}. Entrada: R$ ${entry.toFixed(2)}. Retira: ${preOrderForm.authorizedPickup || 'Cliente'}`
        }],
        total: total,
        date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        paymentMethod: preOrderForm.paymentMethod as any,
        status: 'Encomenda',
        refundType: undefined
    };

    setSalesHistory([newPreOrderSale, ...salesHistory]);

    // In a real app, save the Pre-Order object to backend
    alert(`Encomenda Salva com Sucesso!\nAdicionada ao histórico.\nProduto "${productToUse.name}" registrado no sistema.\nCliente "${customerToUse.name}" registrado.`);
    
    setMode('MENU');
    setPreOrderForm({
        name: '',
        phone: '',
        product: '',
        totalValue: '',
        entryValue: '',
        date: '',
        paymentMethod: 'Pix',
        authorizedPickup: ''
    });
  };

  // View Sale
  const handleViewSale = (sale: CompletedSale) => {
    setSaleToView(sale);
    setIsViewSaleModalOpen(true);
  };

  // Open Refund Modal
  const initiateRefund = (sale: CompletedSale) => {
    setSaleToRefund(sale);
    setIsRefundModalOpen(true);
  };

  // Process Refund
  const confirmRefund = (type: 'CREDIT' | 'MONEY') => {
    if (!saleToRefund) return;

    const newStatus = type === 'CREDIT' ? 'Estornado (Crédito)' : 'Estornado (Dinheiro)';

    setSalesHistory(prev => prev.map(sale => 
      sale.id === saleToRefund.id ? { ...sale, status: newStatus, refundType: type } : sale
    ));
    
    setIsRefundModalOpen(false);
    setSaleToRefund(null);
  };

  // Filtered Lists
  const filteredProducts = useMemo(() => {
    return availableProducts.filter(p => 
      p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      p.id.includes(productSearchQuery)
    );
  }, [productSearchQuery, availableProducts]);

  const filteredCustomers = useMemo(() => {
    if (!customerSearchQuery) return [];
    const q = customerSearchQuery.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.cpf.includes(q) || 
      c.phone.includes(q)
    );
  }, [customers, customerSearchQuery]);

  // Pre-Order Specific Filters
  const filteredPreOrderProducts = useMemo(() => {
      const q = preOrderForm.product.toLowerCase();
      if(!q) return [];
      return availableProducts.filter(p => p.name.toLowerCase().includes(q));
  }, [preOrderForm.product, availableProducts]);

  const filteredPreOrderCustomers = useMemo(() => {
      const q = preOrderForm.name.toLowerCase();
      if(!q) return [];
      return customers.filter(c => c.name.toLowerCase().includes(q));
  }, [preOrderForm.name, customers]);

  // Filtered History
  const filteredHistory = useMemo(() => {
    const q = historySearchQuery.toLowerCase();
    return salesHistory.filter(s => 
      s.id.includes(q) ||
      s.customerName.toLowerCase().includes(q) ||
      (s.customerPhone && s.customerPhone.includes(q))
    );
  }, [salesHistory, historySearchQuery]);

  const handleCreateCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCustomer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      cpf: formData.get('cpf') as string,
      phone: formData.get('phone') as string,
      address: '', // Init empty
    };
    setCustomers([...customers, newCustomer]);
    setSelectedCustomer(newCustomer);
    setIsNewCustomerModalOpen(false);
    setCustomerSearchQuery('');
  };

  // Populate Detailed form when a customer is selected from search
  const selectCustomerForDetailed = (c: Customer) => {
      setDetailedCustomerForm({
          name: c.name,
          phone: c.phone,
          cpf: c.cpf,
          address: c.address || ''
      });
      setCustomerSearchQuery(''); // Close search
  };

  // --- Styles Helper ---
  const getStatusColor = (status: CompletedSale['status']) => {
    switch(status) {
      case 'Pago': return 'bg-green-100 text-green-800 border-green-200';
      case 'A Receber': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Não Pago': return 'bg-red-100 text-red-800 border-red-200';
      case 'Encomenda': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Estornado': 
      case 'Estornado (Crédito)':
      case 'Estornado (Dinheiro)':
        return 'bg-gray-200 text-gray-500 border-gray-300 line-through';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // --- Sub-Components ---

  const SalesMenu = () => (
    <div className="flex flex-col h-full animate-fade-in p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto w-full">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Vendas</h2>
           <p className="text-gray-500">Selecione uma opção ou visualize o histórico</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto w-full mb-8">
        {/* Button 1: Quick POS */}
        <button 
          onClick={() => setMode('POS')}
          className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all duration-300 text-left relative overflow-hidden flex flex-col justify-between h-40"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={80} className="text-blue-600" />
          </div>
          <div>
            <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-blue-600 group-hover:scale-110 transition-transform">
                <ShoppingCart size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">PDV Rápido</h3>
          </div>
          <p className="text-xs text-gray-500 relative z-10">Venda balcão ágil com poucos cliques.</p>
        </button>

        {/* Button 2: Detailed Sale */}
        <button 
          onClick={() => setMode('DETAILED')}
          className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-green-500 hover:shadow-lg transition-all duration-300 text-left relative overflow-hidden flex flex-col justify-between h-40"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText size={80} className="text-green-600" />
          </div>
          <div>
            <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-green-600 group-hover:scale-110 transition-transform">
                <User size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors">Venda Detalhada</h3>
          </div>
          <p className="text-xs text-gray-500 relative z-10">Ideal para orçamentos e cadastros completos.</p>
        </button>

        {/* Button 3: Pre-Orders (Encomendas) */}
        <button 
          onClick={() => setMode('PREORDER')}
          className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-purple-500 hover:shadow-lg transition-all duration-300 text-left relative overflow-hidden flex flex-col justify-between h-40"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Truck size={80} className="text-purple-600" />
          </div>
          <div>
            <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-purple-600 group-hover:scale-110 transition-transform">
                <Package size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Encomendas</h3>
          </div>
          <p className="text-xs text-gray-500 relative z-10">Registrar pedidos de peças ou produtos.</p>
        </button>
      </div>

      {/* History Section Inline */}
      <div className="max-w-5xl mx-auto w-full bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col min-h-[400px]">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
               <History size={18} className="text-blue-600"/> Últimas Vendas & Encomendas
             </h3>
             <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar (Nome, Tel ou Nº Venda)" 
                  className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                />
             </div>
          </div>
          <div className="overflow-y-auto flex-1">
             <table className="w-full text-left border-collapse">
                 <thead className="bg-white text-gray-500 text-xs uppercase sticky top-0 z-10 border-b border-gray-100">
                   <tr>
                     <th className="px-6 py-3 font-medium bg-gray-50">ID / Hora</th>
                     <th className="px-6 py-3 font-medium bg-gray-50">Cliente</th>
                     <th className="px-6 py-3 font-medium bg-gray-50">Resumo</th>
                     <th className="px-6 py-3 font-medium bg-gray-50">Pagamento</th>
                     <th className="px-6 py-3 font-medium bg-gray-50">Total</th>
                     <th className="px-6 py-3 font-medium bg-gray-50">Status</th>
                     <th className="px-6 py-3 font-medium bg-gray-50 text-right">Ação</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {filteredHistory.length > 0 ? (
                       filteredHistory.map((sale) => (
                         <tr key={sale.id} className={`hover:bg-gray-50 transition-colors ${sale.status.includes('Estornado') ? 'opacity-60 bg-gray-50' : ''}`}>
                           <td className="px-6 py-4">
                             <p className="font-bold text-gray-800">#{sale.id}</p>
                             <p className="text-xs text-gray-500">{sale.date}</p>
                           </td>
                           <td className="px-6 py-4 text-sm font-medium text-gray-700">
                             {sale.customerName}
                             {sale.customerPhone && <p className="text-xs text-gray-400 font-normal">{sale.customerPhone}</p>}
                           </td>
                           <td className="px-6 py-4">
                             <div className="max-w-[200px]">
                               <p className="text-xs text-gray-600 truncate">
                                 {sale.items.length} itens
                               </p>
                               <p className="text-[10px] text-gray-400 truncate">
                                 {sale.items.map(i => i.product.name).join(', ')}
                               </p>
                             </div>
                           </td>
                           <td className="px-6 py-4 text-sm text-gray-600">
                             {sale.paymentMethod}
                           </td>
                           <td className="px-6 py-4 font-bold text-gray-800">
                             R$ {sale.total.toFixed(2)}
                           </td>
                           <td className="px-6 py-4">
                             <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(sale.status)}`}>
                               {sale.status}
                             </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                               <button 
                                onClick={() => handleViewSale(sale)}
                                className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-all"
                                title="Visualizar Venda"
                               >
                                 <Eye size={16} />
                               </button>
                               {!sale.status.includes('Estornado') && (
                                 <button 
                                  onClick={() => initiateRefund(sale)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded border border-transparent hover:border-red-200 transition-all text-xs font-medium flex items-center gap-1"
                                 >
                                   <RefreshCcw size={12} /> Estornar
                                 </button>
                               )}
                             </div>
                           </td>
                         </tr>
                       ))
                   ) : (
                       <tr>
                           <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                               Nenhuma venda encontrada para "{historySearchQuery}".
                           </td>
                       </tr>
                   )}
                 </tbody>
               </table>
          </div>
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
            {/* History Button (Optional in POS view since it is in Menu now, but good to keep for quick access) */}
            <button 
              onClick={() => setIsHistoryModalOpen(true)}
              className="p-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              title="Histórico de Vendas"
            >
              <History size={20} />
            </button>
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
                         <div className="text-xs text-gray-500 flex items-center gap-1 flex-wrap">
                            <span>{item.quantity}x R$ {item.unitPrice.toFixed(2)}</span>
                            {item.discount > 0 && <span className="text-green-600">(- R$ {item.discount.toFixed(2)})</span>}
                         </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800 text-sm">R$ {((item.quantity * item.unitPrice) - item.discount).toFixed(2)}</p>
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
                <button 
                  onClick={() => {
                    if (cart.length > 0) setIsPaymentModalOpen(true);
                  }}
                  disabled={cart.length === 0}
                  className={`w-full py-3 text-white rounded-xl font-bold text-base shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                    ${cart.length > 0 ? 'bg-green-600 hover:bg-green-700 shadow-green-900/20' : 'bg-gray-400 cursor-not-allowed opacity-70'}`}
                >
                  <Check size={20} />
                  FINALIZAR (F2)
                </button>
            </div>
        </div>
      </div>
    </div>
  );

  const DetailedView = () => (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-4 animate-fade-in">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-3">
                <button onClick={() => setMode('MENU')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                  <ArrowLeft size={20} />
                </button>
                <div>
                   <h2 className="text-xl font-bold text-gray-800">Venda Detalhada</h2>
                   <p className="text-xs text-gray-500">Adicione itens à lista, preencha dados do cliente e finalize.</p>
                </div>
             </div>
             <div className="flex gap-2">
                 <button 
                   onClick={() => setIsProductModalOpen(true)}
                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm shadow-blue-200"
                 >
                    <Plus size={18} /> Adicionar Itens
                 </button>
             </div>
        </div>

        <div className="flex-1 flex gap-4 overflow-hidden">
             <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                 <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <ShoppingCart size={18} className="text-blue-600" /> Itens do Pedido
                    </h3>
                    <span className="text-sm text-gray-500">{cart.length} itens</span>
                 </div>
                 <div className="flex-1 overflow-y-auto p-0">
                    <table className="w-full text-left">
                        <thead className="bg-white text-gray-500 text-xs uppercase sticky top-0 z-10 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3">Produto / Serviço</th>
                                <th className="px-6 py-3 text-center">Qtd</th>
                                <th className="px-6 py-3 text-right">Unitário</th>
                                <th className="px-6 py-3 text-right">Desconto</th>
                                <th className="px-6 py-3 text-right">Total</th>
                                <th className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cart.length > 0 ? (
                                cart.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-800">{item.product.name}</p>
                                            {item.note && <p className="text-xs text-gray-500 italic">{item.note}</p>}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            R$ {item.unitPrice.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-red-500">
                                            {item.discount > 0 ? `- R$ ${item.discount.toFixed(2)}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-800">
                                            R$ {((item.quantity * item.unitPrice) - item.discount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => openItemDetails(idx)}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                    title="Remover"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        Nenhum item adicionado. Clique em "Adicionar Itens".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                 </div>
                 <div className="p-4 bg-gray-50 border-t border-gray-100">
                     <div className="flex justify-end gap-6 text-sm">
                         <div className="text-gray-500">Subtotal: <span className="font-bold text-gray-800">R$ {cartTotal.toFixed(2)}</span></div>
                     </div>
                 </div>
             </div>

             <div className="w-96 flex flex-col gap-4">
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative">
                       <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                           <User size={16} className="text-blue-600" /> Dados do Cliente
                       </h3>
                       
                       <div className="space-y-3">
                           {/* Quick Search Overlay */}
                           <div className="relative">
                               <div className="relative">
                                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                   <input 
                                     type="text" 
                                     placeholder="Buscar Cliente Cadastrado..."
                                     className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors"
                                     value={customerSearchQuery}
                                     onChange={(e) => setCustomerSearchQuery(e.target.value)}
                                   />
                               </div>
                               {customerSearchQuery && (
                                   <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-lg border border-gray-100 mt-1 z-20 max-h-40 overflow-y-auto">
                                      {filteredCustomers.length > 0 ? (
                                        filteredCustomers.map(c => (
                                          <button 
                                            key={c.id} 
                                            onClick={() => selectCustomerForDetailed(c)}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                                          >
                                            <p className="text-sm font-medium text-gray-800">{c.name}</p>
                                            <p className="text-xs text-gray-500">{c.cpf} | {c.phone}</p>
                                          </button>
                                        ))
                                      ) : (
                                        <div className="p-3 text-xs text-gray-500">Nenhum cliente encontrado</div>
                                      )}
                                   </div>
                               )}
                           </div>

                           <div className="border-t border-gray-100 my-2"></div>

                           {/* Detailed Fields */}
                           <div>
                               <label className="block text-xs font-medium text-gray-500 mb-1">Nome do Cliente</label>
                               <input 
                                   type="text"
                                   className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                   placeholder="Nome Completo"
                                   value={detailedCustomerForm.name}
                                   onChange={(e) => setDetailedCustomerForm({...detailedCustomerForm, name: e.target.value})}
                               />
                           </div>
                           
                           <div>
                               <label className="block text-xs font-medium text-gray-500 mb-1">CPF / CNPJ (Opcional)</label>
                               <input 
                                   type="text"
                                   className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                   placeholder="000.000.000-00"
                                   value={detailedCustomerForm.cpf}
                                   onChange={(e) => setDetailedCustomerForm({...detailedCustomerForm, cpf: e.target.value})}
                               />
                           </div>

                           <div>
                               <label className="block text-xs font-medium text-gray-500 mb-1">Telefone</label>
                               <div className="relative">
                                   <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                                   <input 
                                       type="text"
                                       className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                       placeholder="(00) 00000-0000"
                                       value={detailedCustomerForm.phone}
                                       onChange={(e) => setDetailedCustomerForm({...detailedCustomerForm, phone: e.target.value})}
                                   />
                               </div>
                           </div>

                           <div>
                               <label className="block text-xs font-medium text-gray-500 mb-1">Endereço Completo</label>
                               <div className="relative">
                                   <MapPin className="absolute left-3 top-3 text-gray-400" size={14} />
                                   <textarea 
                                       rows={2}
                                       className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                                       placeholder="Rua, Número, Bairro, Cidade..."
                                       value={detailedCustomerForm.address}
                                       onChange={(e) => setDetailedCustomerForm({...detailedCustomerForm, address: e.target.value})}
                                   />
                               </div>
                           </div>
                       </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col justify-end">
                       <div className="space-y-3 mb-6">
                           <div className="flex justify-between items-center text-sm text-gray-600">
                               <span>Itens</span>
                               <span>{cart.reduce((a,b) => a+b.quantity, 0)}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm text-gray-600">
                               <span>Descontos</span>
                               <span className="text-red-500">- R$ {cart.reduce((a,b) => a+b.discount, 0).toFixed(2)}</span>
                           </div>
                           <div className="pt-3 border-t border-gray-100 flex justify-between items-end">
                               <span className="font-bold text-gray-800">Total</span>
                               <span className="text-2xl font-bold text-blue-600">R$ {cartTotal.toFixed(2)}</span>
                           </div>
                       </div>
                       <button 
                          onClick={() => {
                            if (cart.length > 0) setIsPaymentModalOpen(true);
                          }}
                          disabled={cart.length === 0}
                          className={`w-full py-3 text-white rounded-xl font-bold text-base shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                            ${cart.length > 0 ? 'bg-green-600 hover:bg-green-700 shadow-green-900/20' : 'bg-gray-400 cursor-not-allowed opacity-70'}`}
                       >
                          <Check size={20} />
                          Finalizar Venda
                       </button>
                  </div>
             </div>
        </div>
    </div>
  );

  const PreOrderView = () => {
    // Calculated field
    const total = parseFloat(preOrderForm.totalValue) || 0;
    const entry = parseFloat(preOrderForm.entryValue) || 0;
    const remaining = Math.max(0, total - entry);

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in h-[calc(100vh-140px)] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                    <button onClick={() => setMode('MENU')} className="p-2 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition-all text-gray-500">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Nova Encomenda</h2>
                        <p className="text-xs text-gray-500">Registre pedidos de peças ou produtos sob demanda</p>
                    </div>
                </div>
            </div>

            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-8">
                {/* Section 1: Client */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4 relative">
                    <h3 className="text-sm font-bold text-purple-600 uppercase tracking-wide flex items-center gap-2 border-b border-gray-100 pb-2">
                        <User size={16} /> Dados do Cliente
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    value={preOrderForm.name}
                                    onChange={(e) => {
                                        setPreOrderForm({...preOrderForm, name: e.target.value});
                                        setShowPreOrderCustomerSuggestions(true);
                                    }}
                                    onFocus={() => setShowPreOrderCustomerSuggestions(true)}
                                    placeholder="Buscar ou Digitar Nome"
                                />
                            </div>
                            {/* Suggestions Dropdown */}
                            {showPreOrderCustomerSuggestions && preOrderForm.name && filteredPreOrderCustomers.length > 0 && (
                                <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg border border-gray-100 mt-1 z-20 max-h-40 overflow-y-auto">
                                    {filteredPreOrderCustomers.map(c => (
                                        <button 
                                            key={c.id} 
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0 text-sm"
                                            onClick={() => {
                                                setPreOrderForm(prev => ({...prev, name: c.name, phone: c.phone}));
                                                setShowPreOrderCustomerSuggestions(false);
                                            }}
                                        >
                                            <p className="font-medium text-gray-800">{c.name}</p>
                                            <p className="text-xs text-gray-500">{c.phone}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                value={preOrderForm.phone}
                                onChange={(e) => setPreOrderForm({...preOrderForm, phone: e.target.value})}
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                        <div className="md:col-span-2 relative">
                             <label className="block text-sm font-medium text-gray-700 mb-1">Pessoa Autorizada para Retirada (Opcional)</label>
                             <div className="relative">
                                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50"
                                    value={preOrderForm.authorizedPickup}
                                    onChange={(e) => setPreOrderForm({...preOrderForm, authorizedPickup: e.target.value})}
                                    placeholder="Nome de quem irá retirar (se diferente do cliente)"
                                />
                             </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Order Details */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-purple-600 uppercase tracking-wide flex items-center gap-2 border-b border-gray-100 pb-2">
                        <Package size={16} /> Detalhes do Pedido
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="md:col-span-2 relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Produto Encomendado</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    value={preOrderForm.product}
                                    onChange={(e) => {
                                        setPreOrderForm({...preOrderForm, product: e.target.value});
                                        setShowPreOrderProductSuggestions(true);
                                    }}
                                    onFocus={() => setShowPreOrderProductSuggestions(true)}
                                    placeholder="Buscar produto existente ou digitar novo..."
                                />
                            </div>
                            {/* Product Suggestions */}
                            {showPreOrderProductSuggestions && preOrderForm.product && filteredPreOrderProducts.length > 0 && (
                                <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg border border-gray-100 mt-1 z-20 max-h-40 overflow-y-auto">
                                    {filteredPreOrderProducts.map(p => (
                                        <button 
                                            key={p.id} 
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0 text-sm flex justify-between"
                                            onClick={() => {
                                                setPreOrderForm(prev => ({
                                                    ...prev, 
                                                    product: p.name, 
                                                    totalValue: p.price.toString()
                                                }));
                                                setShowPreOrderProductSuggestions(false);
                                            }}
                                        >
                                            <span className="font-medium text-gray-800">{p.name}</span>
                                            <span className="text-xs text-blue-600 font-bold">R$ {p.price.toFixed(2)}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-gray-400 mt-1">Se o produto não existir, ele será salvo no estoque automaticamente ao confirmar.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Previsão de Retirada</label>
                            <input 
                                type="date" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                value={preOrderForm.date}
                                onChange={(e) => setPreOrderForm({...preOrderForm, date: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Financials */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-sm font-bold text-purple-600 uppercase tracking-wide flex items-center gap-2 border-b border-gray-100 pb-2">
                        <DollarSign size={16} /> Financeiro
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total (R$)</label>
                            <input 
                                type="number" 
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-lg font-bold"
                                value={preOrderForm.totalValue}
                                onChange={(e) => setPreOrderForm({...preOrderForm, totalValue: e.target.value})}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Entrada / Sinal (R$)</label>
                            <input 
                                type="number" 
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-lg font-bold text-green-600"
                                value={preOrderForm.entryValue}
                                onChange={(e) => setPreOrderForm({...preOrderForm, entryValue: e.target.value})}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex flex-col justify-center">
                            <span className="text-sm text-gray-500 font-medium">Restante a Pagar</span>
                            <span className="text-xl font-bold text-red-600">R$ {remaining.toFixed(2)}</span>
                        </div>
                    </div>

                    {entry > 0 && (
                        <div className="pt-4 border-t border-gray-100 animate-fade-in">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pagamento (Entrada)</label>
                            <div className="flex gap-2">
                                {['Pix', 'Dinheiro', 'Cartão'].map((method) => (
                                    <button
                                        key={method}
                                        onClick={() => setPreOrderForm({...preOrderForm, paymentMethod: method})}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${preOrderForm.paymentMethod === method ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setMode('MENU')} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
                <button 
                    onClick={handleSavePreOrder}
                    className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg shadow-lg hover:bg-purple-700 transition-all flex items-center gap-2"
                >
                    <Check size={18} /> Salvar Encomenda
                </button>
            </div>
        </div>
    );
  };

  return (
    <div className="h-full relative">
      {mode === 'MENU' && <SalesMenu />}
      {mode === 'POS' && <POSView />}
      {mode === 'DETAILED' && <DetailedView />}
      {mode === 'PREORDER' && <PreOrderView />}

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

      {/* MODAL: Edit Cart Item Details */}
      {editingItemIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[75] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-scale-in">
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
               <div>
                  <h3 className="font-bold text-gray-800">Detalhes do Item</h3>
                  <p className="text-xs text-gray-500">{cart[editingItemIndex].product.name}</p>
               </div>
               <button onClick={() => setEditingItemIndex(null)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
             </div>
             <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                        <input 
                            type="number" 
                            min="1"
                            className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            value={itemDetails.quantity}
                            onChange={(e) => setItemDetails({...itemDetails, quantity: parseInt(e.target.value) || 1})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço Unit. (R$)</label>
                        <input 
                            type="number" 
                            step="0.01"
                            className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            value={itemDetails.unitPrice}
                            onChange={(e) => setItemDetails({...itemDetails, unitPrice: parseFloat(e.target.value) || 0})}
                        />
                    </div>
                </div>
                
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                       <Tag size={14} /> Desconto Total no Item (R$)
                   </label>
                   <input 
                       type="number" 
                       step="0.01"
                       className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-red-600 font-medium"
                       placeholder="0,00"
                       value={itemDetails.discount}
                       onChange={(e) => setItemDetails({...itemDetails, discount: parseFloat(e.target.value) || 0})}
                   />
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Observações (Serial, IMEI, Detalhes)</label>
                   <textarea 
                       rows={3}
                       className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                       placeholder="Ex: IMEI: 35489..."
                       value={itemDetails.note}
                       onChange={(e) => setItemDetails({...itemDetails, note: e.target.value})}
                   />
                </div>

                <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center border border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Subtotal Calculado:</span>
                    <span className="text-lg font-bold text-blue-600">
                        R$ {Math.max(0, (itemDetails.unitPrice * itemDetails.quantity) - itemDetails.discount).toFixed(2)}
                    </span>
                </div>
                
                <div className="flex gap-3 pt-2">
                    <button 
                        onClick={() => setEditingItemIndex(null)}
                        className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={saveItemDetails}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Salvar Alterações
                    </button>
                </div>
             </div>
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

      {/* MODAL: PAYMENT FINALIZATION */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-scale-in flex flex-col max-h-[90vh]">
             <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
               <div>
                  <h3 className="text-xl font-bold text-gray-800">Finalizar Venda</h3>
                  <p className="text-sm text-gray-500">
                    Cliente: <span className="font-medium text-gray-800">
                        {mode === 'DETAILED' && detailedCustomerForm.name ? detailedCustomerForm.name : (selectedCustomer ? selectedCustomer.name : 'Consumidor Final')}
                    </span>
                  </p>
               </div>
               <button onClick={() => setIsPaymentModalOpen(false)}><X size={24} className="text-gray-400 hover:text-gray-600" /></button>
             </div>

             <div className="p-6 overflow-y-auto">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 
                 {/* Left: Summary */}
                 <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
                       <p className="text-gray-500 text-sm mb-1 font-medium uppercase tracking-wide">Valor Total</p>
                       <p className="text-4xl font-bold text-blue-700">R$ {cartTotal.toFixed(2)}</p>
                       <p className="text-xs text-blue-400 mt-2">{cart.reduce((a,b) => a+b.quantity, 0)} itens</p>
                    </div>

                    {paymentMethod === 'Dinheiro' && (
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Valor Recebido (R$)</label>
                         <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                            <input 
                              type="number" 
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg font-bold"
                              placeholder="0,00"
                              value={amountPaid}
                              onChange={(e) => setAmountPaid(e.target.value)}
                              autoFocus
                            />
                         </div>
                         {amountPaid && parseFloat(amountPaid) > cartTotal && (
                            <div className="mt-2 flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100">
                               <span className="text-green-700 font-medium">Troco:</span>
                               <span className="text-xl font-bold text-green-700">R$ {(parseFloat(amountPaid) - cartTotal).toFixed(2)}</span>
                            </div>
                         )}
                      </div>
                    )}
                 </div>

                 {/* Right: Payment Methods & Status */}
                 <div className="space-y-6">
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <Wallet size={16} /> Forma de Pagamento
                       </label>
                       <div className="grid grid-cols-2 gap-2">
                          {['Pix', 'Dinheiro', 'Débito', 'Crédito', 'Crediário', 'Outros'].map((method) => (
                             <button
                                key={method}
                                onClick={() => setPaymentMethod(method as any)}
                                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${paymentMethod === method ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                             >
                                {method}
                             </button>
                          ))}
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <Check size={16} /> Status Financeiro
                       </label>
                       <div className="space-y-2">
                          <button
                             onClick={() => setPaymentStatus('Pago')}
                             className={`w-full py-3 px-4 rounded-lg border flex items-center justify-between transition-all ${paymentStatus === 'Pago' ? 'bg-green-50 border-green-500 text-green-800 ring-1 ring-green-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                             <span className="font-medium">Pago</span>
                             {paymentStatus === 'Pago' && <Check size={18} />}
                          </button>
                          
                          <button
                             onClick={() => setPaymentStatus('A Receber')}
                             className={`w-full py-3 px-4 rounded-lg border flex items-center justify-between transition-all ${paymentStatus === 'A Receber' ? 'bg-yellow-50 border-yellow-500 text-yellow-800 ring-1 ring-yellow-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                             <span className="font-medium">A Receber (Fiado)</span>
                             {paymentStatus === 'A Receber' && <Check size={18} />}
                          </button>

                          <button
                             onClick={() => setPaymentStatus('Não Pago')}
                             className={`w-full py-3 px-4 rounded-lg border flex items-center justify-between transition-all ${paymentStatus === 'Não Pago' ? 'bg-red-50 border-red-500 text-red-800 ring-1 ring-red-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                             <span className="font-medium">Não Pago</span>
                             {paymentStatus === 'Não Pago' && <Check size={18} />}
                          </button>
                       </div>
                    </div>
                 </div>
               </div>
             </div>

             <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                <button 
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleFinalizeSale}
                  className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-900/20 flex items-center gap-2"
                >
                  <Check size={20} />
                  CONFIRMAR VENDA
                </button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL: SALES HISTORY & ESTORNO */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col animate-scale-in">
             <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 rounded-t-xl">
               <div>
                 <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                   <History className="text-blue-600" /> Histórico de Vendas (Sessão Atual)
                 </h3>
               </div>
               <div className="flex gap-2 items-center flex-1 justify-end">
                   <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Buscar (Nome, Tel ou Nº Venda)" 
                      className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={historySearchQuery}
                      onChange={(e) => setHistorySearchQuery(e.target.value)}
                    />
                  </div>
                   <button onClick={() => setIsHistoryModalOpen(false)}><X size={24} className="text-gray-400 hover:text-gray-600" /></button>
               </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-0">
               <table className="w-full text-left border-collapse">
                 <thead className="bg-gray-50 text-gray-500 text-xs uppercase sticky top-0 z-10 shadow-sm">
                   <tr>
                     <th className="px-6 py-3">ID / Hora</th>
                     <th className="px-6 py-3">Cliente</th>
                     <th className="px-6 py-3">Produtos</th>
                     <th className="px-6 py-3">Pagamento</th>
                     <th className="px-6 py-3">Total</th>
                     <th className="px-6 py-3">Status</th>
                     <th className="px-6 py-3 text-right">Ação</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {filteredHistory.map((sale) => (
                     <tr key={sale.id} className={`hover:bg-gray-50 transition-colors ${sale.status.includes('Estornado') ? 'opacity-60 bg-gray-50' : ''}`}>
                       <td className="px-6 py-4">
                         <p className="font-bold text-gray-800">#{sale.id}</p>
                         <p className="text-xs text-gray-500">{sale.date}</p>
                       </td>
                       <td className="px-6 py-4 text-sm font-medium text-gray-700">
                         {sale.customerName}
                         {sale.customerPhone && <p className="text-xs text-gray-400 font-normal">{sale.customerPhone}</p>}
                         {sale.customerCpf && <p className="text-xs text-gray-400 font-normal">CPF: {sale.customerCpf}</p>}
                       </td>
                       <td className="px-6 py-4">
                         <div className="max-w-[200px]">
                           {sale.items.map((i, idx) => (
                             <div key={idx} className="mb-1 last:mb-0">
                               <p className="text-xs text-gray-600 truncate">
                                 {i.quantity}x {i.product.name}
                               </p>
                               {i.note && <p className="text-[10px] text-gray-400 italic truncate ml-2">- {i.note}</p>}
                             </div>
                           ))}
                         </div>
                       </td>
                       <td className="px-6 py-4 text-sm text-gray-600">
                         {sale.paymentMethod}
                       </td>
                       <td className="px-6 py-4 font-bold text-gray-800">
                         R$ {sale.total.toFixed(2)}
                       </td>
                       <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(sale.status)}`}>
                           {sale.status}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                           <button 
                            onClick={() => handleViewSale(sale)}
                            className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-all"
                            title="Visualizar Venda"
                           >
                             <Eye size={16} />
                           </button>
                           {!sale.status.includes('Estornado') && (
                             <button 
                              onClick={() => initiateRefund(sale)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded border border-transparent hover:border-red-200 transition-all text-xs font-medium flex items-center gap-1"
                             >
                               <RefreshCcw size={12} /> Estornar
                             </button>
                           )}
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {filteredHistory.length === 0 && (
                 <div className="p-10 text-center text-gray-400">
                   Nenhuma venda encontrada para "{historySearchQuery}".
                 </div>
               )}
             </div>
          </div>
        </div>
      )}

      {/* MODAL: REFUND OPTIONS */}
      {isRefundModalOpen && saleToRefund && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-scale-in">
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
               <h3 className="font-bold text-gray-800 flex items-center gap-2">
                 <RefreshCcw className="text-red-600" /> Realizar Estorno
               </h3>
               <button onClick={() => setIsRefundModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
             </div>
             <div className="p-6">
                <p className="text-gray-600 mb-6 text-center">
                  Como você deseja realizar o estorno da Venda <span className="font-bold text-gray-800">#{saleToRefund.id}</span> no valor de <span className="font-bold text-gray-800">R$ {saleToRefund.total.toFixed(2)}</span>?
                </p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => confirmRefund('CREDIT')}
                    className="w-full p-4 border border-blue-200 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-200 p-2 rounded-lg text-blue-700">
                        <Wallet size={24} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-blue-900">Gerar Crédito na Loja</h4>
                        <p className="text-xs text-blue-600">O valor fica disponível para futuras compras.</p>
                      </div>
                    </div>
                    <Check size={20} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <button 
                    onClick={() => confirmRefund('MONEY')}
                    className="w-full p-4 border border-green-200 bg-green-50 rounded-xl hover:bg-green-100 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-green-200 p-2 rounded-lg text-green-700">
                         <ArrowLeftRight size={24} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-green-900">Devolver Dinheiro</h4>
                        <p className="text-xs text-green-600">Retirada do caixa e devolução ao cliente.</p>
                      </div>
                    </div>
                    <Check size={20} className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
             </div>
             <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
               <button onClick={() => setIsRefundModalOpen(false)} className="text-gray-500 hover:text-gray-700 font-medium">Cancelar</button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW SALE DETAILS */}
      {isViewSaleModalOpen && saleToView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-scale-in flex flex-col max-h-[90vh]">
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
               <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="text-blue-600" size={20} />
                    Detalhes da Venda #{saleToView.id}
                  </h3>
                  <p className="text-xs text-gray-500">{saleToView.date}</p>
               </div>
               <button onClick={() => setIsViewSaleModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
             </div>
             
             <div className="p-6 overflow-y-auto custom-scrollbar">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                   <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Cliente</h4>
                      <p className="font-bold text-gray-800">{saleToView.customerName}</p>
                      {saleToView.customerPhone && <p className="text-sm text-gray-600">{saleToView.customerPhone}</p>}
                      {saleToView.customerCpf && <p className="text-sm text-gray-600">CPF: {saleToView.customerCpf}</p>}
                      {saleToView.customerAddress && <p className="text-sm text-gray-600">Endereço: {saleToView.customerAddress}</p>}
                   </div>
                   <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Pagamento & Status</h4>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Método:</span>
                        <span className="font-medium text-gray-800">{saleToView.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${getStatusColor(saleToView.status)}`}>{saleToView.status}</span>
                      </div>
                   </div>
                </div>

                {/* Items Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                   <table className="w-full text-sm text-left">
                      <thead className="bg-gray-100 text-gray-600 font-medium border-b border-gray-200">
                         <tr>
                            <th className="px-4 py-2">Item</th>
                            <th className="px-4 py-2 text-right">Qtd</th>
                            <th className="px-4 py-2 text-right">Unit.</th>
                            <th className="px-4 py-2 text-right">Desc.</th>
                            <th className="px-4 py-2 text-right">Total</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {saleToView.items.map((item, idx) => (
                            <tr key={idx}>
                               <td className="px-4 py-2">
                                  <p className="text-gray-800 font-medium">{item.product.name}</p>
                                  {item.note && <p className="text-xs text-gray-500 italic">{item.note}</p>}
                               </td>
                               <td className="px-4 py-2 text-right">{item.quantity}</td>
                               <td className="px-4 py-2 text-right">R$ {item.unitPrice.toFixed(2)}</td>
                               <td className="px-4 py-2 text-right text-red-500">{item.discount > 0 ? `- R$ ${item.discount.toFixed(2)}` : '-'}</td>
                               <td className="px-4 py-2 text-right font-bold text-gray-800">
                                  R$ {((item.unitPrice * item.quantity) - item.discount).toFixed(2)}
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>

                {/* Total */}
                <div className="flex justify-end border-t border-gray-100 pt-4">
                   <div className="text-right">
                      <p className="text-sm text-gray-500">Total da Venda</p>
                      <p className="text-3xl font-bold text-blue-600">R$ {saleToView.total.toFixed(2)}</p>
                   </div>
                </div>
             </div>
             
             <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2 rounded-b-xl">
               <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Printer size={18} /> Imprimir Comprovante
               </button>
               <button onClick={() => setIsViewSaleModalOpen(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Fechar</button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};