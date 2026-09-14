import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';

export function useAuthViewModel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const carregarEmailSalvo = async () => {
      const emailSalvo = await AsyncStorage.getItem('@email_salvo');
      if (emailSalvo) {
        setEmail(emailSalvo);
        setRememberMe(true);
      }
    };
    carregarEmailSalvo();
  }, []);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert('As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setIsLoading(false);
    
    if (error) {
      alert(error.message);
    } else {
      alert('Cadastro realizado! Por favor, verifique sua caixa de entrada e confirme seu e-mail antes de fazer login.');
    }
  };

  const handleSignIn = async (onSuccess) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    
    if (error) {
      alert(error.message);
    } else {
      if (rememberMe) {
        await AsyncStorage.setItem('@email_salvo', email);
      } else {
        await AsyncStorage.removeItem('@email_salvo');
      }
      
      if (onSuccess) onSuccess();
    }
  };

  return { 
    email, setEmail, 
    password, setPassword, 
    confirmPassword, setConfirmPassword, 
    rememberMe, setRememberMe,
    isLoading, 
    handleSignUp, handleSignIn 
  };
}