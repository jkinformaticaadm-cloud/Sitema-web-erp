// Simulação de integração com API de Pagamento (ex: Asaas, Mercado Pago)

interface Plan {
  id: 'trial' | 'anual';
  name: string;
  price: number;
  days: number;
  description: string;
}

export const PLANS: Plan[] = [
  { 
    id: 'trial', 
    name: 'Teste Grátis', 
    price: 0, 
    days: 3, 
    description: 'Experimente todas as funcionalidades sem custo.' 
  },
  { 
    id: 'anual', 
    name: 'Plano Anual PRO', 
    price: 29.90, 
    days: 365, 
    description: 'Acesso completo por 1 ano com preço promocional.' 
  },
];

export const generatePixPayment = async (planId: string, userId: string) => {
  // Aqui você faria o fetch para seu backend ou Edge Function
  // que por sua vez chama a API do Asaas/MP para gerar o Pix seguro.
  
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) throw new Error("Plano inválido");

  // Se for gratuito, não gera Pix
  if (plan.price === 0) {
      return {
          success: true,
          txid: `free_${Math.random().toString(36).substr(2, 9)}`,
          copiaCola: "",
          expirationMinutes: 0,
          value: 0
      };
  }

  console.log(`Gerando Pix para ${plan.name} - R$ ${plan.price}`);

  // Simulação de resposta da API
  return {
    success: true,
    txid: `pix_${Math.random().toString(36).substr(2, 9)}`,
    copiaCola: "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540549.905802BR5913ASSISTECH SAAS6008SAO PAULO62070503***6304ABCD",
    expirationMinutes: 30,
    value: plan.price
  };
};

export const checkPaymentStatus = async (txid: string) => {
  // Simula verificação de status no banco ou API
  
  return new Promise<{ status: 'pending' | 'paid' }>((resolve) => {
    // Se for um ID de trial gratuito, aprova imediatamente
    if (txid.startsWith('free_')) {
        resolve({ status: 'paid' });
        return;
    }

    setTimeout(() => {
      // Randomly approve for demo purposes after some checks
      resolve({ status: 'pending' });
    }, 500);
  });
};