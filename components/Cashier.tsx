import React, { useState } from 'react';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Lock, Unlock, Printer } from 'lucide-react';
import { CashierTransaction } from '../types';

interface CashierProps {
  transactions: CashierTransaction[];
  onAddTransaction: (t: CashierTransaction) => void;
}

export const Cashier: React.FC<CashierProps> = ({ transactions, onAddTransaction }) => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(true);

  // Stats calculation
  const totalEntry = transactions
    .filter(t => t.type === 'ENTRY')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExit = transactions
    .filter(t => t.type === 'EXIT')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalEntry - totalExit;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Controle de Caixa</h2>
          <p className="text-gray-500">Gestão de entradas, saídas e fechamento diário.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <Printer size={18} />
            <span className="hidden sm:inline">Relatório</span>
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
            <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
              Caixa Aberto
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
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            // In a real app, this would use form state
            // For now, we rely on the implementation in App.tsx to pass the handler
            alert("Utilize os campos para preencher (Lógica de formulário aqui)");
          }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" className="py-2 text-center rounded-lg border border-green-200 bg-green-50 text-green-700 font-medium hover:bg-green-100">Entrada</button>
                <button type="button" className="py-2 text-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Saída</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
              <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0,00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Pagamento Fornecedor" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Venda</option>
                <option>Serviço</option>
                <option>Alimentação</option>
                <option>Aluguel</option>
                <option>Fornecedores</option>
                <option>Outros</option>
              </select>
            </div>
            <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
              Confirmar Lançamento
            </button>
          </form>
        </div>

        {/* Transactions List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Movimentações do Dia</h3>
            <span className="text-sm text-gray-500">08 Nov, 2024</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">Horário</th>
                  <th className="px-6 py-3">Descrição</th>
                  <th className="px-6 py-3">Categoria</th>
                  <th className="px-6 py-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500 font-mono text-sm">{t.date}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{t.description}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
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
          </div>
          {transactions.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nenhuma movimentação registrada hoje.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};