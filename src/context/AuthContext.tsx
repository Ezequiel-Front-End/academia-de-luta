import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';

interface AuthContextType {
  user: User | { email: string; displayName?: string } | null;
  loading: boolean;
  isDemo: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginDemo: () => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | { email: string; displayName?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Escuta estado do Firebase se configurado
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Verifica se há sessão demo salva no localStorage
      const savedDemo = localStorage.getItem('bbt_admin_demo_session');
      if (savedDemo === 'true') {
        setUser({ email: 'admin@bbt.com.br', displayName: 'Admin BBT' });
        setIsDemo(true);
      }
      setLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      if (!isFirebaseConfigured) {
        // Se chaves do Firebase não foram colocadas ainda, permite login como demonstração
        if (email.includes('@') && pass.length >= 6) {
          setUser({ email, displayName: 'Administrador BBT' });
          setIsDemo(true);
          localStorage.setItem('bbt_admin_demo_session', 'true');
          setLoading(false);
          return;
        } else {
          throw new Error('E-mail ou senha inválidos (senha mínima de 6 caracteres)');
        }
      }

      const credential = await signInWithEmailAndPassword(auth, email, pass);
      setUser(credential.user);
      setIsDemo(false);
      localStorage.removeItem('bbt_admin_demo_session');
    } catch (err: any) {
      let mensagem = 'Ocorreu um erro ao entrar. Verifique os dados informados.';
      if (err.code === 'auth/invalid-email') {
        mensagem = 'O endereço de e-mail informado é inválido.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        mensagem = 'E-mail ou senha incorretos.';
      } else if (err.code === 'auth/too-many-requests') {
        mensagem = 'Muitas tentativas sem sucesso. Aguarde alguns minutos.';
      } else if (err.message) {
        mensagem = err.message;
      }
      setError(mensagem);
      throw new Error(mensagem);
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = () => {
    setError(null);
    setUser({ email: 'mestre.caveira@bbt.com.br', displayName: 'Mestre Rogério Caveira' });
    setIsDemo(true);
    localStorage.setItem('bbt_admin_demo_session', 'true');
  };

  const logout = async () => {
    try {
      if (isFirebaseConfigured) {
        await signOut(auth);
      }
      setUser(null);
      setIsDemo(false);
      localStorage.removeItem('bbt_admin_demo_session');
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  const resetPassword = async (email: string) => {
    if (!email) throw new Error('Informe seu e-mail para recuperar a senha.');
    if (isFirebaseConfigured) {
      await sendPasswordResetEmail(auth, email);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemo,
        loginWithEmail,
        loginDemo,
        logout,
        resetPassword,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
