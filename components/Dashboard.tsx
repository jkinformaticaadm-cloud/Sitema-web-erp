import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ShoppingBag, DollarSign, Package, TrendingUp, ChevronRight, Smartphone, Wrench, Shield, Eye, EyeOff } from 'lucide-react';
import { Goals, Order, CompletedSale } from '../types';

// Dados para o Gráfico de Pizza (Categorias)
const PIE_DATA = [
  { name: 'Serviços', value: 12500, color: '#3b82f6' }, // Blue
  { name: 'Acessórios', value: 8400, color: '#10b981' }, // Green
  { name: 'Peças', value: 5600, color: '#8b5cf6' },     // Purple
  { name: 'Outros', value: 2100, color: '#f59e0b' },    // Orange
];

const StatCard: React.FC<{
  title: string;
  value: string;
  subValue: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  visible?: boolean;
}> = ({ title, value, subValue, icon: Icon, iconColor, bgColor, visible = true }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-lg w-fit ${bgColor}`}>
      <Icon className={iconColor} size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 transition-all">
        {visible ? value : '••••••'}
      </h3>
      <p className="text-xs text-gray-400 mt-1 font-medium">
        {visible ? subValue : '---'}
      </p>
    </div>
  </div>
);

interface DashboardProps {
  goals: Goals;
}

export const Dashboard: React.FC<DashboardProps> = ({ goals }) => {
  const [showValues, setShowValues] = useState(true);

  // Read current data from LocalStorage to make dashboard live
  const orders: Order[] = useMemo(() => {
    try {
        const saved = localStorage.getItem('techfix_orders');
        return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
  }, []);

  const sales: CompletedSale[] = useMemo(() => {
    try {
        const saved = localStorage.getItem('techfix_sales');
        return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  }, []);

  // Calculate Real Stats based on data
  const currentServiceRevenue = orders
    .filter(o => o.status === 'Finalizado' || o.status === 'Entregue')
    .reduce((acc, curr) => acc + curr.total, 0);

  const currentProductRevenue = sales
    .filter(s => s.status === 'Pago' || s.status === 'A Receber')
    .reduce((acc, curr) => acc + curr.total, 0);

  const currentGlobalRevenue = currentServiceRevenue + currentProductRevenue;

  // Calculate percentages based on dynamic goals (avoid division by zero)
  const globalRevenuePercent = Math.min(100, Math.round((currentGlobalRevenue / (goals.globalRevenue || 1)) * 100));
  const productRevenuePercent = Math.min(100, Math.round((currentProductRevenue / (goals.productRevenue || 1)) * 100));
  const serviceRevenuePercent = Math.min(100, Math.round((currentServiceRevenue / (goals.serviceRevenue || 1)) * 100));

  // Recent sales for list
  const recentSalesList = [
      ...orders.map(o => ({ id: o.id, product: o.device, customer: o.customerName, value: o.total, type: 'SERVICE', time: o.date })),
      ...sales.map(s => ({ id: s.id, product: 'Venda de Produtos', customer: s.customerName, value: s.total, type: 'PRODUCT', time: s.date }))
  ].sort((a,b) => {
      // Very basic sort, ideally would parse dates
      return 0.5 - Math.random(); 
  }).slice(0, 5);


  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
              <button 
                onClick={() => setShowValues(!showValues)}
                className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                title={showValues ? "Ocultar valores" : "Mostrar valores"}
              >
                {showValues ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            <p className="text-gray-500">Visão geral do desempenho da loja hoje.</p>
          </div>
        </div>
        <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
           {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Vendas Realizadas" 
          value={sales.length.toString()} 
          subValue="+12% em relação a ontem"
          icon={ShoppingBag} 
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
          visible={showValues}
        />
        <StatCard 
          title="Faturamento Total" 
          value={`R$ ${currentGlobalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          subValue={`Meta: R$ ${goals.globalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign} 
          iconColor="text-green-600"
          bgColor="bg-green-50"
          visible={showValues}
        />
        <StatCard 
          title="Ordens em Aberto" 
          value={orders.filter(o => o.status !== 'Finalizado' && o.status !== 'Entregue' && o.status !== 'Não Aprovado').length.toString()} 
          subValue="Aguardando conclusão"
          icon={Wrench} 
          iconColor="text-orange-600"
          bgColor="bg-orange-50"
          visible={showValues}
        />
        <StatCard 
          title="Produtos Baixo Estoque" 
          value="12" 
          subValue="Necessitam reposição"
          icon={Package} 
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
          visible={showValues}
        />
      </div>

      {/* Main Section: Chart & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Round Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Categorias Vendidas</h3>
          <p className="text-sm text-gray-500 mb-6">Distribuição do faturamento mensal</p>
          
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {showValues && (
                  <Tooltip 
                    formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                )}
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value, entry: any) => <span className="text-sm text-gray-600 ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center -mt-4">
               <p className="text-xs text-gray-400 font-medium">Total Estimado</p>
               <p className="text-lg font-bold text-gray-800">
                 {showValues ? 'R$ 28k' : '••••••'}
               </p>
            </div>
          </div>
        </div>

        {/* Right: Recent Sales List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="text-lg font-bold text-gray-800">Movimentações Recentes</h3>
                <p className="text-sm text-gray-500">Últimas transações registradas hoje</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                Ver Todas <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="space-y-4">
                {recentSalesList.length > 0 ? recentSalesList.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl border border-gray-50 hover:border-gray-100 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${sale.type === 'SERVICE' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                {sale.type === 'SERVICE' ? <Wrench size={20} /> : <Smartphone size={20} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{sale.product}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <p className="text-xs text-gray-500 font-medium">{sale.customer}</p>
                                    <span className="text-[10px] text-gray-300">•</span>
                                    <p className="text-xs text-gray-400">{sale.time}</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-900">
                              {showValues ? `R$ ${sale.value.toFixed(2)}` : '••••••'}
                            </p>
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Concluído</span>
                        </div>
                    </div>
                )) : (
                    <div className="text-center text-gray-400 py-8">Nenhuma venda recente</div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Goals */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
             <h3 className="text-lg font-bold text-gray-800">Metas do Mês</h3>
             <div className="flex gap-2 text-sm">
                <span className="flex items-center gap-1 text-gray-600"><div className="w-2 h-2 rounded-full bg-blue-600"></div> Faturamento Global</span>
                <span className="flex items-center gap-1 text-gray-600"><div className="w-2 h-2 rounded-full bg-purple-600"></div> Vendas Produtos</span>
                <span className="flex items-center gap-1 text-gray-600"><div className="w-2 h-2 rounded-full bg-green-600"></div> Serviços</span>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Faturamento Global</span>
                <span className="font-bold text-blue-600">{globalRevenuePercent}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${globalRevenuePercent}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                 <span>Atual: {showValues ? `R$ ${currentGlobalRevenue.toLocaleString('pt-BR')}` : '••••••'}</span>
                 <span>Meta: {showValues ? `R$ ${goals.globalRevenue.toLocaleString('pt-BR')}` : '••••••'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Vendas (Produtos)</span>
                <span className="font-bold text-purple-600">{productRevenuePercent}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${productRevenuePercent}%` }}></div>
              </div>
               <div className="flex justify-between text-xs text-gray-500">
                 <span>Atual: {showValues ? `R$ ${currentProductRevenue.toLocaleString('pt-BR')}` : '••••••'}</span>
                 <span>Meta: {showValues ? `R$ ${goals.productRevenue.toLocaleString('pt-BR')}` : '••••••'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Serviços Técnicos</span>
                <span className="font-bold text-green-600">{serviceRevenuePercent}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${serviceRevenuePercent}%` }}></div>
              </div>
               <div className="flex justify-between text-xs text-gray-500">
                 <span>Atual: {showValues ? `R$ ${currentServiceRevenue.toLocaleString('pt-BR')}` : '••••••'}</span>
                 <span>Meta: {showValues ? `R$ ${goals.serviceRevenue.toLocaleString('pt-BR')}` : '••••••'}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 flex items-start gap-3">
            <div className="bg-white p-2 rounded-full shadow-sm text-blue-600 mt-0.5">
                <Shield size={18} />
            </div>
            <div>
                <h4 className="font-bold text-blue-900 text-sm mb-1">Dica de Gestão</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                    Mantenha suas metas atualizadas nas configurações para acompanhar o crescimento real da sua loja. 
                    {serviceRevenuePercent < 50 ? " Que tal focar em divulgar seus serviços esta semana?" : " Ótimo trabalho com os serviços técnicos!"}
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};