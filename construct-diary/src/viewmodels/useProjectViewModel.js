import { useState } from 'react';
import { supabase } from '../services/supabase';

// Recebe opcionalmente um projeto existente para edição
export function useProjectViewModel(projetoExistente = null) {
  const [projetos, setProjetos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Inicializa os estados com os dados existentes (se houver) ou vazios
  const [engenheiro, setEngenheiro] = useState(projetoExistente?.engenheiro || '');
  const [empresa, setEmpresa] = useState(projetoExistente?.empresa || '');
  const [nomeProjeto, setNomeProjeto] = useState(projetoExistente?.nome_projeto || '');
  const [cep, setCep] = useState(projetoExistente?.cep || '');
  const [cidade, setCidade] = useState(projetoExistente?.cidade || '');
  const [bairro, setBairro] = useState(projetoExistente?.bairro || '');

  const isEditing = !!projetoExistente?.id;

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
    if (!nomeProjeto.trim()) {
      alert('O nome do projeto é obrigatório.');
      return;
    }

    setIsLoading(true);
    let error;

    if (isEditing) {
      // Se estiver a editar, faz UPDATE
      const res = await supabase
        .from('projetos')
        .update({
          engenheiro,
          empresa,
          nome_projeto: nomeProjeto,
          cep,
          cidade,
          bairro,
        })
        .eq('id', projetoExistente.id);
      error = res.error;
    } else {
      // Se for novo, faz INSERT
      const { data: { user } } = await supabase.auth.getUser();
      const res = await supabase.from('projetos').insert([{
        engenheiro,
        empresa,
        nome_projeto: nomeProjeto,
        cep,
        cidade,
        bairro,
        user_id: user.id
      }]);
      error = res.error;
    }

    setIsLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert(isEditing ? 'Projeto atualizado com sucesso!' : 'Projeto salvo com sucesso!');
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
    saveProjeto,
    isEditing
  };
}