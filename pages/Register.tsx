import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Building, User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    empresaNome: '',
    cnpj: '',
    telefone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Criar Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erro ao criar usuário");

      // 2. Criar Empresa
      const { data: empresaData, error: empresaError } = await supabase
        .from('empresas')
        .insert([{ 
          nome: formData.empresaNome, 
          cnpj: formData.cnpj, 
          telefone: formData.telefone 
        }])
        .select()
        .single();

      if (empresaError) throw empresaError;

      // 3. Criar Perfil vinculado
      const { error: perfilError } = await supabase
        .from('perfis')
        .insert([{
          id: authData.user.id,
          empresa_id: empresaData.id,
          nome: formData.nome,
          email: formData.email,
          plano: 'pendente',
          assinatura_status: 'inativa'
        }]);

      if (perfilError) throw perfilError;

      // 4. Redirecionar para Planos
      navigate('/plans');

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Lado Esquerdo - Info */}
        <div className="bg-blue-600 p-8 md:w-5/12 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4">Comece agora</h2>
            <p className="text-blue-100 mb-6">Gerencie sua assistência técnica de forma profissional. Controle de estoque, ordens de serviço e financeiro em um só lugar.</p>
            <ul className="space-y-3 text-sm text-blue-50">
              <li className="flex items-center gap-2">✓ Multi-usuários</li>
              <li className="flex items-center gap-2">✓ Controle de OS</li>
              <li className="flex items-center gap-2">✓ PDV Integrado</li>
            </ul>
          </div>
          <p className="text-xs text-blue-200 mt-8">© RTJK SaaS</p>
        </div>

        {/* Lado Direito - Form */}
        <div className="p-8 md:w-7/12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Criar nova conta</h2>
          
          <form onSubmit={handleRegister} className="space-y-4">
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-bold text-gray-500 uppercase">Dados de Acesso</h3>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Seu Nome</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input name="nome" value={formData.nome} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border rounded-lg" placeholder="Nome completo" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border rounded-lg" placeholder="seu@email.com" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Senha</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border rounded-lg" placeholder="******" required />
                  </div>
                </div>
                <button type="button" onClick={() => setStep(2)} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  Próximo <ArrowRight size={16} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-bold text-gray-500 uppercase">Dados da Empresa</h3>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Nome da Assistência</label>
                  <div className="relative">
                    <Building size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input name="empresaNome" value={formData.empresaNome} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border rounded-lg" placeholder="Ex: TecCell" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">CNPJ (Opcional)</label>
                  <input name="cnpj" value={formData.cnpj} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="00.000.000/0000-00" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Telefone</label>
                  <input name="telefone" value={formData.telefone} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="(00) 00000-0000" />
                </div>

                <div className="flex gap-2">
                  <button type="button" onClick={() => setStep(1)} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">Voltar</button>
                  <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : 'Finalizar Cadastro'}
                  </button>
                </div>
              </div>
            )}
          </form>

          {error && <p className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

          <p className="mt-6 text-center text-sm text-gray-500">
            Já tem conta? <Link to="/login" className="text-blue-600 hover:underline">Fazer login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
