
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
  fee?: number;      // Valor da taxa descontada
  netTotal?: number; // Valor líquido recebido
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
  fee?: number;      // Valor da taxa
  netTotal?: number; // Valor líquido
  paymentMethod?: string;
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

export interface PixConfig {
  id: string;
  name: string;
  rate: number;
}

export interface FinancialRecord {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  category: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  type: 'PAYABLE' | 'RECEIVABLE';
  fee?: number;
  netAmount?: number;
}

// --- SUPABASE & SAAS TYPES ---

export interface SupabaseProfile {
  id: string; // Auth ID
  empresa_id: string;
  nome: string;
  email: string;
  plano: 'mensal' | 'trimestral' | 'anual' | 'trial';
  assinatura_status: 'ativa' | 'inativa' | 'vencida';
  assinatura_vencimento: string; // ISO Date
  created_at: string;
}

export interface SupabaseCompany {
  id: string;
  nome: string;
  cnpj?: string;
  telefone?: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  username?: string;
  password?: string;
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
  // Vinculação com dados reais do Supabase
  profile?: SupabaseProfile;
  company?: SupabaseCompany;
}

export interface Goals {
  globalRevenue: number;
  productRevenue: number; 
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
