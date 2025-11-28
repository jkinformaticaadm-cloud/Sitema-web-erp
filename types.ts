export enum View {
  DASHBOARD = 'DASHBOARD',
  SALES = 'SALES',
  ORDERS = 'ORDERS',
  INVENTORY = 'INVENTORY',
  CUSTOMERS = 'CUSTOMERS',
  CASHIER = 'CASHIER',
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
}

export interface Sale {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'Completed' | 'Pending';
  paymentMethod: 'Credit Card' | 'Cash' | 'Pix';
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