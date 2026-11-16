import { supabase } from './supabase';

export async function limparDiariosAntigos() {
  try {
    const dezDiasAtras = new Date();
    dezDiasAtras.setDate(dezDiasAtras.getDate() - 10);
    const dataLimite = dezDiasAtras.toISOString().split('T')[0];

    const { data: diariosAntigos, error: fetchError } = await supabase
      .from('diarios')
      .select('id, fotos')
      .lt('data', dataLimite);

    if (fetchError) throw fetchError;

    if (!diariosAntigos || diariosAntigos.length === 0) {
      return; 
    }
    let arquivosParaApagar = [];
    diariosAntigos.forEach(diario => {
      if (diario.fotos && Array.isArray(diario.fotos)) {
        diario.fotos.forEach(foto => {
          if (foto.uri) {
            const partes = foto.uri.split('/');
            const nomeArquivo = partes[partes.length - 1];
            if (nomeArquivo) arquivosParaApagar.push(nomeArquivo);
          }
        });
      }
    });

    if (arquivosParaApagar.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('fotos_diario')
        .remove(arquivosParaApagar);
      
      if (storageError) {
        console.error("Erro ao apagar fotos antigas do storage:", storageError.message);
      }
    }

    const { error: deleteError } = await supabase
      .from('diarios')
      .delete()
      .lt('data', dataLimite);

    if (deleteError) throw deleteError;

    console.log(`Limpeza automática: ${diariosAntigos.length} diários com mais de 10 dias foram removidos.`);
  } catch (error) {
    console.error("Erro na limpeza automática de diários:", error.message);
  }
}