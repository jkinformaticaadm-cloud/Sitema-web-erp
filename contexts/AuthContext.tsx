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
  loginAsAdminMock: () => void; // Nova função
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

    // Timeout de segurança
    const safetyTimeout = setTimeout(() => {
        if (mounted && loading) {
            console.warn("Auth check demorou muito. Forçando carregamento da página.");
            setLoading(false);
        }
    }, 1500);

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          if (mounted) setLoading(false);
          return;
        }

        if (mounted) {
          setSession(session);
          if (session) {
            await fetchProfile(session.user.id, session.user.email);
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        setSession(session);
        if (session) {
          await fetchProfile(session.user.id, session.user.email);
        } else {
          // Só limpa se não for mock
          if (profile?.id !== 'mock-admin-id') {
             setProfile(null);
             setCompany(null);
             setSubscriptionStatus('loading');
             setLoading(false);
          }
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, email?: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single();

      if (!profileError && profileData) {
        setProfile(profileData);
        checkSubscription(profileData, email);

        if (profileData.empresa_id) {
          const { data: companyData } = await supabase
            .from('empresas')
            .select('*')
            .eq('id', profileData.empresa_id)
            .single();
          setCompany(companyData);
        }
      } else {
        // Fallback: Se não achar perfil mas tiver sessão (erro de trigger), tenta liberar se for admin
         if (email === 'admin@assistech.com') loginAsAdminMock();
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = (profile: SupabaseProfile, email?: string) => {
    if (email === 'admin@assistech.com' || profile.id === 'mock-admin-id') {
        setSubscriptionStatus('active');
        return;
    }

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

  // 🔥 Função de Bypass para Admin quando o Banco falha
  const loginAsAdminMock = () => {
      const mockUser = {
          id: 'mock-admin-id',
          email: 'admin@assistech.com',
          user_metadata: { nome: 'Administrador' }
      };
      
      const mockProfile: SupabaseProfile = {
          id: 'mock-admin-id',
          empresa_id: 'mock-company-id',
          nome: 'Administrador (Local)',
          email: 'admin@assistech.com',
          plano: 'anual',
          assinatura_status: 'ativa',
          assinatura_vencimento: '2099-12-31',
          created_at: new Date().toISOString()
      };

      const mockCompany: SupabaseCompany = {
          id: 'mock-company-id',
          nome: 'AssisTech Admin (Local)',
          cnpj: '00.000.000/0001-00',
          created_at: new Date().toISOString()
      };

      setSession({ user: mockUser } as any);
      setProfile(mockProfile);
      setCompany(mockCompany);
      setSubscriptionStatus('active');
      setLoading(false);
  };

  const refreshProfile = async () => {
    if (session && session.user.id !== 'mock-admin-id') {
        setLoading(true);
        await fetchProfile(session.user.id, session.user.email);
    }
  };

  const signOut = async () => {
    if (profile?.id === 'mock-admin-id') {
        setSession(null);
        setProfile(null);
        setCompany(null);
        setSubscriptionStatus('loading');
        return;
    }
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setCompany(null);
    setSubscriptionStatus('loading');
  };

  return (
    <AuthContext.Provider value={{ session, profile, company, loading, subscriptionStatus, signOut, refreshProfile, loginAsAdminMock }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);