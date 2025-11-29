import React from 'react';
import { useHistory } from 'react-router-dom';
import { AlertTriangle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Expired: React.FC = () => {
  const history = useHistory();
  const { signOut, profile } = useAuth();

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 text-center border-t-8 border-red-500">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
          <AlertTriangle size={40} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Assinatura Expirada</h1>
        <p className="text-gray-600 mb-8">
          Olá, <strong>{profile?.nome}</strong>. Sua assinatura venceu em {profile?.assinatura_vencimento ? new Date(profile.assinatura_vencimento).toLocaleDateString() : 'data desconhecida'}. 
          Para continuar gerenciando sua assistência técnica, renove seu plano agora.
        </p>

        <div className="space-y-4">
          <button 
            onClick={() => history.push('/plans')}
            className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
          >
            Renovar Assinatura Agora
          </button>
          
          <button 
            onClick={signOut}
            className="w-full py-3 bg-white text-gray-600 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Sair da conta
          </button>
        </div>
      </div>
    </div>
  );
};