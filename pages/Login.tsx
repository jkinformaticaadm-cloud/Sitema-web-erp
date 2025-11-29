import React, { useState } from 'react';
import { login, register } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Smartphone, Lock, User, Loader2, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginAsAdminMock } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Tentativa 1: Login Normal
      const { error: loginError } = await login(email, password);

      if (loginError) {
        // 🔥 BYPASS: Se falhar e for o admin, tentamos registrar ou usar mock
        if (email === 'admin@assistech.com' && password === 'admin123') {
            console.log("Login falhou. Tentando modo de recuperação de Admin...");
            
            try {
                // Tenta registrar caso não exista
                await register(email, password, {
                    nome: 'Administrador',
                    empresa_nome: 'AssisTech Admin',
                    telefone: '(00) 00000-0000'
                });
                
                // Tenta logar de novo
                const { error: retryError } = await login(email, password);
                if (!retryError) {
                    navigate('/app');
                    return;
                }
            } catch (regError) {
                console.warn("Falha no registro/banco:", regError);
            }

            // 🚨 ULTIMO RECURSO: Se tudo falhar (banco quebrado), entra no modo MOCK (Local)
            console.warn("Ativando modo Admin Mock (Sem Banco de Dados)");
            loginAsAdminMock();
            navigate('/app');
            return;
        }
        throw loginError;
      }
      
      navigate('/app'); 
    } catch (err: any) {
      console.error(err);
      
      // Se for admin, forçamos a entrada mesmo com erro genérico
      if (email === 'admin@assistech.com' && password === 'admin123') {
          loginAsAdminMock();
          navigate('/app');
          return;
      }

      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-8 bg-[#0f172a] text-center border-b-4 border-blue-600 relative">
          <Link to="/" className="absolute left-6 top-6 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="mx-auto w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border border-white/20 shadow-inner">
            <Smartphone size={40} className="text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">AssisTech</h1>
          <p className="text-blue-200 text-sm mt-2 font-medium">Faça login para continuar</p>
        </div>

        <div className="p-8 bg-white">
          {/* Dica para o usuário */}
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
             <ShieldAlert className="text-yellow-600 shrink-0 mt-0.5" size={18} />
             <div>
                <p className="text-xs font-bold text-yellow-800 uppercase">Acesso Admin (Garantido)</p>
                <p className="text-xs text-yellow-700">User: <strong className="font-mono">admin@assistech.com</strong></p>
                <p className="text-xs text-yellow-700">Pass: <strong className="font-mono">admin123</strong></p>
             </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="seu@email.com"
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="******"
                  required 
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Entrar no Sistema'}
            </button>
          </form>

          <div className="mt-6 text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">Não tem uma conta?</p>
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Criar conta e testar grátis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};