import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  CheckCircle, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Users, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Home: React.FC = () => {
  const { session } = useAuth();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <Smartphone size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">RTJK SaaS</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <a href="#features" className="hover:text-blue-600 transition-colors">Recursos</a>
              <a href="#plans" className="hover:text-blue-600 transition-colors">Planos</a>
              <a href="#contact" className="hover:text-blue-600 transition-colors">Contato</a>
            </div>

            <div className="flex items-center gap-4">
              {session ? (
                <Link 
                  to="/app" 
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                  Acessar Painel <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-700 font-bold hover:text-blue-600 transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                  >
                    Criar Conta
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold mb-6 border border-blue-100">
              <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
              O sistema nº 1 para Assistências Técnicas
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Gerencie sua loja com <span className="text-blue-600">inteligência</span> e <span className="text-blue-600">rapidez</span>.
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Controle de ordens de serviço, estoque, vendas e financeiro em um único lugar. 
              Ideal para assistências de celulares, notebooks e eletrônicos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                Começar Grátis Agora <ArrowRight size={20} />
              </Link>
              <a 
                href="#features" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center"
              >
                Conhecer Recursos
              </a>
            </div>
          </div>

          {/* System Preview Image */}
          <div className="relative mx-auto max-w-5xl animate-scale-in">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 px-3 py-1 bg-slate-800 rounded-md text-xs text-slate-400 font-mono">dashboard.rtjk.com</div>
              </div>
              {/* Placeholder for Screenshot - Using a generic dashboard representation */}
              <div className="aspect-video bg-slate-50 relative overflow-hidden group">
                 <img 
                   src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                   alt="Sistema Dashboard" 
                   className="w-full h-full object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
                    <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-xl shadow-lg border border-white/50 text-blue-900 font-bold">
                        Interface Moderna e Intuitiva
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tudo o que sua assistência precisa</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Elimine planilhas e cadernos. Tenha o controle total do seu negócio na palma da sua mão.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ordens de Serviço</h3>
              <p className="text-gray-600 leading-relaxed">
                Emita OS profissionais, controle status (Aguardando Peça, Em Análise, Pronto) e imprima comprovantes térmicos ou A4 para seus clientes.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-green-100 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Controle Financeiro</h3>
              <p className="text-gray-600 leading-relaxed">
                Fluxo de caixa completo. Registre entradas, saídas, controle taxas de cartão e veja relatórios de lucro real em tempo real.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-100 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gestão de Clientes</h3>
              <p className="text-gray-600 leading-relaxed">
                Histórico completo de cada cliente. Saiba quais aparelhos ele já consertou, quanto gastou e fidelize com crédito na loja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Planos Transparentes</h2>
            <p className="text-slate-400">Escolha o melhor período para o seu negócio. Todos os planos incluem acesso total.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Mensal */}
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-colors relative">
              <h3 className="text-lg font-medium text-slate-300 mb-4">Mensal</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">R$ 49,90</span>
                <span className="text-slate-500">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 text-slate-300">
                <li className="flex gap-3"><CheckCircle size={20} className="text-blue-500" /> Sistema Completo</li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-blue-500" /> Suporte via Email</li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-blue-500" /> Atualizações Inclusas</li>
              </ul>
              <Link to="/register" className="block w-full py-3 bg-slate-700 hover:bg-slate-600 text-white text-center rounded-xl font-bold transition-colors">
                Assinar Mensal
              </Link>
            </div>

            {/* Trimestral */}
            <div className="bg-blue-600 rounded-2xl p-8 border border-blue-500 shadow-2xl relative transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">MAIS POPULAR</div>
              <h3 className="text-lg font-medium text-blue-100 mb-4">Trimestral</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">R$ 129,90</span>
                <span className="text-blue-200">/tri</span>
              </div>
              <p className="text-sm text-blue-200 mb-6 bg-blue-700/50 p-2 rounded">Economize R$ 19,80 em comparação ao mensal.</p>
              <ul className="space-y-4 mb-8 text-white">
                <li className="flex gap-3"><CheckCircle size={20} className="text-white" /> Tudo do Mensal</li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-white" /> Suporte Prioritário</li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-white" /> Backup Automático</li>
              </ul>
              <Link to="/register" className="block w-full py-3 bg-white text-blue-600 hover:bg-blue-50 text-center rounded-xl font-bold transition-colors">
                Assinar Trimestral
              </Link>
            </div>

            {/* Anual */}
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-colors">
              <h3 className="text-lg font-medium text-slate-300 mb-4">Anual</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">R$ 449,90</span>
                <span className="text-slate-500">/ano</span>
              </div>
              <p className="text-sm text-green-400 mb-6">Equivalente a R$ 37,49/mês.</p>
              <ul className="space-y-4 mb-8 text-slate-300">
                <li className="flex gap-3"><CheckCircle size={20} className="text-blue-500" /> Acesso Vitalício aos dados</li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-blue-500" /> Treinamento Equipe</li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-blue-500" /> Consultoria Inicial</li>
              </ul>
              <Link to="/register" className="block w-full py-3 bg-slate-700 hover:bg-slate-600 text-white text-center rounded-xl font-bold transition-colors">
                Assinar Anual
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Fale Conosco</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <Mail size={24} />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                <p className="text-gray-500">contato@rtjk.com.br</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <Zap size={24} />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">WhatsApp</h3>
                <p className="text-gray-500">(11) 99999-9999</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
                    <MapPin size={24} />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Endereço</h3>
                <p className="text-gray-500">São Paulo, SP</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
            <Smartphone size={24} className="text-blue-500" />
            <span className="text-xl font-bold text-white tracking-tight">RTJK SaaS</span>
        </div>
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} RTJK Sistemas. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};
