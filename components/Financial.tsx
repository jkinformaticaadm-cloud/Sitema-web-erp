import React, { useState } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Activity, 
  Plus, 
  Trash2, 
  Save, 
  DollarSign,
  Calendar,
  FileText,
  Landmark,
  Smartphone,
  QrCode,
  Filter,
  Download,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { CardMachine } from '../types';

type FinancialTab = 'PAYABLES' | 'RECEIVABLES' | 'DRE' | 'CASH_FLOW' | 'PAYMENT_METHODS';

interface PixConfig {
  id: string;
  name: string; // Nome da máquina ou Nome do Banco
  rate: number; // Taxa percentual
}

export const Financial: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinancialTab>('PAYMENT_METHODS');

  // --- PAYMENT METHODS STATE ---
  const [machines, setMachines] = useState<CardMachine[]>([
    {
      id: '1',
      name: 'Moderninha Pro',
      debitRate: 1.99,
      creditSightRate: 3.19,
      installmentRates: Array(18).fill(0).map((_, i) => (i === 0 ? 3.79 : 4.59 + (i * 1.5))) // Mock initial data
    }
  ]);

  const [pixTerminals, setPixTerminals] = useState<PixConfig[]>([
    { id: '1', name: 'Pix Cielo', rate: 0.99 }
  ]);

  const [pixBanks, setPixBanks] = useState<PixConfig[]>([
    { id: '1', name: 'Pix Itaú CNPJ', rate: 0.00 }
  ]);

  // --- CARD MACHINE ACTIONS ---
  const handleAddMachine = () => {
    const newMachine: CardMachine = {
      id: Date.now().toString(),
      name: '',
      debitRate: 0,
      creditSightRate: 0,
      installmentRates: Array(18).fill(0)
    };
    setMachines([...machines, newMachine]);
  };

  const handleRemoveMachine = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta máquina?')) {
      setMachines(machines.filter(m => m.id !== id));
    }
  };

  const updateMachine = (id: string, field: keyof CardMachine, value: any) => {
    setMachines(machines.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const updateInstallmentRate = (machineId: string, index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    setMachines(machines.map(m => {
      if (m.id === machineId) {
        const newRates = [...m.installmentRates];
        newRates[index] = numValue;
        return { ...m, installmentRates: newRates };
      }
      return m;
    }));
  };

  // --- PIX ACTIONS ---
  const handleAddPixTerminal = () => {
    setPixTerminals([...pixTerminals, { id: Date.now().toString(), name: '', rate: 0 }]);
  };

  const handleRemovePixTerminal = (id: string) => {
    setPixTerminals(pixTerminals.filter(p => p.id !== id));
  };

  const updatePixTerminal = (id: string, field: keyof PixConfig, value: any) => {
    setPixTerminals(pixTerminals.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleAddPixBank = () => {
    setPixBanks([...pixBanks, { id: Date.now().toString(), name: '', rate: 0 }]);
  };

  const handleRemovePixBank = (id: string) => {
    setPixBanks(pixBanks.filter(p => p.id !== id));
  };

  const updatePixBank = (id: string, field: keyof PixConfig, value: any) => {
    setPixBanks(pixBanks.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // --- RENDER DEMOS ---

  const renderPayables = () => (
    <div className="space-y-6 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">Vencendo Hoje</p>
                    <h3 className="text-2xl font-bold text-red-600">R$ 2.450,00</h3>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-red-500"><Calendar size={24}/></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">Próximos 7 dias</p>
                    <h3 className="text-2xl font-bold text-orange-600">R$ 5.120,00</h3>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg text-orange-500"><Clock size={24}/></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">Total a Pagar (Mês)</p>
                    <h3 className="text-2xl font-bold text-gray-800">R$ 12.890,00</h3>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-gray-500"><TrendingDown size={24}/></div>
            </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex justify-between items-center">
            <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                    <Filter size={16}/> Filtrar
                </button>
                <div className="relative">
                    <input type="text" placeholder="Buscar conta..." className="pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm outline-none w-64 bg-white text-gray-900" />
                </div>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-red-700">
                <Plus size={16}/> Nova Conta
            </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                    <tr>
                        <th className="px-6 py-3">Vencimento</th>
                        <th className="px-6 py-3">Descrição</th>
                        <th className="px-6 py-3">Categoria</th>
                        <th className="px-6 py-3">Valor</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {[
                        { date: '10/11/2024', desc: 'Aluguel Loja 01', cat: 'Aluguel', val: 2500, status: 'Pendente' },
                        { date: '10/11/2024', desc: 'Fornecedor Peças SP', cat: 'Fornecedores', val: 1250.50, status: 'Pendente' },
                        { date: '12/11/2024', desc: 'Conta de Energia', cat: 'Utilidades', val: 450.00, status: 'Agendado' },
                        { date: '05/11/2024', desc: 'Internet Fibra', cat: 'Utilidades', val: 120.00, status: 'Pago' },
                    ].map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className={`px-6 py-4 font-medium ${item.status === 'Pendente' ? 'text-red-600' : 'text-gray-600'}`}>{item.date}</td>
                            <td className="px-6 py-4 text-gray-800">{item.desc}</td>
                            <td className="px-6 py-4 text-gray-500">{item.cat}</td>
                            <td className="px-6 py-4 font-bold text-gray-800">R$ {item.val.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    item.status === 'Pago' ? 'bg-green-100 text-green-700' : 
                                    item.status === 'Pendente' ? 'bg-red-100 text-red-700' : 
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right text-gray-400">
                                <button className="hover:text-blue-600"><FileText size={18}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderReceivables = () => (
    <div className="space-y-6 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-green-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">Disponível Hoje</p>
                    <h3 className="text-2xl font-bold text-green-600">R$ 890,00</h3>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-green-500"><DollarSign size={24}/></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">A Receber (Cartão)</p>
                    <h3 className="text-2xl font-bold text-blue-600">R$ 4.350,00</h3>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-blue-500"><CreditCard size={24}/></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">Total Previsto (Mês)</p>
                    <h3 className="text-2xl font-bold text-gray-800">R$ 18.200,00</h3>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-gray-500"><TrendingUp size={24}/></div>
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-700">Previsão de Recebimentos</h3>
                <button className="text-blue-600 text-sm font-medium hover:underline">Ver Extrato Completo</button>
            </div>
            <table className="w-full text-left text-sm">
                <thead className="bg-white text-gray-500 uppercase font-semibold border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-3">Data Prevista</th>
                        <th className="px-6 py-3">Origem</th>
                        <th className="px-6 py-3">Parcela</th>
                        <th className="px-6 py-3">Valor Líquido</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {[
                        { date: '10/11/2024', orig: 'Pix Máquina Cielo', parc: 'À vista', val: 450.00, status: 'Disponível' },
                        { date: '10/11/2024', orig: 'Pix Conta Itaú', parc: 'À vista', val: 120.00, status: 'Disponível' },
                        { date: '11/11/2024', orig: 'Stone Crédito', parc: '1/3', val: 320.50, status: 'Agendado' },
                        { date: '15/11/2024', orig: 'Moderninha Débito', parc: 'À vista', val: 180.00, status: 'Agendado' },
                        { date: '20/11/2024', orig: 'Stone Crédito', parc: '2/3', val: 320.50, status: 'Futuro' },
                    ].map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-600">{item.date}</td>
                            <td className="px-6 py-4 font-medium text-gray-800">{item.orig}</td>
                            <td className="px-6 py-4 text-gray-500">{item.parc}</td>
                            <td className="px-6 py-4 font-bold text-green-600">R$ {item.val.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    item.status === 'Disponível' ? 'bg-green-100 text-green-700' : 
                                    item.status === 'Futuro' ? 'bg-gray-100 text-gray-600' : 
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {item.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderDRE = () => (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Demonstrativo de Resultados (Outubro/2024)</h3>
            <div className="flex gap-2">
                <button className="p-2 border rounded hover:bg-gray-50"><Calendar size={18}/></button>
                <button className="p-2 border rounded hover:bg-gray-50"><Download size={18}/></button>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Revenue */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-blue-50/50">
                <span className="font-bold text-gray-800">(+) RECEITA BRUTA</span>
                <span className="font-bold text-blue-600">R$ 45.000,00</span>
            </div>
            <div className="p-3 pl-8 text-sm text-gray-600 border-b border-gray-50 flex justify-between">
                <span>Venda de Produtos</span>
                <span>R$ 25.000,00</span>
            </div>
            <div className="p-3 pl-8 text-sm text-gray-600 border-b border-gray-50 flex justify-between">
                <span>Serviços Prestados</span>
                <span>R$ 20.000,00</span>
            </div>

            {/* Deductions */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-red-50/30">
                <span className="font-bold text-gray-800">(-) DEDUÇÕES DA RECEITA</span>
                <span className="font-bold text-red-500">R$ 3.150,00</span>
            </div>
            <div className="p-3 pl-8 text-sm text-gray-600 border-b border-gray-50 flex justify-between">
                <span>Impostos (Simples)</span>
                <span>R$ 2.700,00</span>
            </div>
            <div className="p-3 pl-8 text-sm text-gray-600 border-b border-gray-50 flex justify-between">
                <span>Taxas Cartão/Pix</span>
                <span>R$ 450,00</span>
            </div>

            {/* Net Revenue */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-100 font-bold">
                <span className="text-gray-900">(=) RECEITA LÍQUIDA</span>
                <span className="text-gray-900">R$ 41.850,00</span>
            </div>

            {/* Variable Costs */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-700">(-) CUSTOS VARIÁVEIS (CMV/CSV)</span>
                <span className="font-bold text-red-500">R$ 12.000,00</span>
            </div>

            {/* Contribution Margin */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-green-50/50">
                <span className="font-bold text-green-800">(=) MARGEM DE CONTRIBUIÇÃO</span>
                <span className="font-bold text-green-700">R$ 29.850,00</span>
            </div>

            {/* Fixed Costs */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-700">(-) DESPESAS FIXAS / OPERACIONAIS</span>
                <span className="font-bold text-red-500">R$ 9.500,00</span>
            </div>
             <div className="p-3 pl-8 text-sm text-gray-600 border-b border-gray-50 flex justify-between">
                <span>Aluguel, Água, Luz, Internet</span>
                <span>R$ 3.500,00</span>
            </div>
            <div className="p-3 pl-8 text-sm text-gray-600 border-b border-gray-50 flex justify-between">
                <span>Folha de Pagamento</span>
                <span>R$ 6.000,00</span>
            </div>

            {/* Net Profit */}
            <div className="p-6 flex justify-between items-center bg-gray-800 text-white rounded-b-xl mt-4 m-2">
                <div>
                    <span className="block text-sm text-gray-400 uppercase tracking-wider">Resultado Líquido</span>
                    <span className="block text-2xl font-bold">(=) Lucro Operacional</span>
                </div>
                <div className="text-right">
                    <span className="block text-3xl font-bold text-green-400">R$ 20.350,00</span>
                    <span className="block text-sm text-gray-400">Margem Líquida: 45%</span>
                </div>
            </div>
        </div>
    </div>
  );

  const renderCashFlow = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart placeholder */}
            <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Evolução do Saldo (Últimos 7 dias)</h3>
                <div className="h-48 flex items-end justify-between gap-2 px-4">
                    {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                        <div key={i} className="w-full flex flex-col justify-end group">
                             <div 
                                className="bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600 relative" 
                                style={{height: `${h}%`}}
                             >
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100">
                                    R$ {h}k
                                </span>
                             </div>
                             <span className="text-xs text-center text-gray-400 mt-2">Dia {i+1}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-700">Fluxo Diário Detalhado</h3>
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border px-3 py-1 rounded bg-white">
                    <Calendar size={14}/> Este Mês
                </button>
            </div>
            <table className="w-full text-left text-sm">
                <thead className="bg-white text-gray-500 uppercase font-semibold border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-3">Data</th>
                        <th className="px-6 py-3">Descrição Resumida</th>
                        <th className="px-6 py-3 text-right text-green-600">Entradas</th>
                        <th className="px-6 py-3 text-right text-red-600">Saídas</th>
                        <th className="px-6 py-3 text-right text-blue-600">Saldo Acumulado</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {[
                        { date: '10/11/2024', desc: 'Vendas e Pagamentos', in: 3500.00, out: 1200.00, bal: 15450.00 },
                        { date: '09/11/2024', desc: 'Movimento Sábado', in: 5200.00, out: 450.00, bal: 13150.00 },
                        { date: '08/11/2024', desc: 'Vendas e Aluguel', in: 2800.00, out: 2500.00, bal: 8400.00 },
                        { date: '07/11/2024', desc: 'Movimento Diário', in: 1900.00, out: 200.00, bal: 8100.00 },
                    ].map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-mono text-gray-600">{item.date}</td>
                            <td className="px-6 py-4 text-gray-800">{item.desc}</td>
                            <td className="px-6 py-4 text-right font-medium text-green-600">+ {item.in.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right font-medium text-red-600">- {item.out.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right font-bold text-blue-700">R$ {item.bal.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="space-y-8 animate-fade-in">
      
      {/* SECTION: PIX CONFIGURATION */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <QrCode className="text-green-600" /> Configurações de Pix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pix Machine Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Smartphone size={20} className="text-green-700" />
                        <h4 className="font-bold text-green-800">Pix Máquina</h4>
                    </div>
                    <button onClick={handleAddPixTerminal} className="text-green-700 hover:bg-green-100 p-1.5 rounded-lg transition-colors">
                        <Plus size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-4 flex-1">
                    <p className="text-xs text-gray-500 mb-2">Cadastre os nomes e taxas das máquinas que recebem Pix.</p>
                    {pixTerminals.map((pix) => (
                        <div key={pix.id} className="flex gap-2 items-center group">
                            <input 
                                type="text" 
                                value={pix.name}
                                onChange={(e) => updatePixTerminal(pix.id, 'name', e.target.value)}
                                placeholder="Nome (ex: Pix Cielo)"
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm bg-white text-gray-900"
                            />
                            <div className="relative w-24">
                                <input 
                                    type="number" 
                                    value={pix.rate}
                                    step="0.01"
                                    onChange={(e) => updatePixTerminal(pix.id, 'rate', parseFloat(e.target.value))}
                                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm pr-6 bg-white text-gray-900"
                                    placeholder="0.00"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                            </div>
                            <button 
                                onClick={() => handleRemovePixTerminal(pix.id)}
                                className="text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {pixTerminals.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">Nenhuma opção cadastrada.</p>}
                </div>
            </div>

            {/* Pix Bank/CNPJ Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Landmark size={20} className="text-blue-700" />
                        <h4 className="font-bold text-blue-800">Pix Conta / CNPJ</h4>
                    </div>
                    <button onClick={handleAddPixBank} className="text-blue-700 hover:bg-blue-100 p-1.5 rounded-lg transition-colors">
                        <Plus size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-4 flex-1">
                    <p className="text-xs text-gray-500 mb-2">Cadastre bancos e taxas para recebimento via chave Pix.</p>
                    {pixBanks.map((pix) => (
                        <div key={pix.id} className="flex gap-2 items-center group">
                            <input 
                                type="text" 
                                value={pix.name}
                                onChange={(e) => updatePixBank(pix.id, 'name', e.target.value)}
                                placeholder="Nome (ex: Pix Itaú)"
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white text-gray-900"
                            />
                            <div className="relative w-24">
                                <input 
                                    type="number" 
                                    value={pix.rate}
                                    step="0.01"
                                    onChange={(e) => updatePixBank(pix.id, 'rate', parseFloat(e.target.value))}
                                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm pr-6 bg-white text-gray-900"
                                    placeholder="0.00"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                            </div>
                            <button 
                                onClick={() => handleRemovePixBank(pix.id)}
                                className="text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {pixBanks.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">Nenhuma opção cadastrada.</p>}
                </div>
            </div>
        </div>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      {/* SECTION: CARD MACHINES */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <CreditCard className="text-purple-600" /> Cadastro de Máquinas de Cartão
            </h3>
            <p className="text-gray-500 text-sm">Configure as taxas de débito e crédito.</p>
            </div>
            <button 
            onClick={handleAddMachine}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
            >
            <Plus size={18} />
            Adicionar Nova Máquina
            </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
            {machines.map((machine) => (
            <div key={machine.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                {/* Machine Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3 flex-1">
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                    <CreditCard size={20} />
                    </div>
                    <input 
                    type="text" 
                    value={machine.name}
                    onChange={(e) => updateMachine(machine.id, 'name', e.target.value)}
                    placeholder="Nome da Máquina (Ex: Cielo, Stone)"
                    className="bg-transparent font-bold text-gray-800 text-lg outline-none border-b border-dashed border-gray-300 focus:border-purple-500 placeholder-gray-400 w-full max-w-md"
                    />
                </div>
                <button 
                    onClick={() => handleRemoveMachine(machine.id)}
                    className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remover Máquina"
                >
                    <Trash2 size={20} />
                </button>
                </div>

                <div className="p-6">
                {/* Main Rates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <label className="block text-sm font-semibold text-green-800 mb-1">Taxa Débito (%)</label>
                    <div className="relative">
                        <input 
                        type="number" 
                        step="0.01"
                        value={machine.debitRate}
                        onChange={(e) => updateMachine(machine.id, 'debitRate', parseFloat(e.target.value))}
                        className="w-full pl-3 pr-8 py-2 bg-white border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-bold text-green-700"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 font-bold">%</span>
                    </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <label className="block text-sm font-semibold text-blue-800 mb-1">Taxa Crédito à Vista (%)</label>
                    <div className="relative">
                        <input 
                        type="number" 
                        step="0.01"
                        value={machine.creditSightRate}
                        onChange={(e) => updateMachine(machine.id, 'creditSightRate', parseFloat(e.target.value))}
                        className="w-full pl-3 pr-8 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-700"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 font-bold">%</span>
                    </div>
                    </div>
                </div>

                {/* Installment Rates Grid */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-purple-500"/> Taxas de Crédito Parcelado
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {machine.installmentRates.map((rate, index) => (
                        <div key={index} className="relative group">
                        <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">
                            Crédito {index + 1}x
                        </label>
                        <div className="relative">
                            <input 
                            type="number" 
                            step="0.01"
                            value={rate}
                            onChange={(e) => updateInstallmentRate(machine.id, index, e.target.value)}
                            className="w-full pl-2 pr-6 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-500 outline-none transition-all bg-white text-gray-900"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">%</span>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
                
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                        <Save size={16} /> Salvar Alterações
                    </button>
                </div>
            </div>
            ))}

            {machines.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <CreditCard className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">Nenhuma máquina cadastrada</h3>
                <p className="text-gray-500">Adicione uma máquina para configurar as taxas.</p>
            </div>
            )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Módulo Financeiro</h2>
          <p className="text-gray-500">Gestão completa de contas, resultados e taxas.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex overflow-x-auto">
        {[
            { id: 'PAYABLES', label: 'Contas a Pagar', icon: TrendingDown },
            { id: 'RECEIVABLES', label: 'Contas a Receber', icon: TrendingUp },
            { id: 'DRE', label: 'DRE Gerencial', icon: FileText },
            { id: 'CASH_FLOW', label: 'Fluxo de Caixa', icon: Activity },
            { id: 'PAYMENT_METHODS', label: 'Formas de Pagamento', icon: CreditCard },
        ].map((tab) => {
            const Icon = tab.icon;
            return (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as FinancialTab)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                        ${activeTab === tab.id 
                            ? 'bg-blue-50 text-blue-700 shadow-sm' 
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                >
                    <Icon size={18} />
                    {tab.label}
                </button>
            );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pb-6 custom-scrollbar">
          {activeTab === 'PAYMENT_METHODS' && renderPaymentMethods()}
          {activeTab === 'PAYABLES' && renderPayables()}
          {activeTab === 'RECEIVABLES' && renderReceivables()}
          {activeTab === 'DRE' && renderDRE()}
          {activeTab === 'CASH_FLOW' && renderCashFlow()}
      </div>
    </div>
  );
};