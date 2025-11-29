import { createClient } from '@supabase/supabase-js';

// Função auxiliar para ler variáveis de ambiente de forma segura (funciona em Vite e CRA)
const getEnv = (key: string, viteKey: string) => {
  // Verifica process.env (CRA / Node)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  // Verifica import.meta.env (Vite)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
    // @ts-ignore
    return import.meta.env[viteKey];
  }
  return '';
};

// URL e Key do Supabase (Substitua pelos seus dados do painel do Supabase se não usar .env)
const SUPABASE_URL = getEnv('REACT_APP_SUPABASE_URL', 'VITE_SUPABASE_URL') || 'https://placeholder-project.supabase.co';
const SUPABASE_ANON_KEY = getEnv('REACT_APP_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY') || 'placeholder-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
