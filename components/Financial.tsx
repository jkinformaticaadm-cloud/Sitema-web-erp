import React, { useState, useEffect } from 'react';
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
  Clock,
  X
} from 'lucide-react';
import { CardMachine } from '../types';

// ... (Types and Initial Data remain unchanged)

type FinancialTab = 'PAYABLES' | 'RECEIVABLES' | 'DRE' | 'CASH_FLOW' | 'PAYMENT_METHODS';

interface PixConfig {
  id: string;
  name: string;
  rate: number;
}

interface FinancialRecord {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  category: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  type: 'PAYABLE' | 'RECEIVABLE';
}

const INITIAL_MACHINES: CardMachine[] = [
    {
      id: '1',
      name: 'Moderninha Pro',
      debitRate: 1.99,
      creditSightRate: 3.19,
      installmentRates: Array(18).fill(0).map((_, i) => (i === 0 ? 3.79 : 4.59 + (i * 1.5)))
    }
];

const INITIAL_PIX_TERMINALS: PixConfig[] = [
    { id: '1', name: 'Pix Cielo', rate: 0.99 }
];

const INITIAL_PIX_BANKS: PixConfig[] = [
    { id: '1', name: 'Pix Itaú CNPJ', rate: 0.00 }
];

const INITIAL_RECORDS: FinancialRecord[] = [
  { id: '1', description: 'Aluguel Loja', amount: 2500.00, dueDate: '2024-11-10', category: 'Infraestrutura', status: 'PENDING', type: 'PAYABLE' },
  { id: '2', description: 'Fornecedor Peças', amount: 1200.00, dueDate: '2024-11-05', category: 'Fornecedores', status: 'PAID', type: 'PAYABLE' },
  { id: '3', description: 'Internet Fibra', amount: 150.00, dueDate: '2024-11-15', category: 'Infraestrutura', status: 'PENDING', type: 'PAYABLE' },
  { id: '4', description: 'Recebimento Cartão (Antecipação)', amount: 3500.00, dueDate: '2024-11-12', category: 'Cartão de Crédito', status: 'PENDING', type: 'RECEIVABLE' },
];

