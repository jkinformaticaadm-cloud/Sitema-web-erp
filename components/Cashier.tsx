import React, { useState } from 'react';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Lock, Unlock, Printer, X, User, Calendar, Clock } from 'lucide-react';
import { CashierTransaction } from '../types';

interface CashierProps {
  transactions: CashierTransaction[];
  onAddTransaction: (t: CashierTransaction) => void;
}

export const Cashier: React.FC<CashierProps> = ({ transactions, onAddTransaction }) => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Form State
  const [transactionType, setTransactionType] = useState<'ENTRY' | 'EXIT'>('ENTRY');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Troco Caixa');
  const [operator, setOperator] = useState('Administrador');

  // Stats calculation
  const totalEntry = transactions
    .filter(t => t.type === 'ENTRY')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExit = transactions
    .filter(t => t.type === 'EXIT')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalEntry - totalExit;

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert("Digite um valor válido.");
      return;
    }
    if (!operator) {
      alert("Informe o nome do operador.");
      return;
    }
    if (transactionType === 'EXIT' && !description) {
      alert("Para saídas, a descrição é obrigatória.");
      return;
    }

    const newTransaction: CashierTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: transactionType,
      amount: parseFloat(amount),
      category: transactionType === 'ENTRY' ? 'Troco Caixa' : category, // Force fixed category for Entry
      description: description || (transactionType === 'ENTRY' ? 'Suprimento / Abertura' : 'Saída'),
      date: new Date().toLocaleString('pt-BR'),
      operator: operator
    };

    onAddTransaction(newTransaction);
    
    // Reset form partially (keep operator)
    setAmount('');
    setDescription('');
    if (transactionType === 'ENTRY') {
        // Just added an entry, maybe switch to exit or keep? 
        // Keeping current state but resetting category logic handled by effect/render
    } else {
        setCategory('Despesas');
    }
  };

  const handlePrint = () => {
    setTimeout(() => {
        window.print();
    }, 100);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Controle de Caixa</h2>
          <p className="text-gray-500">Gestão de entradas, saídas e fechamento diário.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setIsReportOpen(true)}
             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
           >
            <Printer size={18} />
            <span className="hidden sm:inline">Relatório / Fechamento</span>
          </button>
          {isRegisterOpen ? (
            <button 
              onClick={() => setIsRegisterOpen(false)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-200"
            >
              <Lock size={18} />
              <span>Fechar Caixa</span>
            </button>
          ) : (
            <button 
              onClick={() => setIsRegisterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm shadow-green-200"
            >
              <Unlock size={18} />
              <span>Abrir Caixa</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Saldo em Caixa</p>
            <h3 className={`text-3xl font-bold mt-1 ${balance >= 0 ? 'text-gray-800' : 'text-red-600'}`}>
              R$ {balance.toFixed(2)}
            </h3>
            <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${isRegisterOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {isRegisterOpen ? 'Caixa Aberto' : 'Caixa Fechado'}
            </span>
          </div>
          <div className="bg-blue-50 p-4 rounded-full text-blue-600">
            <DollarSign size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Entradas</p>
            <h3 className="text-2xl font-bold text-green-600 mt-1">R$ {totalEntry.toFixed(2)}</h3>
            <p className="text-xs text-gray-400 mt-1">Hoje</p>
          </div>
          <div className="bg-green-50 p-4 rounded-full text-green-600">
            <ArrowUpCircle size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Saídas</p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">R$ {totalExit.toFixed(2)}</h3>
            <p className="text-xs text-gray-400 mt-1">Hoje</p>
          </div>
          <div className="bg-red-50 p-4 rounded-full text-red-600">
            <ArrowDownCircle size={28} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Transaction Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Lançamento Rápido</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Movimento</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  type="button" 
                  onClick={() => { setTransactionType('ENTRY'); setCategory('Troco Caixa'); setDescription('Suprimento'); }}
                  className={`py-2 text-center rounded-lg border font-medium transition-all ${transactionType === 'ENTRY' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                  Entrada
                </button>
                <button 
                  type="button" 
                  onClick={() => { setTransactionType('EXIT'); setCategory('Despesas'); setDescription(''); }}
                  className={`py-2 text-center rounded-lg border font-medium transition-all ${transactionType === 'EXIT' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                  Saída
                </button>
              </div>
            </div>

            {/* Operator Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Operador Responsável</label>
                <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                    <input 
                        type="text" 
                        value={operator}
                        onChange={(e) => setOperator(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Nome do operador"
                    />
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                  {transactionType === 'ENTRY' ? 'Valor de Abertura / Suprimento (R$)' : 'Valor de Retirada / Sangria (R$)'}
              </label>
              <input 
                type="number" 
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg text-gray-800" 
                placeholder="0,00" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={transactionType === 'ENTRY'}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${transactionType === 'ENTRY' ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
              >
                {transactionType === 'ENTRY' ? (
                    <option value="Troco Caixa">Troco Caixa / Suprimento</option>
                ) : (
                    <>
                        <option value="Despesas">Despesas Gerais</option>
                        <option value="Alimentação">Alimentação</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Fornecedores">Pagamento Fornecedor</option>
                        <option value="Sangria">Sangria (Retirada Lucro)</option>
                        <option value="Outros">Outros</option>
                    </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder={transactionType === 'ENTRY' ? "Ex: Abertura de caixa" : "Ex: Pagamento almoço equipe"} 
              />
            </div>
             
            <button className={`w-full py-2.5 text-white rounded-lg font-bold transition-colors shadow-lg flex items-center justify-center gap-2 ${transactionType === 'ENTRY' ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-red-600 hover:bg-red-700 shadow-red-200'}`}>
              {transactionType === 'ENTRY' ? <ArrowUpCircle size={20}/> : <ArrowDownCircle size={20}/>}
              Confirmar {transactionType === 'ENTRY' ? 'Entrada' : 'Saída'}
            </button>
          </form>
        </div>

        {/* Transactions List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800">Movimentações Detalhadas</h3>
            <span className="text-sm text-gray-500 flex items-center gap-1"><Calendar size={14}/> {new Date().toLocaleDateString()}</span>
          </div>
          <div className="overflow-auto flex-1 custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-white text-gray-500 text-xs uppercase sticky top-0 z-10 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Data / Hora</th>
                  <th className="px-6 py-3">Descrição / Operador</th>
                  <th className="px-6 py-3">Categoria</th>
                  <th className="px-6 py-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Clock size={14} className="text-gray-400"/>
                            {t.date}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{t.description}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <User size={10} /> {t.operator || 'Sistema'}
                        </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs border ${
                          t.category === 'Troco Caixa' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                          t.category.includes('Venda') ? 'bg-green-50 text-green-700 border-green-100' :
                          'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        {t.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'ENTRY' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'EXIT' ? '-' : '+'} R$ {t.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                    <p>Nenhuma movimentação registrada.</p>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* REPORT MODAL */}
      {isReportOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col animate-scale-in">
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl print:hidden">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Printer className="text-blue-600" />
                  Relatório de Fechamento de Caixa
                </h3>
                <button onClick={() => setIsReportOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
             </div>

             <div className="flex-1 overflow-y-auto p-8 bg-white" id="printable-area">
                 {/* Report Header */}
                 <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
                     <h1 className="text-3xl font-bold text-gray-900 uppercase">TechFix Assistência</h1>
                     <p className="text-gray-600">Relatório Detalhado de Movimentação de Caixa</p>
                     <p className="text-sm text-gray-500 mt-2">Data de Emissão: {new Date().toLocaleString()}</p>
                 </div>

                 {/* Summary Stats */}
                 <div className="grid grid-cols-3 gap-4 mb-8">
                     <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                         <h4 className="text-sm text-gray-500 uppercase font-bold">Total Entradas</h4>
                         <p className="text-2xl font-bold text-green-600 mt-1">R$ {totalEntry.toFixed(2)}</p>
                     </div>
                     <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                         <h4 className="text-sm text-gray-500 uppercase font-bold">Total Saídas</h4>
                         <p className="text-2xl font-bold text-red-600 mt-1">R$ {totalExit.toFixed(2)}</p>
                     </div>
                     <div className="p-4 border border-gray-200 rounded-lg bg-blue-50">
                         <h4 className="text-sm text-blue-500 uppercase font-bold">Saldo Final</h4>
                         <p className="text-2xl font-bold text-blue-700 mt-1">R$ {balance.toFixed(2)}</p>
                     </div>
                 </div>

                 {/* Detailed Table */}
                 <div className="mb-8">
                     <h4 className="font-bold text-gray-800 mb-3 uppercase text-sm border-b border-gray-200 pb-1">Extrato de Movimentações</h4>
                     <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase font-bold">
                            <tr>
                                <th className="px-4 py-2">Horário</th>
                                <th className="px-4 py-2">Descrição</th>
                                <th className="px-4 py-2">Categoria</th>
                                <th className="px-4 py-2">Operador</th>
                                <th className="px-4 py-2 text-right">Tipo</th>
                                <th className="px-4 py-2 text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {transactions.map((t, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-2 font-mono text-gray-600">{t.date}</td>
                                    <td className="px-4 py-2 font-medium">{t.description}</td>
                                    <td className="px-4 py-2 text-gray-600">{t.category}</td>
                                    <td className="px-4 py-2 text-gray-600">{t.operator}</td>
                                    <td className={`px-4 py-2 text-right font-bold ${t.type === 'ENTRY' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'ENTRY' ? 'ENTRADA' : 'SAÍDA'}
                                    </td>
                                    <td className="px-4 py-2 text-right font-bold">
                                        R$ {t.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                 </div>

                 {/* Signature Lines */}
                 <div className="flex justify-between items-end mt-16 pt-8">
                     <div className="text-center w-64 border-t border-gray-400 pt-2">
                         <p className="text-sm font-medium">Assinatura do Operador</p>
                         <p className="text-xs text-gray-500">{operator}</p>
                     </div>
                     <div className="text-center w-64 border-t border-gray-400 pt-2">
                         <p className="text-sm font-medium">Visto da Gerência</p>
                     </div>
                 </div>
             </div>

             <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl flex justify-end gap-3 print:hidden">
                 <button 
                    onClick={() => setIsReportOpen(false)}
                    className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                 >
                    Fechar
                 </button>
                 <button 
                    onClick={handlePrint}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-lg shadow-blue-900/20"
                 >
                    <Printer size={18} />
                    Imprimir Relatório
                 </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};