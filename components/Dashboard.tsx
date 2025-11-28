import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ShoppingBag, DollarSign, Package, TrendingUp, ChevronRight, Smartphone, Wrench, Shield } from 'lucide-react';

// Dados para o Gráfico de Pizza (Categorias)
const PIE_DATA = [
  { name: 'Serviços', value: 12500, color: '#3b82f6' }, // Blue
  { name: 'Acessórios', value: 8400, color: '#10b981' }, // Green
  { name: 'Peças', value: 5600, color: '#8b5cf6' },     // Purple
  { name: 'Outros', value: 2100, color: '#f59e0b' },    // Orange
];

// Dados para Lista de Vendas Recentes
const RECENT_SALES = [
  { id: 1, product: 'Troca de Tela iPhone 11', customer: 'João da Silva', value: 450.00, type: 'SERVICE', time: '14:30' },
  { id: 2, product: 'Película 3D + Capa', customer: 'Maria Oliveira', value: 85.00, type: 'PRODUCT', time: '13:15' },
  { id: 3, product: 'Formatação Notebook', customer: 'Empresa Tech', value: 120.00, type: 'SERVICE', time: '11:45' },
  { id: 4, product: 'Carregador Turbo 20W', customer: 'Pedro Santos', value: 150.00, type: 'PRODUCT', time: '10:20' },
  { id: 5, product: 'Bateria Samsung A51', customer: 'Ana Costa', value: 180.00, type: 'PRODUCT', time: '09:10' },
];

const StatCard: React.FC<{
  title: string;
  value: string;
  subValue: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
}> = ({ title, value, subValue, icon: Icon, iconColor, bgColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-lg w-fit ${bgColor}`}>
      <Icon className={iconColor} size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-xs text-gray-400 mt-1 font-medium">{subValue}</p>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500">Visão geral do desempenho da loja hoje.</p>
        </div>
        <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
           {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Vendas Realizadas" 
          value="142" 
          subValue="+12% em relação a ontem"
          icon={ShoppingBag} 
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard 
          title="Faturamento do Dia" 
          value="R$ 2.450,00" 
          subValue="Meta diária: R$ 2.000"
          icon={DollarSign} 
          iconColor="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard 
          title="Ordens em Aberto" 
          value="8" 
          subValue="3 aguardando peça"
          icon={Wrench} 
          iconColor="text-orange-600"
          bgColor="bg-orange-50"
        />
        <StatCard 
          title="Produtos Baixo Estoque" 
          value="12" 
          subValue="Necessitam reposição"
          icon={Package} 
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
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
                <Tooltip 
                  formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
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
               <p className="text-xs text-gray-400 font-medium">Total</p>
               <p className="text-lg font-bold text-gray-800">R$ 28k</p>
            </div>
          </div>
        </div>

        {/* Right: Recent Sales List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="text-lg font-bold text-gray-800">Vendas Recentes</h3>
                <p className="text-sm text-gray-500">Últimas transações registradas hoje</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                Ver Todas <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="space-y-4">
                {RECENT_SALES.map((sale) => (
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
                            <p className="font-bold text-gray-900">R$ {sale.value.toFixed(2)}</p>
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Concluído</span>
                        </div>
                    </div>
                ))}
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
                <span className="flex items-center gap-1 text-gray-600"><div className="w-2 h-2 rounded-full bg-blue-600"></div> Vendas</span>
                <span className="flex items-center gap-1 text-gray-600"><div className="w-2 h-2 rounded-full bg-purple-600"></div> Serviços</span>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Faturamento Global</span>
                <span className="font-bold text-blue-600">85%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-gray-400 text-right">Meta: R$ 40.000,00</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Venda de Acessórios</span>
                <span className="font-bold text-purple-600">62%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full" style={{ width: '62%' }}></div>
              </div>
              <p className="text-xs text-gray-400 text-right">Meta: 500 Unidades</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Serviços Técnicos</span>
                <span className="font-bold text-green-600">92%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
              <p className="text-xs text-gray-400 text-right">Meta: R$ 15.000,00</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 flex items-start gap-3">
            <div className="bg-white p-2 rounded-full shadow-sm text-blue-600 mt-0.5">
                <Shield size={18} />
            </div>
            <div>
                <h4 className="font-bold text-blue-900 text-sm mb-1">Dica de Gestão</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                    Sua meta de serviços técnicos está quase batida! Considere fazer uma promoção relâmpago de <strong>acessórios</strong> para equilibrar o mix de produtos antes do fim do mês.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};