export const Financial: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinancialTab>('PAYMENT_METHODS');

  // --- PERSISTENCE STATE ---
  const [machines, setMachines] = useState<CardMachine[]>(() => {
    const saved = localStorage.getItem('techfix_machines');
    return saved ? JSON.parse(saved) : INITIAL_MACHINES;
  });

  const [pixTerminals, setPixTerminals] = useState<PixConfig[]>(() => {
    const saved = localStorage.getItem('techfix_pix_terminals');
    return saved ? JSON.parse(saved) : INITIAL_PIX_TERMINALS;
  });

  const [pixBanks, setPixBanks] = useState<PixConfig[]>(() => {
    const saved = localStorage.getItem('techfix_pix_banks');
    return saved ? JSON.parse(saved) : INITIAL_PIX_BANKS;
  });

  const [records, setRecords] = useState<FinancialRecord[]>(() => {
    const saved = localStorage.getItem('techfix_financial_records');
    return saved ? JSON.parse(saved) : INITIAL_RECORDS;
  });

  // --- EFFECTS TO SAVE ---
  useEffect(() => { localStorage.setItem('techfix_machines', JSON.stringify(machines)); }, [machines]);
  useEffect(() => { localStorage.setItem('techfix_pix_terminals', JSON.stringify(pixTerminals)); }, [pixTerminals]);
  useEffect(() => { localStorage.setItem('techfix_pix_banks', JSON.stringify(pixBanks)); }, [pixBanks]);
  useEffect(() => { localStorage.setItem('techfix_financial_records', JSON.stringify(records)); }, [records]);

  // --- MODAL STATES ---
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordForm, setRecordForm] = useState<Partial<FinancialRecord>>({
    description: '', amount: 0, dueDate: '', category: '', type: 'PAYABLE', status: 'PENDING'
  });

  // --- ACTIONS ---

  const handleAddMachine = () => {
    setMachines([...machines, {
      id: Date.now().toString(),
      name: 'Nova Máquina',
      debitRate: 0,
      creditSightRate: 0,
      installmentRates: Array(18).fill(0)
    }]);
  };

  const handleRemoveMachine = (id: string) => {
    if (confirm('Remover esta máquina?')) setMachines(machines.filter(m => m.id !== id));
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

  const handleAddPixTerminal = () => setPixTerminals([...pixTerminals, { id: Date.now().toString(), name: '', rate: 0 }]);
  const handleRemovePixTerminal = (id: string) => setPixTerminals(pixTerminals.filter(p => p.id !== id));
  const updatePixTerminal = (id: string, field: keyof PixConfig, value: any) => setPixTerminals(pixTerminals.map(p => p.id === id ? { ...p, [field]: value } : p));

  const handleAddPixBank = () => setPixBanks([...pixBanks, { id: Date.now().toString(), name: '', rate: 0 }]);
  const handleRemovePixBank = (id: string) => setPixBanks(pixBanks.filter(p => p.id !== id));
  const updatePixBank = (id: string, field: keyof PixConfig, value: any) => setPixBanks(pixBanks.map(p => p.id === id ? { ...p, [field]: value } : p));

  // --- FINANCIAL RECORDS ACTIONS ---
  const handleNewRecord = (type: 'PAYABLE' | 'RECEIVABLE') => {
    setRecordForm({ description: '', amount: 0, dueDate: '', category: '', type, status: 'PENDING' });
    setIsRecordModalOpen(true);
  };

  const handleSaveRecord = () => {
    if (!recordForm.description || !recordForm.amount || !recordForm.dueDate) {
      alert("Preencha descrição, valor e data de vencimento.");
      return;
    }
    const newRecord: FinancialRecord = {
      id: Date.now().toString(),
      description: recordForm.description!,
      amount: Number(recordForm.amount),
      dueDate: recordForm.dueDate!,
      category: recordForm.category || 'Geral',
      type: recordForm.type || 'PAYABLE',
      status: recordForm.status || 'PENDING'
    };
    setRecords([...records, newRecord]);
    setIsRecordModalOpen(false);
  };

  const handleDeleteRecord = (id: string) => {
    if(confirm("Deseja excluir este lançamento?")) setRecords(records.filter(r => r.id !== id));
  };

  const toggleStatus = (id: string) => {
    setRecords(records.map(r => r.id === id ? { ...r, status: r.status === 'PENDING' ? 'PAID' : 'PENDING' } : r));
  };

  // --- CALCULATIONS ---
  const payables = records.filter(r => r.type === 'PAYABLE');
  const receivables = records.filter(r => r.type === 'RECEIVABLE');

  const totalPayables = payables.reduce((acc, r) => acc + r.amount, 0);
  const totalReceivables = receivables.reduce((acc, r) => acc + r.amount, 0);
  const totalPaid = payables.filter(r => r.status === 'PAID').reduce((acc, r) => acc + r.amount, 0);
  const totalReceived = receivables.filter(r => r.status === 'PAID').reduce((acc, r) => acc + r.amount, 0);

  // ... (renderPayables, renderReceivables, renderPaymentMethods remain the same structure logic) ...

  const renderPayables = () => (
    <div className="space-y-6 animate-fade-in">
        {/* ... (Cards and Table) ... */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">Total a Pagar</p>
                    <h3 className="text-2xl font-bold text-red-600">R$ {totalPayables.toFixed(2)}</h3>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-red-600"><TrendingDown size={24}/></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-green-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">Total Pago</p>
                    <h3 className="text-2xl font-bold text-green-600">R$ {totalPaid.toFixed(2)}</h3>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-green-600"><CheckCircle size={24}/></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">Pendente</p>
                    <h3 className="text-2xl font-bold text-gray-800">R$ {(totalPayables - totalPaid).toFixed(2)}</h3>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg text-gray-600"><AlertCircle size={24}/></div>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2"><FileText size={18}/> Contas a Pagar</h3>
                <button onClick={() => handleNewRecord('PAYABLE')} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium flex items-center gap-2">
                    <Plus size={16}/> Nova Conta
                </button>
            </div>
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
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
                    {payables.length > 0 ? payables.map(r => (
                        <tr key={r.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-600"><div className="flex items-center gap-2"><Calendar size={14}/> {r.dueDate}</div></td>
                            <td className="px-6 py-4 font-medium text-gray-800">{r.description}</td>
                            <td className="px-6 py-4 text-gray-500">{r.category}</td>
                            <td className="px-6 py-4 font-bold text-red-600">R$ {r.amount.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                <button onClick={() => toggleStatus(r.id)} className={`px-2 py-1 rounded text-xs font-bold border ${r.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                    {r.status === 'PAID' ? 'PAGO' : 'PENDENTE'}
                                </button>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => handleDeleteRecord(r.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Nenhuma conta a pagar registrada.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderReceivables = () => (
    <div className="space-y-6 animate-fade-in">
        {/* ... (Cards and Table) ... */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">Total a Receber</p>
                    <h3 className="text-2xl font-bold text-blue-600">R$ {totalReceivables.toFixed(2)}</h3>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><TrendingUp size={24}/></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-green-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">Recebido</p>
                    <h3 className="text-2xl font-bold text-green-600">R$ {totalReceived.toFixed(2)}</h3>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-green-600"><CheckCircle size={24}/></div>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2"><FileText size={18}/> Contas a Receber</h3>
                <button onClick={() => handleNewRecord('RECEIVABLE')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2">
                    <Plus size={16}/> Novo Recebimento
                </button>
            </div>
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                    <tr>
                        <th className="px-6 py-3">Data Prevista</th>
                        <th className="px-6 py-3">Descrição</th>
                        <th className="px-6 py-3">Categoria</th>
                        <th className="px-6 py-3">Valor</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {receivables.length > 0 ? receivables.map(r => (
                        <tr key={r.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-600"><div className="flex items-center gap-2"><Calendar size={14}/> {r.dueDate}</div></td>
                            <td className="px-6 py-4 font-medium text-gray-800">{r.description}</td>
                            <td className="px-6 py-4 text-gray-500">{r.category}</td>
                            <td className="px-6 py-4 font-bold text-blue-600">R$ {r.amount.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                <button onClick={() => toggleStatus(r.id)} className={`px-2 py-1 rounded text-xs font-bold border ${r.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                    {r.status === 'PAID' ? 'RECEBIDO' : 'A RECEBER'}
                                </button>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => handleDeleteRecord(r.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    )) : (
                         <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Nenhum recebimento registrado.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="space-y-8 animate-fade-in max-w-5xl">
       {/* ... Content of PaymentMethods ... */}
       <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <CreditCard className="text-blue-600" size={20} /> Máquinas de Cartão
             </h3>
             <button onClick={handleAddMachine} className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium flex items-center gap-1">
                <Plus size={16} /> Adicionar Máquina
             </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
             {machines.map((machine) => (
                <div key={machine.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                   <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="bg-blue-600 p-2 rounded-lg text-white"><CreditCard size={18} /></div>
                         <input 
                            type="text" 
                            value={machine.name}
                            onChange={(e) => updateMachine(machine.id, 'name', e.target.value)}
                            placeholder="Nome da Máquina (ex: Moderninha)"
                            className="bg-transparent font-bold text-gray-800 outline-none border-b border-transparent focus:border-blue-500 transition-colors"
                         />
                      </div>
                      <button onClick={() => handleRemoveMachine(machine.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
                         <Trash2 size={18} />
                      </button>
                   </div>
                   
                   <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                         <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <label className="block text-xs font-bold text-blue-700 uppercase mb-1">Taxa Débito (%)</label>
                            <input 
                               type="number" 
                               step="0.01"
                               value={machine.debitRate}
                               onChange={(e) => updateMachine(machine.id, 'debitRate', parseFloat(e.target.value))}
                               className="w-full bg-white border border-blue-200 rounded px-3 py-2 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                         </div>
                         <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <label className="block text-xs font-bold text-green-700 uppercase mb-1">Crédito à Vista (%)</label>
                            <input 
                               type="number" 
                               step="0.01"
                               value={machine.creditSightRate}
                               onChange={(e) => updateMachine(machine.id, 'creditSightRate', parseFloat(e.target.value))}
                               className="w-full bg-white border border-green-200 rounded px-3 py-2 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                         </div>
                      </div>

                      <div>
                         <h4 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-2">
                             <TrendingUp size={16} /> Taxas de Parcelamento (Crédito)
                         </h4>
                         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {machine.installmentRates.map((rate, idx) => (
                               <div key={idx} className="relative">
                                  <label className="block text-xs text-gray-500 mb-1 font-medium">{idx + 1}x</label>
                                  <div className="relative">
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        value={rate}
                                        onChange={(e) => updateInstallmentRate(machine.id, idx, e.target.value)}
                                        className="w-full pl-2 pr-6 py-2 text-sm border border-gray-200 rounded bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors text-gray-800 font-medium"
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PIX Terminals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex justify-between items-center">
                    <h3 className="font-bold text-purple-800 flex items-center gap-2"><QrCode size={18}/> Pix Maquininha</h3>
                    <button onClick={handleAddPixTerminal} className="p-1 hover:bg-purple-100 rounded text-purple-600"><Plus size={18}/></button>
                </div>
                <div className="p-4 space-y-3">
                    {pixTerminals.map(pix => (
                        <div key={pix.id} className="flex items-center gap-3 p-2 border border-gray-100 rounded-lg hover:bg-gray-50">
                            <input 
                                type="text" 
                                value={pix.name}
                                onChange={(e) => updatePixTerminal(pix.id, 'name', e.target.value)}
                                placeholder="Nome (ex: Cielo)"
                                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-800"
                            />
                            <div className="flex items-center gap-1 w-20 bg-white border border-gray-200 rounded px-2 py-1">
                                <input 
                                    type="number" step="0.01" 
                                    value={pix.rate}
                                    onChange={(e) => updatePixTerminal(pix.id, 'rate', parseFloat(e.target.value))}
                                    className="w-full bg-transparent outline-none text-right text-sm font-bold text-gray-700"
                                />
                                <span className="text-xs text-gray-400">%</span>
                            </div>
                            <button onClick={() => handleRemovePixTerminal(pix.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                    ))}
                    {pixTerminals.length === 0 && <p className="text-xs text-gray-400 text-center py-2">Nenhuma configuração</p>}
                </div>
            </div>

            {/* PIX Bank */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex justify-between items-center">
                    <h3 className="font-bold text-green-800 flex items-center gap-2"><Landmark size={18}/> Pix Bancário (CNPJ)</h3>
                    <button onClick={handleAddPixBank} className="p-1 hover:bg-green-100 rounded text-green-600"><Plus size={18}/></button>
                </div>
                <div className="p-4 space-y-3">
                    {pixBanks.map(pix => (
                        <div key={pix.id} className="flex items-center gap-3 p-2 border border-gray-100 rounded-lg hover:bg-gray-50">
                            <input 
                                type="text" 
                                value={pix.name}
                                onChange={(e) => updatePixBank(pix.id, 'name', e.target.value)}
                                placeholder="Banco (ex: Itaú)"
                                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-800"
                            />
                            <div className="flex items-center gap-1 w-20 bg-white border border-gray-200 rounded px-2 py-1">
                                <input 
                                    type="number" step="0.01" 
                                    value={pix.rate}
                                    onChange={(e) => updatePixBank(pix.id, 'rate', parseFloat(e.target.value))}
                                    className="w-full bg-transparent outline-none text-right text-sm font-bold text-gray-700"
                                />
                                <span className="text-xs text-gray-400">%</span>
                            </div>
                            <button onClick={() => handleRemovePixBank(pix.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                    ))}
                    {pixBanks.length === 0 && <p className="text-xs text-gray-400 text-center py-2">Nenhuma configuração</p>}
                </div>
            </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Financeiro</h2>
          <p className="text-gray-500">Gestão de contas, taxas e fluxo de caixa.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex overflow-x-auto">
        <button onClick={() => setActiveTab('PAYMENT_METHODS')} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'PAYMENT_METHODS' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
            <CreditCard size={18} /> Taxas e Máquinas
        </button>
        <button onClick={() => setActiveTab('PAYABLES')} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'PAYABLES' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
            <TrendingDown size={18} /> Contas a Pagar
        </button>
        <button onClick={() => setActiveTab('RECEIVABLES')} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'RECEIVABLES' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
            <TrendingUp size={18} /> Contas a Receber
        </button>
        <button onClick={() => setActiveTab('CASH_FLOW')} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'CASH_FLOW' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
            <Activity size={18} /> Fluxo de Caixa
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 custom-scrollbar">
          {activeTab === 'PAYMENT_METHODS' && renderPaymentMethods()}
          {activeTab === 'PAYABLES' && renderPayables()}
          {activeTab === 'RECEIVABLES' && renderReceivables()}
          {activeTab === 'CASH_FLOW' && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white rounded-xl border border-gray-100 border-dashed">
                  <Activity size={48} className="mb-4 text-gray-300"/>
                  <h3 className="text-lg font-bold text-gray-600">Relatório de Fluxo de Caixa</h3>
                  <p>Funcionalidade em desenvolvimento. Em breve gráficos detalhados.</p>
              </div>
          )}
      </div>

      {/* Record Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-0 md:p-4">
            <div className="bg-white w-full h-full md:h-auto md:max-w-md md:rounded-xl shadow-2xl flex flex-col animate-scale-in">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
                    <h3 className="text-lg font-bold text-gray-800">
                        {recordForm.type === 'PAYABLE' ? 'Nova Conta a Pagar' : 'Novo Recebimento'}
                    </h3>
                    <button onClick={() => setIsRecordModalOpen(false)}><X size={24} className="text-gray-400"/></button>
                </div>
                <div className="p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900" 
                            value={recordForm.description} onChange={e => setRecordForm({...recordForm, description: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                            <input type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 font-bold" 
                                value={recordForm.amount} onChange={e => setRecordForm({...recordForm, amount: parseFloat(e.target.value)})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vencimento</label>
                            <input type="date" className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900" 
                                value={recordForm.dueDate} onChange={e => setRecordForm({...recordForm, dueDate: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                        <select className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
                            value={recordForm.category} onChange={e => setRecordForm({...recordForm, category: e.target.value})}>
                            <option value="">Selecione...</option>
                            <option value="Fornecedores">Fornecedores</option>
                            <option value="Infraestrutura">Infraestrutura (Luz, Água, Net)</option>
                            <option value="Pessoal">Pessoal / Salários</option>
                            <option value="Impostos">Impostos</option>
                            <option value="Cartão de Crédito">Cartão de Crédito</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                    <button onClick={() => setIsRecordModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                    <button onClick={handleSaveRecord} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Salvar</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};