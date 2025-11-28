
export enum View {
  DASHBOARD = 'DASHBOARD',
  SALES = 'SALES',
  ORDERS = 'ORDERS',
  INVENTORY = 'INVENTORY',
  CUSTOMERS = 'CUSTOMERS',
  CASHIER = 'CASHIER',
  FINANCIAL = 'FINANCIAL',
  REPORTS = 'REPORTS',
  TEAM = 'TEAM',
  SETTINGS = 'SETTINGS'
}

export type OrderStatus = 
  | 'Em Análise' 
  | 'Aguardando Peça' 
  | 'Aguardando Retirada' 
  | 'Não Aprovado' 
  | 'Aprovado' 
  | 'Em Andamento' 
  | 'Finalizado'
  | 'Entregue';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  type: 'SERVICE' | 'PRODUCT';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  image: string;
  type: 'PRODUCT' | 'SERVICE';
  compatible?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  note: string;
  imei?: string;
  serial?: string;
  deviceModel?: string;
}

export interface CompletedSale {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerCpf?: string; 
  customerAddress?: string;
  customerEmail?: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  shippingCost: number;
  deliveryType: 'RETIRADA' | 'ENTREGA';
  date: string; 
  paymentMethod: 'Pix' | 'Dinheiro' | 'Débito' | 'Crédito' | 'Crediário' | 'Outros' | 'Crédito Loja';
  status: 'Pago' | 'A Receber' | 'Não Pago' | 'Estornado' | 'Estornado (Crédito)' | 'Estornado (Dinheiro)' | 'Encomenda';
  refundType?: 'CREDIT' | 'MONEY';
}

export interface Customer {
  id: string;
  name: string;
  cpfOrCnpj: string;
  rg?: string;
  phone: string; // Celular
  email: string;
  
  // Address
  zipCode?: string;
  address: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  
  deviceHistory?: string; 
  notes?: string;
  createdAt: string;
  storeCredit?: number; // Saldo de crédito na loja
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  address?: string;
  device: string;
  model?: string;
  imei?: string;
  defect?: string;
  items?: OrderItem[];
  status: OrderStatus;
  date: string;
  total: number;
}

export interface CashierTransaction {
  id: string;
  type: 'ENTRY' | 'EXIT';
  category: string;
  amount: number;
  description: string;
  date: string;
  operator?: string;
}

export interface DashboardStat {
  label: string;
  value: string | number;
  subValue?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface CardMachine {
  id: string;
  name: string;
  debitRate: number;
  creditSightRate: number;
  installmentRates: number[]; // Index 0 = 1x, Index 1 = 2x, etc.
}

export interface User {
  id: string;
  name: string;
  username: string; // Usuário de acesso
  password?: string; // Senha
  email: string;
  role: string;
  permissions: {
    financial: boolean;
    sales: boolean;
    stock: boolean;
    support: boolean;
    settings: boolean;
    admin: boolean;
  };
}

export interface Goals {
  globalRevenue: number;
  productRevenue: number; // Alterado de accessoryUnits para Revenue (R$)
  serviceRevenue: number;
}

export interface CompanySettings {
  name: string;
  legalName: string;
  cnpj: string;
  ie: string;
  address: string;
  phone1: string;
  phone2: string;
  email: string;
  logo: string;
}
