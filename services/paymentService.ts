// Simulação de integração com API de Pagamento (ex: Asaas, Mercado Pago)

interface Plan {
  id: 'mensal' | 'trimestral' | 'anual';
  name: string;
  price: number;
  days: number;
}

export const PLANS: Plan[] = [
  { id: 'mensal', name: 'Plano Mensal', price: 49.90, days: 30 },
  { id: 'trimestral', name: 'Plano Trimestral', price: 129.90, days: 90 },
  { id: 'anual', name: 'Plano Anual', price: 449.90, days: 365 },
];

export const generatePixPayment = async (planId: string, userId: string) => {
  // Aqui você faria o fetch para seu backend ou Edge Function
  // que por sua vez chama a API do Asaas/MP para gerar o Pix seguro.
  
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) throw new Error("Plano inválido");

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
  // Em produção, você usaria Webhooks para atualizar o banco e o front faria polling no banco
  
  return new Promise<{ status: 'pending' | 'paid' }>((resolve) => {
    setTimeout(() => {
      // Randomly approve for demo purposes after some checks
      // Em uma demo real, forçamos 'pending' até o usuário clicar em "Simular Pagamento"
      resolve({ status: 'pending' });
    }, 500);
  });
};