import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PLANS } from '../services/paymentService';
import { Check, Zap, Star } from 'lucide-react';

export const Plans: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (planId: string) => {
    navigate(`/payment/${planId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Escolha como começar</h1>
          <p className="text-gray-500 text-lg">Tenha acesso a <strong>todas as funcionalidades</strong> em qualquer opção.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PLANS.map(plan => (
            <div 
                key={plan.id} 
                className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 transition-transform hover:-translate-y-1 flex flex-col ${plan.id === 'anual' ? 'border-blue-500 relative ring-4 ring-blue-500/10' : 'border-transparent'}`}
            >
              {plan.id === 'anual' && (
                <div className="bg-blue-500 text-white text-xs font-bold uppercase py-1 px-4 absolute top-0 right-0 rounded-bl-lg flex items-center gap-1">
                  <Star size={12} fill="white" /> Melhor Oferta
                </div>
              )}
              
              <div className="p-8 flex-1">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${plan.id === 'trial' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {plan.id === 'trial' ? <Zap size={24} /> : <Star size={24} />}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                </div>
                
                <p className="text-gray-500 mb-6">{plan.description}</p>

                <div className="my-6 flex flex-col">
                  {plan.id === 'trial' ? (
                      <span className="text-4xl font-extrabold text-green-600">Grátis</span>
                  ) : (
                      <>
                        <div className="flex items-baseline">
                            <span className="text-4xl font-extrabold text-gray-900">R$ 29,90</span>
                            <span className="text-gray-500 ml-1 text-sm font-medium">/mês</span>
                        </div>
                        <span className="text-xs text-blue-600 font-medium mt-1">Total de R$ {plan.price.toFixed(2).replace('.', ',')} / ano</span>
                      </>
                  )}
                </div>
                
                <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={18} className="text-green-500" /> 
                        <span>Acesso Total ao Sistema</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={18} className="text-green-500" /> 
                        <span>Gestão de OS e Vendas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={18} className="text-green-500" /> 
                        <span>{plan.id === 'trial' ? 'Válido por 3 dias' : 'Válido por 12 meses'}</span>
                    </div>
                </div>

                <button 
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-colors shadow-lg ${
                      plan.id === 'anual' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                      : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {plan.id === 'trial' ? 'Iniciar Teste Grátis' : 'Quero o Plano Anual'}
                </button>
              </div>
              
              {plan.id === 'anual' && (
                  <div className="bg-blue-50 px-8 py-3 text-center text-blue-700 text-sm font-medium border-t border-blue-100">
                      Pagamento único de R$ 358,80
                  </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};