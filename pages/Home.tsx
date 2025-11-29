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
  MapPin,
  Lock,
  Globe,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Home: React.FC = () => {
  const { session } = useAuth();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
      {/* Navbar Transparente com Blur */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform">
                <Smartphone size={24} />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">AssisTech</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
              <a href="#recursos" className="hover:text-blue-600 transition-colors">Recursos</a>
              <a href="#planos" className="hover:text-blue-600 transition-colors">Planos</a>
              <a href="#contato" className="hover:text-blue-600 transition-colors">Contato</a>
            </div>

            <div className="flex items-center gap-4">
              {session ? (
                <Link 
                  to="/app" 
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  Acessar Sistema <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-600 font-bold hover:text-blue-600 transition-colors px-4 py-2"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 transform hover:-translate-y-0.5"
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
      <section className="pt-32 pb-24 bg-gradient-to-b from-blue-50 via-white to-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50 to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-8 border border-blue-200">
              <span className="animate-pulse w-2 h-2 bg-blue-600 rounded-full"></span>
              Novo: Integração com WhatsApp
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-8 tracking-tight">
              A gestão da sua assistência <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">nunca foi tão simples.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Controle ordens de serviço, estoque, vendas e financeiro em uma única plataforma intuitiva. Otimize seu tempo e lucre mais.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transform hover:-translate-y-1"
              >
                Testar Gratuitamente <ArrowRight size={20} />
              </Link>
              <a 
                href="#recursos" 
                className="w-full sm:w-auto px-10 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm hover:shadow-md"
              >
                Ver Funcionalidades
              </a>
            </div>
          </div>

          {/* System Preview Mockup */}
          <div className="relative mx-auto max-w-6xl animate-scale-in perspective-1000">
             {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur-2xl opacity-20"></div>
            
            <div className="relative bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden transform rotate-x-12 hover:rotate-0 transition-transform duration-700 ease-out">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800 bg-gray-900/90 backdrop-blur">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 px-4 py-1.5 bg-gray-800 rounded-lg text-xs text-gray-400 font-mono flex items-center gap-2">
                    <Lock size={10} /> app.assistech.com.br/dashboard
                </div>
              </div>
              
              {/* Fake Dashboard Image Area */}
              <div className="aspect-[16/9] bg-slate-100 relative group overflow-hidden">
                 <img 
                   src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
                   alt="Dashboard do Sistema" 
                   className="w-full h-full object-cover object-top opacity-95 transition-transform duration-700 group-hover:scale-105"
                 />
                 
                 {/* Floating Feature Cards */}
                 <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur p-4 rounded-xl shadow-xl border border-white/50 animate-bounce-slow hidden md:block">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600"><TrendingUp size={20}/></div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Faturamento Hoje</p>
                            <p className="text-lg font-bold text-gray-900">R$ 1.250,00</p>
                        </div>
                    </div>
                 </div>

                 <div className="absolute top-20 right-8 bg-white/90 backdrop-blur p-4 rounded-xl shadow-xl border border-white/50 animate-bounce-slow delay-75 hidden md:block">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Users size={20}/></div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Novos Clientes</p>
                            <p className="text-lg font-bold text-gray-900">+12 essa semana</p>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="recursos" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-base text-blue-600 font-bold tracking-wide uppercase mb-2">Recursos Poderosos</h2>
            <p className="text-3xl md:text-4xl font-extrabold text-gray-900">Tudo que você precisa em um só lugar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
                { 
                    icon: <ShieldCheck size={32} />, 
                    color: 'text-blue-600', bg: 'bg-blue-50', 
                    title: 'Gestão de OS', 
                    desc: 'Crie, edite e imprima Ordens de Serviço com status personalizados e QR Code para o cliente acompanhar.' 
                },
                { 
                    icon: <TrendingUp size={32} />, 
                    color: 'text-green-600', bg: 'bg-green-50', 
                    title: 'Controle Financeiro', 
                    desc: 'Fluxo de caixa, contas a pagar e receber, e cálculo automático de taxas de cartão e pix.' 
                },
                { 
                    icon: <Globe size={32} />, 
                    color: 'text-purple-600', bg: 'bg-purple-50', 
                    title: 'Acesso Online', 
                    desc: 'Acesse de qualquer lugar, seja do computador da loja, do tablet ou do seu celular em casa.' 
                }
            ].map((feature, idx) => (
                <div key={idx} className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-blue-100 hover:shadow-xl transition-all duration-300">
                    <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planos" className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Escolha seu plano</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Oferta por tempo limitado. Tenha acesso completo ao sistema.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Teste Grátis */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-green-500 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
              <h3 className="text-2xl font-bold text-white mb-2">Teste Grátis</h3>
              <p className="text-gray-400 text-sm mb-6">Para quem quer conhecer.</p>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-green-400">R$ 0,00</span>
              </div>
              
              <ul className="space-y-4 mb-8 text-gray-300 flex-1">
                <li className="flex gap-3"><CheckCircle size={20} className="text-green-500" /> 3 Dias de Acesso Total</li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-green-500" /> Sem compromisso</li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-green-500" /> Não requer cartão</li>
              </ul>
              <Link to="/register" className="block w-full py-4 bg-gray-700 group-hover:bg-green-600 text-white text-center rounded-xl font-bold transition-all">
                Começar Grátis
              </Link>
            </div>

            {/* Anual PRO */}
            <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-2xl p-8 border border-blue-500 shadow-2xl relative transform md:-translate-y-4 flex flex-col hover:scale-105 transition-transform duration-300">
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg shadow-sm flex items-center gap-1">
                <Star size={12} fill="currentColor" /> OFERTA ESPECIAL
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Anual PRO</h3>
              <p className="text-blue-200 text-sm mb-6">Acesso completo por 1 ano.</p>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-extrabold text-white">R$ 29,90</span>
                <span className="text-blue-200 font-medium">/ano</span>
              </div>
              <p className="text-sm text-blue-200 mb-6 bg-blue-900/30 p-2 rounded inline-block self-start border border-blue-400/30">
                 Equivale a <strong>R$ 2,49/mês</strong>
              </p>

              <ul className="space-y-4 mb-8 text-white flex-1">
                <li className="flex gap-3"><CheckCircle size={20} className="text-yellow-400" /> <strong>Tudo do Teste Grátis</strong></li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-yellow-400" /> Acesso por 12 meses</li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-yellow-400" /> Gestão de OS e Vendas</li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-yellow-400" /> Suporte Prioritário</li>
              </ul>
              <Link to="/register" className="block w-full py-4 bg-white text-blue-700 hover:bg-gray-50 text-center rounded-xl font-bold transition-colors shadow-lg">
                Quero essa oferta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-white pt-16 pb-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <Smartphone size={18} />
                        </div>
                        <span className="text-lg font-bold text-gray-900">AssisTech</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Transformando a gestão de assistências técnicas em todo o Brasil. Simples, rápido e eficiente.
                    </p>
                </div>
                
                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Produto</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li><a href="#recursos" className="hover:text-blue-600">Recursos</a></li>
                        <li><a href="#planos" className="hover:text-blue-600">Planos e Preços</a></li>
                        <li><a href="#" className="hover:text-blue-600">Atualizações</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Suporte</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-blue-600">Central de Ajuda</a></li>
                        <li><a href="#" className="hover:text-blue-600">Documentação API</a></li>
                        <li><a href="#" className="hover:text-blue-600">Status do Sistema</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Contato</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li className="flex items-center gap-2"><Mail size={16}/> contato@assistech.com.br</li>
                        <li className="flex items-center gap-2"><Phone size={16}/> (11) 99999-9999</li>
                        <li className="flex items-center gap-2"><MapPin size={16}/> São Paulo, SP</li>
                    </ul>
                </div>
            </div>
            
            <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-400">© 2024 AssisTech. Todos os direitos reservados.</p>
                    {/* Botão de Admin Discreto */}
                    <Link to="/login" className="text-gray-300 hover:text-red-600 transition-colors opacity-10 hover:opacity-100 p-1" title="Acesso Administrativo">
                        <ShieldCheck size={12} />
                    </Link>
                </div>
                <div className="flex gap-4">
                    <a href="#" className="text-gray-400 hover:text-blue-600 text-sm">Termos de Uso</a>
                    <a href="#" className="text-gray-400 hover:text-blue-600 text-sm">Privacidade</a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};