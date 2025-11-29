import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { SupabaseProfile, SupabaseCompany } from '../types';

interface AuthContextType {
  session: Session | null;
  profile: SupabaseProfile | null;
  company: SupabaseCompany | null;
  loading: boolean;
  subscriptionStatus: 'active' | 'inactive' | 'expired' | 'loading';
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<SupabaseProfile | null>(null);
  const [company, setCompany] = useState<SupabaseCompany | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'expired' | 'loading'>('loading');

  useEffect(() => {
    let mounted = true;

    // Timeout de segurança: Se o Supabase não responder em 1.5 segundos, libera o app como deslogado
    // Isso evita a tela branca se as chaves estiverem erradas
    const safetyTimeout = setTimeout(() => {
        if (mounted && loading) {
            console.warn("Auth check demorou muito. Forçando carregamento da página.");
            setLoading(false);
        }
    }, 1500);

    const initAuth = async () => {
      try {
        // Tenta obter sessão
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Sessão não iniciada (provavelmente chaves inválidas ou usuário deslogado):', error.message);
          if (mounted) setLoading(false);
          return;
        }

        if (mounted) {
          setSession(session);
          if (session) {
            await fetchProfile(session.user.id);
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Erro fatal na autenticação:', err);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Listener de mudanças de estado
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        setSession(session);
        if (session) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setCompany(null);
          setSubscriptionStatus('loading');
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single();

      if (!profileError && profileData) {
        setProfile(profileData);
        checkSubscription(profileData);

        if (profileData.empresa_id) {
          const { data: companyData } = await supabase
            .from('empresas')
            .select('*')
            .eq('id', profileData.empresa_id)
            .single();
          setCompany(companyData);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = (profile: SupabaseProfile) => {
    if (profile.assinatura_status !== 'ativa') {
      setSubscriptionStatus(profile.assinatura_status as any || 'inactive');
      return;
    }

    if (profile.assinatura_vencimento) {
        const hoje = new Date();
        const vencimento = new Date(profile.assinatura_vencimento);
        setSubscriptionStatus(vencimento < hoje ? 'expired' : 'active');
    } else {
        setSubscriptionStatus('active');
    }
  };

  const refreshProfile = async () => {
    if (session) {
        setLoading(true);
        await fetchProfile(session.user.id);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setCompany(null);
    setSubscriptionStatus('loading');
  };

  return (
    <AuthContext.Provider value={{ session, profile, company, loading, subscriptionStatus, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
