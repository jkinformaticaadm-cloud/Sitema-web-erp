import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { checkPaymentStatus, generatePixPayment, PLANS } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { addDays } from 'date-fns';
import { Copy, CheckCircle, Loader2, ArrowLeft, Zap } from 'lucide-react';

export const Payment: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const { session, refreshProfile } = useAuth();
  const history = useHistory();
  
  const [loading, setLoading] = useState(true);
  const [pixData, setPixData] = useState<{ qr: string, code: string, txid: string } | null>(null);
  const [status, setStatus] = useState<'pending' | 'paid'>('pending');

  const plan = PLANS.find(p => p.id === planId);

  useEffect(() => {
    if (session && plan) {
      initPayment();
    }
  }, [session, plan]);

  useEffect(() => {
    let interval: any;
    if (pixData && status === 'pending') {
      // Se for gratuito, a verificação será instantânea
      const checkInterval = plan?.price === 0 ? 1000 : 5000;
      
      interval = setInterval(async () => {
        const res = await checkPaymentStatus(pixData.txid);
        if (res.status === 'paid') {
          handlePaymentSuccess();
          clearInterval(interval);
        }
      }, checkInterval);
    }
    return () => clearInterval(interval);
  }, [pixData, status]);

  const initPayment = async () => {
    if (!session || !plan) return;
    try {
      const data = await generatePixPayment(plan.id, session.user.id);
      
      // Salvar na tabela de assinaturas
      const { data: profile } = await supabase.from('perfis').select('empresa_id').eq('id', session.user.id).single();
      
      await supabase.from('assinaturas').insert([{
        usuario_id: session.user.id,
        empresa_id: profile.empresa_id,
        plano: plan.id,
        valor: data.value,
        pix_txid: data.txid,
        pix_qr: data.copiaCola || 'free_trial',
        status: data.value === 0 ? 'pago' : 'pendente' // Se for grátis, já insere como pago ou deixa pendente pro checker aprovar
      }]);

      setPixData({ qr: data.copiaCola, code: data.copiaCola, txid: data.txid });
    } catch (e) {
      console.error(e);
      alert("Erro ao processar plano");
    } finally {
      // Se for pago, remove o loading pra mostrar o QR. Se for grátis, mantém loading até o sucesso.
      if (plan.price > 0) setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setStatus('paid');
    setLoading(false);
    
    const vencimento = addDays(new Date(), plan!.days).toISOString();
    
    await supabase.from('perfis').update({
      assinatura_status: 'ativa',
      assinatura_vencimento: vencimento,
      plano: plan!.id
    }).eq('id', session?.user.id);

    if (pixData?.txid) {
        await supabase.from('assinaturas').update({
            status: 'pago',
            vencimento: vencimento
        }).eq('pix_txid', pixData.txid);
    }

    await refreshProfile();

    setTimeout(() => {
        history.push('/app');
    }, 2500);
  };

  // Função para simular pagamento manualmente (apenas dev/admin)
  const simulatePayment = async () => {
      setLoading(true);
      await handlePaymentSuccess();
  };

  if (!plan) return <div>Plano inválido</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center animate-scale-in">
        
        {status === 'paid' ? (
            <div className="py-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-bounce-slow">
                    {plan.price === 0 ? <Zap size={48} /> : <CheckCircle size={48} />}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                    {plan.price === 0 ? 'Período de Teste Ativado!' : 'Pagamento Confirmado!'}
                </h2>
                <p className="text-gray-500 mt-2">Configurando seu ambiente...</p>
            </div>
        ) : (
            <>
                <div className="mb-6 flex justify-between items-center">
                    <button onClick={() => history.push('/plans')} className="text-gray-400 hover:text-gray-600"><ArrowLeft /></button>
                    <h2 className="text-xl font-bold text-gray-800">
                        {plan.price === 0 ? 'Ativando Teste' : 'Pagamento via Pix'}
                    </h2>
                    <div className="w-6"></div>
                </div>

                {loading || plan.price === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                        <p className="text-gray-600 font-medium">Estamos liberando seu acesso...</p>
                        <p className="text-gray-400 text-sm mt-2">Isso levará apenas alguns segundos.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-500 mb-6">Escaneie o QR Code abaixo para pagar e liberar seu acesso ao <strong>{plan.name}</strong>.</p>
                        
                        <div className="bg-gray-100 p-4 rounded-xl inline-block mb-6 border-2 border-blue-100">
                            {pixData && pixData.qr && <QRCodeSVG value={pixData.qr} size={200} />}
                        </div>

                        <div className="mb-6">
                            <p className="text-xs text-gray-400 uppercase font-bold mb-2">Valor a Pagar</p>
                            <p className="text-3xl font-bold text-gray-900">R$ {plan.price.toFixed(2).replace('.', ',')}</p>
                        </div>

                        <div className="relative mb-6">
                            <input 
                                type="text" 
                                readOnly 
                                value={pixData?.code} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-4 pr-12 text-sm text-gray-600 truncate"
                            />
                            <button 
                                onClick={() => navigator.clipboard.writeText(pixData?.code || '')}
                                className="absolute right-2 top-2 p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="Copiar"
                            >
                                <Copy size={20} />
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 py-2 rounded-lg mb-6">
                            <Loader2 size={16} className="animate-spin" />
                            Aguardando confirmação automática...
                        </div>

                        {/* Botão de DEV */}
                        <button onClick={simulatePayment} className="text-xs text-gray-300 underline hover:text-gray-500">
                            (DEV) Simular Pagamento Recebido
                        </button>
                    </>
                )}
            </>
        )}
      </div>
    </div>
  );
};