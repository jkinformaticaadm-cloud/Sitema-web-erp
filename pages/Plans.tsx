import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PLANS } from '../services/paymentService';
import { Check, Star } from 'lucide-react';

export const Plans: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (planId: string) => {
    navigate(`/payment/${planId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Escolha o plano ideal para sua assistência</h1>
        <p className="text-gray-500 text-lg">Desbloqueie todo o potencial do sistema e organize sua loja hoje mesmo.</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map(plan => (
          <div key={plan.id} className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 transition-transform hover:-translate-y-1 ${plan.id === 'trimestral' ? 'border-blue-500 relative' : 'border-transparent'}`}>
            {plan.id === 'trimestral' && (
              <div className="bg-blue-500 text-white text-xs font-bold uppercase py-1 px-4 absolute top-0 right-0 rounded-bl-lg">
                Mais Popular
              </div>
            )}
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <div className="my-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                <span className="text-gray-500 ml-1">/{plan.days === 30 ? 'mês' : plan.days === 365 ? 'ano' : 'tri'}</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">Acesso completo a todas as funcionalidades do sistema.</p>
              
              <button 
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-3 rounded-xl font-bold transition-colors ${plan.id === 'trimestral' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
              >
                Assinar Agora
              </button>
            </div>
            <div className="bg-gray-50 p-8 border-t border-gray-100">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 shrink-0" />
                  <span className="text-sm text-gray-600">Gestão de Ordens de Serviço</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 shrink-0" />
                  <span className="text-sm text-gray-600">Controle Financeiro e Caixa</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 shrink-0" />
                  <span className="text-sm text-gray-600">Multi-usuários ilimitados</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 shrink-0" />
                  <span className="text-sm text-gray-600">Suporte Prioritário</span>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
