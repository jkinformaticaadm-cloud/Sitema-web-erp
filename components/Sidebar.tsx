import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Wrench, 
  Package, 
  Users, 
  Wallet, 
  FileText, 
  Briefcase, 
  Settings,
  Menu,
  X,
  PieChart
} from 'lucide-react';
import { View, User } from '../types';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
  currentUser: User;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isMobileOpen, setIsMobileOpen, currentUser }) => {
  
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.SALES, label: 'Vendas', icon: ShoppingCart },
    { id: View.ORDERS, label: 'Ordens de Serviço', icon: Wrench },
    { id: View.INVENTORY, label: 'Produtos / Serviços', icon: Package },
    { id: View.CUSTOMERS, label: 'Clientes', icon: Users },
    { id: View.CASHIER, label: 'Contas / Caixa', icon: Wallet },
    { id: View.FINANCIAL, label: 'Financeiro', icon: PieChart },
    { id: View.REPORTS, label: 'Relatórios', icon: FileText },
    { id: View.TEAM, label: 'Equipe', icon: Briefcase },
    { id: View.SETTINGS, label: 'Configurações', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 z-30 h-screen w-64 bg-[#0f172a] text-gray-300 transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h1 className="text-xl font-bold text-white tracking-tight">RTJK INFOCELL</h1>
            <button className="md:hidden" onClick={() => setIsMobileOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {/* User Profile Summary */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser.role}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onChangeView(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                      : 'hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          
          <div className="p-4 text-xs text-center text-slate-600">
            v2.5.1 Build 2024
          </div>
        </div>
      </aside>
    </>
  );
};