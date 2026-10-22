import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../services/supabase'; 
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export function useDiaryViewModel() {
  const [colaboradores, setColaboradores] = useState([]);
  const [descricoes, setDescricoes] = useState([]);
  const [observacoes, setObservacoes] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addColaborador = () => {
    setColaboradores([...colaboradores, { 
      id: Date.now().toString(), 
      cargo: 'Pedreiro', 
      faltas: '0', 
      avisos: '0' 
    }]);
  };

  const updateColaborador = (id, field, value) => {
    if (field === 'faltas' || field === 'avisos') {
      if (value !== '' && !/^[0-2]$/.test(value)) return;
    }
    setColaboradores(colaboradores.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeColaborador = (id) => {
    setColaboradores(colaboradores.filter(c => c.id !== id));
  };

  const addDescricao = () => {
    setDescricoes([...descricoes, { id: Date.now().toString(), texto: '' }]);
  };

  const updateDescricao = (id, texto) => {
    setDescricoes(descricoes.map(d => d.id === id ? { ...d, texto } : d));
  };

  const removeDescricao = (id) => {
    setDescricoes(descricoes.filter(d => d.id !== id));
  };

  const addObservacao = () => {
    setObservacoes([...observacoes, { id: Date.now().toString(), texto: '' }]);
  };

  const updateObservacao = (id, texto) => {
    setObservacoes(observacoes.map(o => o.id === id ? { ...o, texto } : o));
  };

  const removeObservacao = (id) => {
    setObservacoes(observacoes.filter(o => o.id !== id));
  };

  // Lógica completa de upload unificada aqui para evitar erros de importação
  const processarEGuardarFoto = async (uriLocal) => {
    setIsLoading(true); 
    try {
      const nomeArquivo = `obra_${Date.now()}.jpg`;
      
      const base64 = await FileSystem.readAsStringAsync(uriLocal, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { data, error } = await supabase.storage
        .from('fotos_diario') 
        .upload(nomeArquivo, decode(base64), {
          contentType: 'image/jpeg',
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('fotos_diario')
        .getPublicUrl(nomeArquivo);

      const novaFoto = { id: Date.now().toString(), uri: publicUrlData.publicUrl };
      setFotos(prev => [...prev, novaFoto]); 
      
    } catch (error) {
      console.error("Erro no upload da foto:", error);
      alert("Falha ao enviar a imagem para a nuvem.");
    } finally {
      setIsLoading(false);
    }
  };

  const addFoto = () => {
    Alert.alert(
      "Adicionar Foto",
      "De onde pretende adicionar a fotografia?",
      [
        {
          text: "Câmera",
          onPress: async () => {
            const permissao = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissao.granted) {
              alert("Precisamos de permissão para aceder à câmara.");
              return;
            }
            const resultado = await ImagePicker.launchCameraAsync({
              mediaTypes: ['images'], // Aviso resolvido
              quality: 0.3, 
            });
            
            if (!resultado.canceled) {
              processarEGuardarFoto(resultado.assets[0].uri); 
            }
          }
        },
        {
          text: "Galeria",
          onPress: async () => {
            const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissao.granted) {
              alert("Precisamos de permissão para aceder à galeria.");
              return;
            }
            const resultado = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'], // Aviso resolvido
              quality: 0.3,
            });

            if (!resultado.canceled) {
              processarEGuardarFoto(resultado.assets[0].uri);
            }
          }
        },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const removeFoto = (id) => {
    setFotos(fotos.filter(f => f.id !== id));
  };

  const saveDiario = async (projetoId, onSuccess) => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const hoje = new Date().toISOString().split('T')[0];

    const { error } = await supabase.from('diarios').insert([{
      projeto_id: projetoId,
      user_id: user?.id,
      data: hoje,
      colaboradores, 
      descricoes,
      observacoes,
      fotos
    }]);

    setIsLoading(false);

    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      alert('Diário salvo com sucesso!');
      if (onSuccess) onSuccess();
    }
  };

  return {
    colaboradores, addColaborador, updateColaborador, removeColaborador,
    descricoes, addDescricao, updateDescricao, removeDescricao,
    observacoes, addObservacao, updateObservacao, removeObservacao,
    fotos, addFoto, removeFoto,
    saveDiario, isLoading
  };
}