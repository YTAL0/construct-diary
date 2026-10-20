import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { supabase } from './supabase'; 

export const enviarFotoParaNuvem = async (uriLocal) => {
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

    return publicUrlData.publicUrl; 
  } catch (error) {
    console.error("Erro no upload da foto:", error);
    alert("Falha ao enviar a imagem para a nuvem.");
    return null;
  }
};