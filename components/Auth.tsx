
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('¡Registro exitoso! Ya puedes iniciar sesión.');
        setIsRegistering(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-10 border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-[#0078D4] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-200 mb-4">A</div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none text-center">ARISTA<span className="text-[#0078D4]">ESTUDIO</span></h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-2">Acceso a Medidor Cloud</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Email de Usuario</label>
            <input 
              type="email" 
              required 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#0078D4] focus:bg-white outline-none font-bold text-slate-700 transition-all"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Contraseña</label>
            <input 
              type="password" 
              required 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#0078D4] focus:bg-white outline-none font-bold text-slate-700 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-[10px] font-black p-4 rounded-xl border border-red-100 uppercase tracking-tight">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0078D4] text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-[#006cc1] active:scale-[0.98] transition-all uppercase text-xs tracking-widest mt-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              isRegistering ? 'Crear Cuenta' : 'Entrar al Panel'
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-[10px] font-black text-slate-400 hover:text-[#0078D4] uppercase tracking-widest transition-colors"
          >
            {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate gratis'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
