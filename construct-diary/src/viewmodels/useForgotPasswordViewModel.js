import { useState } from 'react';
import { supabase } from '../services/supabase';

export function useForgotPasswordViewModel() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (onSuccess) => {
    if (!email.trim()) {
      alert('Por favor, informe o seu e-mail.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      });

      if (error) throw error;

      alert('E-mail de recuperação enviado! Verifique a sua caixa de entrada.');
      if (onSuccess) onSuccess();
    } catch (error) {
      alert('Erro ao enviar e-mail: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    handleResetPassword,
    isLoading,
  };
}