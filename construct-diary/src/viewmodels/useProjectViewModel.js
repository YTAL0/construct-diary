import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export function useProjectViewModel() {
  const [projetos, setProjetos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [engenheiro, setEngenheiro] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [nomeProjeto, setNomeProjeto] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');

  const fetchProjetos = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from('projetos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) setProjetos(data);
    }
    setIsLoading(false);
  };
  const saveProjeto = async (onSuccess) => {
    if (!nomeProjeto) {
      alert('O nome do projeto é obrigatório.');
      return;
    }

    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('projetos').insert([{
      engenheiro,
      empresa,
      nome_projeto: nomeProjeto,
      cep,
      cidade,
      bairro,
      user_id: user.id
    }]);

    setIsLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert('Projeto salvo com sucesso!');
      if (onSuccess) onSuccess();
    }
  };

  return {
    projetos, isLoading, fetchProjetos,
    engenheiro, setEngenheiro,
    empresa, setEmpresa,
    nomeProjeto, setNomeProjeto,
    cep, setCep,
    cidade, setCidade,
    bairro, setBairro,
    saveProjeto
  };
}