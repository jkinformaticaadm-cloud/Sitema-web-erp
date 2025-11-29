import { createClient } from '@supabase/supabase-js';

// 🔧 SUA URL E CHAVE DO SUPABASE
const SUPABASE_URL = "https://eeozqzibfsmbwvbezspk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlb3pxemliZnNtYnd2YmV6c3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNzQyMTYsImV4cCI6MjA3OTk1MDIxNn0._lEvmSIq6ZEde3a1MzVQBPS6ZSvAJpHn8cu2QRPNKWw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🔥 Retorna o usuário atual (se estiver logado)
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// 🔥 Login com e-mail e senha
export async function login(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

// 🔥 Registrar usuário (dispara o trigger e cria empresa automática)
export async function register(email: string, password: string, metadata: any = {}) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
}

// 🔥 Logout
export async function logout() {
  return await supabase.auth.signOut();
}

// 🔥 Busca dados da empresa do usuário logado
export async function getMyCompany() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: 'Usuário não logado' } };

  const companyId = user.user_metadata?.company_id || user.app_metadata?.company_id;

  if (!companyId) return { data: null, error: { message: 'ID da empresa não encontrado' } };

  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .eq("id", companyId)
    .single();

  return { data, error };
}
