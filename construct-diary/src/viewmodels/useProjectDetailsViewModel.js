import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';

export function useProjectDetailsViewModel(projetoId) {
  const [diarios, setDiarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchDiarios = useCallback(async () => {
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('diarios')
      .select('*')
      .eq('projeto_id', projetoId)
      .order('data', { ascending: false }); 

    if (error) {
      console.error("Erro ao buscar diários:", error.message);
    } else {
      setDiarios(data || []);
    }
    
    setIsLoading(false);
  }, [projetoId]);

  return { diarios, isLoading, fetchDiarios };
}