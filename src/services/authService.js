import { supabase } from '../lib/supabase';

export const authService = {
  async getCurrentUser() {
    if (!supabase) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      try {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        if (profile) {
          return { ...user, ...profile };
        }
      } catch {
        // users table may not exist yet
      }
      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || '',
        role: 'customer',
      };
    } catch {
      return null;
    }
  },

  async signIn({ email, password }) {
    if (!supabase) return;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signUp({ name, email, password }) {
    if (!supabase) return;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  onAuthStateChange(callback) {
    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
    return supabase.auth.onAuthStateChange(callback);
  },
};
