import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ShoppingBag, DollarSign, Package, TrendingUp } from 'lucide-react';

const data = [
  { name: '2024-05', Custo: 12000, Faturamento: 19000, Lucro: 7000 },
  { name: '2024-06', Custo: 11000, Faturamento: 21000, Lucro: 10000 },
  { name: '2024-07', Custo: 14000, Faturamento: 20000, Lucro: 6000 },
  { name: '2024-08', Custo: 10000, Faturamento: 24000, Lucro: 14000 },
  { name: '2024-09', Custo: 13000, Faturamento: 25000, Lucro: 12000 },
  { name: '2024-10', Custo: 15000, Faturamento: 28000, Lucro: 13000 },
  { name: '2024-11', Custo: 14000, Faturamento: 32000, Lucro: 18000 },
];

const StatCard: React.FC<{
  title: string;
  value: string;
  subValue: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
}> = ({ title, value, subValue, icon: Icon, iconColor, bgColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
    <div className={`p-3 rounded-lg w-fit ${bgColor}`}>
      <Icon className={iconColor} size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-400 mt-1">{subValue}</p>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500">Visão geral do desempenho da empresa</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Qtd. de vendas realizadas" 
          value="142" 
          subValue="Hoje: 12"
          icon={ShoppingBag} 
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard 
          title="Ticket médio" 
          value="R$ 180,00" 
          subValue="+15% este mês"
          icon={DollarSign} 
          iconColor="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard 
          title="Qtd. de produtos vendidos" 
          value="356" 
          subValue="Baixo estoque: 4"
          icon={Package} 
          iconColor="text-orange-600"
          bgColor="bg-orange-50"
        />
        <StatCard 
          title="Média de produtos por venda" 
          value="2.5" 
          subValue="Meta: 3.0"
          icon={TrendingUp} 
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Main Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Evolução de Vendas</h3>
          <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-blue-500">
            <option>Últimos 6 meses</option>
            <option>Este Ano</option>
          </select>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value / 1000}k`} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Custo" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Custo" barSize={40} />
              <Bar dataKey="Faturamento" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Faturamento" barSize={40} />
              <Bar dataKey="Lucro" fill="#10b981" radius={[4, 4, 0, 0]} name="Lucro" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity & Goals Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Vendas Recentes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Cliente</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3 rounded-r-lg">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">João da Silva {i}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        Concluído
                      </span>
                    </td>
                    <td className="px-4 py-3">R$ {150 * i},00</td>
                    <td className="px-4 py-3 text-gray-500">Hoje, 14:30</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Metas do Mês</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Vendas (Carlos)</span>
                <span className="font-bold text-gray-900">85%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Vendas (Ana)</span>
                <span className="font-bold text-gray-900">62%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Serviços Técnicos</span>
                <span className="font-bold text-gray-900">92%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-1">Dica do dia</h4>
            <p className="text-sm text-blue-600">Verifique os produtos com baixo estoque para evitar perda de vendas no fim de semana.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
