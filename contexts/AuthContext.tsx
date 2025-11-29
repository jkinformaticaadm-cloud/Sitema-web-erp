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

    const initAuth = async () => {
      try {
        // 1. Check active session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          // Se houver erro (ex: url inválida), apenas assumimos deslogado
          console.warn('Erro ao verificar sessão:', error.message);
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
        console.error('Erro inesperado na autenticação:', err);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // 2. Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        setSession(session);
        if (session) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setCompany(null);
          setSubscriptionStatus('loading'); // Reset status? Ou inactive
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
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

      if (profileError) {
        console.warn("Perfil não encontrado ou erro:", profileError.message);
        // Se não achar perfil, não trava, só deixa null
      } else {
        setProfile(profileData);
        if (profileData) checkSubscription(profileData);

        if (profileData && profileData.empresa_id) {
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

  const checkSubscription = (profile: SupabaseProfile | null) => {
    if (!profile) {
      setSubscriptionStatus('inactive');
      return;
    }

    if (profile.assinatura_status !== 'ativa') {
      setSubscriptionStatus(profile.assinatura_status as any || 'inactive');
      return;
    }

    // Verificar data de vencimento
    if (profile.assinatura_vencimento) {
        const hoje = new Date();
        const vencimento = new Date(profile.assinatura_vencimento);

        if (vencimento < hoje) {
            setSubscriptionStatus('expired');
        } else {
            setSubscriptionStatus('active');
        }
    } else {
        // Se ativa mas sem data (caso de erro), assume ativa ou inativa?
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
