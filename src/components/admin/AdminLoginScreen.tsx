import React, { useState } from 'react';
import { ChevronLeft, Eye, EyeOff, Loader2, ShieldCheck, Flame, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function AdminLoginScreen({ onBack, onSuccess }: AdminLoginScreenProps) {
  const { loginWithEmail, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Validations
  const isEmailEmpty = !email.trim();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const emailError = (hasAttemptedSubmit || emailTouched)
    ? isEmailEmpty
      ? 'Campo obrigatório: informe seu e-mail de acesso'
      : !isEmailValid
      ? 'Formato de e-mail inválido (ex: admin@bbt.com.br)'
      : null
    : null;

  const isPasswordEmpty = !password;
  const isPasswordShort = password.length > 0 && password.length < 6;
  const passwordError = (hasAttemptedSubmit || passwordTouched)
    ? isPasswordEmpty
      ? 'Campo obrigatório: informe sua senha'
      : isPasswordShort
      ? 'A senha deve conter no mínimo 6 caracteres'
      : null
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    clearError();

    // Bloqueia envio se houver campos não preenchidos ou inválidos
    if (isEmailEmpty || !isEmailValid || isPasswordEmpty || isPasswordShort) {
      return;
    }

    setIsLoading(true);

    try {
      await loginWithEmail(email, password);
      onSuccess();
    } catch (err) {
      // erro tratado no context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden select-none font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-neutral-800/20 blur-[100px] pointer-events-none rounded-full" />

      {/* Top Bar with Back Button matching reference */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900/80 hover:bg-neutral-800/90 border border-neutral-800/80 rounded-lg transition-all backdrop-blur-sm cursor-pointer shadow-sm group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Voltar ao site</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-neutral-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Portal Seguro BBT</span>
        </div>
      </div>

      {/* Main Center Auth Container */}
      <div className="w-full max-w-[420px] mx-auto z-10 my-auto py-8">
        {/* Brand Logo & Exact Writing Style from user reference image */}
        <div className="flex flex-col items-center justify-center text-center mb-8 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-xl shadow-red-600/30 group-hover:scale-105 transition-transform mb-3 border border-red-500/30">
            <Flame className="w-7 h-7 fill-white text-white" />
          </div>

          <div className="flex flex-col items-center">
            <span className="font-heading text-3xl sm:text-4xl font-black tracking-wider text-white leading-none">
              BBT
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.28em] text-red-500 mt-1.5 leading-tight">
              BRAZILIAN BLACK THAI
            </span>
          </div>
        </div>

        {/* Headings with exact site fonts */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold uppercase tracking-wider text-white mb-2">
            Acesso Administrativo
          </h1>
          <p className="text-xs text-neutral-400 font-sans">
            Informe suas credenciais para gerenciar o conteúdo do site
          </p>
        </div>

        {/* General Error Notification from Auth */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center gap-2 font-sans animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form: Pure Email and Password */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5 text-left">
            <label 
              htmlFor="admin-email" 
              className="text-xs font-medium text-neutral-300 font-sans block"
            >
              Informe seu email de acesso
            </label>

            <div className="relative">
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (!emailTouched) setEmailTouched(true);
                }}
                onBlur={() => setEmailTouched(true)}
                placeholder="exemplo@bbt.com.br"
                className={`w-full bg-[#121218]/90 border text-white placeholder-neutral-500 text-sm rounded-xl px-4 py-3.5 outline-none transition-all font-sans ${
                  emailError
                    ? 'border-red-500 bg-red-950/15 focus:ring-2 focus:ring-red-500/30 shadow-sm shadow-red-500/10'
                    : 'border-neutral-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
                }`}
                aria-invalid={Boolean(emailError)}
              />
            </div>

            {emailError && (
              <p className="text-[11px] text-red-400 font-medium flex items-center gap-1.5 pt-0.5 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                <span>{emailError}</span>
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5 text-left">
            <label 
              htmlFor="admin-password" 
              className="text-xs font-medium text-neutral-300 font-sans block"
            >
              Informe sua senha
            </label>

            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (!passwordTouched) setPasswordTouched(true);
                }}
                onBlur={() => setPasswordTouched(true)}
                placeholder="••••••••"
                className={`w-full bg-[#121218]/90 border text-white placeholder-neutral-500 text-sm rounded-xl px-4 py-3.5 outline-none transition-all pr-11 font-sans ${
                  passwordError
                    ? 'border-red-500 bg-red-950/15 focus:ring-2 focus:ring-red-500/30 shadow-sm shadow-red-500/10'
                    : 'border-neutral-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
                }`}
                aria-invalid={Boolean(passwordError)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors p-1 cursor-pointer"
                aria-label="Exibir ou ocultar senha"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {passwordError && (
              <p className="text-[11px] text-red-400 font-medium flex items-center gap-1.5 pt-0.5 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                <span>{passwordError}</span>
              </p>
            )}
          </div>

          {/* Primary Submit Button: High contrast button with site font */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-white hover:bg-neutral-200 active:bg-neutral-300 text-neutral-950 font-heading font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                <span>Autenticando...</span>
              </>
            ) : (
              <span>Entrar</span>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <p className="text-[11px] text-neutral-500 text-center leading-relaxed mt-8 font-sans">
          Área restrita e monitorada para administração da <span className="text-neutral-400 font-semibold">Academia BBT</span>.
        </p>
      </div>

      {/* Footer System Info */}
      <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-600 border-t border-neutral-900 pt-4 z-10 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-red-500/70" />
          <span>BBT Fighting System v2.0 • Conexão Criptografada</span>
        </div>
        <div>São Paulo, Brasil</div>
      </div>
    </div>
  );
}
