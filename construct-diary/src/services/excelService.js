import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx-js-style';

export const exportarDiarioParaExcel = async (projeto, diario) => {
  try {
    // 1. Preparar Datas e Endereço
    const [ano, mes, dia] = diario.data.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;
    const enderecoObra = `OBRA: ${projeto.nome_projeto || ''} - ${projeto.bairro || ''}, ${projeto.cidade || ''} - CE, ${projeto.cep || ''}`;

    // 2. Definição de Estilos
    const estiloCabecalho = { 
      fill: { fgColor: { rgb: "728A3C" } }, 
      font: { color: { rgb: "FFFFFF" }, bold: true, sz: 14 }, 
      alignment: { horizontal: "center", vertical: "center" },
      border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
    };

    const estiloSubCabecalho = {
      fill: { fgColor: { rgb: "EAE6D5" } },
      font: { bold: true, sz: 10 },
      alignment: { horizontal: "center", vertical: "center" },
      border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
    };

    const estiloNormal = {
      alignment: { horizontal: "center", vertical: "center" },
      border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
    };

    const estiloEsquerda = {
      alignment: { horizontal: "left", vertical: "center", wrapText: true },
      border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
    };

    const ws_data = [];
    const merges = [];

    // 3. Montar Cabeçalhos Superiores (Largura Total = 18 Colunas)
    // Linha 0: DIÁRIO DE OBRA (16 cols) + DATA (2 cols)
    ws_data.push([
      { v: "DIÁRIO DE OBRA", s: estiloCabecalho }, 
      ...Array(15).fill({ v: "", s: estiloCabecalho }), // Preenche invisível para manter a borda
      { v: "DATA", s: estiloCabecalho },
      { v: "", s: estiloCabecalho }
    ]);
    merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 15 } });
    merges.push({ s: { r: 0, c: 16 }, e: { r: 0, c: 17 } });

    // Linha 1: Endereço (16 cols) + Data Valor (2 cols)
    ws_data.push([
      { v: enderecoObra.toUpperCase(), s: estiloCabecalho }, 
      ...Array(15).fill({ v: "", s: estiloCabecalho }),
      { v: dataFormatada, s: { ...estiloNormal, font: { bold: true, sz: 12 } } },
      { v: "", s: estiloNormal }
    ]);
    merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: 15 } });
    merges.push({ s: { r: 1, c: 16 }, e: { r: 1, c: 17 } });

    // 4. Lógica de Blocos de Colaboradores (Chunks de 8)
    const maxCargos = 8;
    const colaboradores = diario.colaboradores || [];
    const chunked = [];
    
    // Divide os colaboradores em grupos de 8
    for (let i = 0; i < colaboradores.length; i += maxCargos) {
      chunked.push(colaboradores.slice(i, i + maxCargos));
    }
    if (chunked.length === 0) chunked.push([]); // Garante que gera pelo menos 1 bloco vazio

    // Calcular somas gerais
    let totalAvisos = 0;
    let totalFaltas = 0;
    colaboradores.forEach(c => {
      totalAvisos += parseInt(c.avisos) || 0;
      totalFaltas += parseInt(c.faltas) || 0;
    });

    let linha_atual = 2; // Rastreador de índice da linha atual (0-based)

    // Gerar cada bloco
    for (let b = 0; b < chunked.length; b++) {
      const chunk = chunked[b];
      const linhaCargos = [];
      const linhaSub = [];
      const linhaValores = [];

      // Preenche os 8 espaços (com dados ou vazios)
      for (let i = 0; i < maxCargos; i++) {
        if (i < chunk.length) {
          const colab = chunk[i];
          linhaCargos.push({ v: colab.cargo.toUpperCase(), s: estiloSubCabecalho }, { v: "", s: estiloSubCabecalho });
          linhaSub.push({ v: "AVISO", s: estiloSubCabecalho }, { v: "FALTAS", s: estiloSubCabecalho });
          linhaValores.push({ v: colab.avisos || 0, s: estiloNormal }, { v: colab.faltas || 0, s: estiloNormal });
        } else {
          linhaCargos.push({ v: "", s: estiloSubCabecalho }, { v: "", s: estiloSubCabecalho });
          linhaSub.push({ v: "AVISO", s: estiloSubCabecalho }, { v: "FALTAS", s: estiloSubCabecalho });
          linhaValores.push({ v: "", s: estiloNormal }, { v: "", s: estiloNormal });
        }
        
        // Mescla o título do cargo sob 2 colunas
        merges.push({ s: { r: linha_atual, c: i * 2 }, e: { r: linha_atual, c: i * 2 + 1 } });
      }

      // Adiciona a secção de TOTAIS apenas no lado direito do PRIMEIRO bloco
      if (b === 0) {
        linhaCargos.push({ v: "TOTAL AVISO", s: estiloSubCabecalho }, { v: "TOTAL FALTAS", s: estiloSubCabecalho });
        linhaSub.push({ v: "", s: estiloSubCabecalho }, { v: "", s: estiloSubCabecalho }); 
        linhaValores.push({ v: totalAvisos, s: estiloNormal }, { v: totalFaltas, s: estiloNormal });

        // Mescla "TOTAL AVISO" e "TOTAL FALTAS" para ocupar as duas primeiras linhas verticais do cabeçalho
        merges.push({ s: { r: linha_atual, c: 16 }, e: { r: linha_atual + 1, c: 16 } });
        merges.push({ s: { r: linha_atual, c: 17 }, e: { r: linha_atual + 1, c: 17 } });
      } else {
        // Se for o segundo, terceiro bloco etc, deixa o lado direito em branco alinhado
        linhaCargos.push({ v: "", s: estiloNormal }, { v: "", s: estiloNormal });
        linhaSub.push({ v: "", s: estiloNormal }, { v: "", s: estiloNormal });
        linhaValores.push({ v: "", s: estiloNormal }, { v: "", s: estiloNormal });
        // Mescla o buraco vazio direito num bloco só (opcional para estética limpa)
        merges.push({ s: { r: linha_atual, c: 16 }, e: { r: linha_atual + 2, c: 17 } });
      }

      ws_data.push(linhaCargos, linhaSub, linhaValores);
      linha_atual += 3; // Avança 3 linhas para o próximo bloco/secção
    }

    // 5. Bloco de Descrição (Acompanha até ao final das 18 colunas)
    ws_data.push([
      { v: "DESCRIÇÃO DOS SERVIÇOS", s: estiloCabecalho }, 
      ...Array(17).fill({ v: "", s: estiloCabecalho })
    ]);
    merges.push({ s: { r: linha_atual, c: 0 }, e: { r: linha_atual, c: 17 } });
    linha_atual++;

    const descricoes = diario.descricoes?.length ? diario.descricoes : [{texto: ""}];
    descricoes.forEach(desc => {
      ws_data.push([{ v: desc.texto, s: estiloEsquerda }, ...Array(17).fill({ v: "", s: estiloEsquerda })]);
      merges.push({ s: { r: linha_atual, c: 0 }, e: { r: linha_atual, c: 17 } });
      linha_atual++;
    });

    // 6. Bloco de Observações (Acompanha até ao final das 18 colunas)
    ws_data.push([
      { v: "OBSERVAÇÕES", s: estiloCabecalho }, 
      ...Array(17).fill({ v: "", s: estiloCabecalho })
    ]);
    merges.push({ s: { r: linha_atual, c: 0 }, e: { r: linha_atual, c: 17 } });
    linha_atual++;

    const observacoes = diario.observacoes?.length ? diario.observacoes : [{texto: ""}];
    observacoes.forEach(obs => {
      ws_data.push([{ v: obs.texto, s: estiloEsquerda }, ...Array(17).fill({ v: "", s: estiloEsquerda })]);
      merges.push({ s: { r: linha_atual, c: 0 }, e: { r: linha_atual, c: 17 } });
      linha_atual++;
    });

    // 7. Configuração e Exportação
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    ws['!merges'] = merges;
    
    // Ajuste da largura das 18 colunas
    ws['!cols'] = Array(18).fill({ wch: 11 }); 
    ws['!cols'][0] = { wch: 15 }; // Primeira coluna um pouco maior

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Diário");

    // Mantido o Date.now() para burlar o cache do Android
    const excelBase64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    const nomeFicheiro = `Diario_${dataFormatada.replace(/\//g, '-')}_${Date.now()}.xlsx`;
    const filePath = FileSystem.documentDirectory + nomeFicheiro;

    await FileSystem.writeAsStringAsync(filePath, excelBase64, { encoding: FileSystem.EncodingType.Base64 });

    await Sharing.shareAsync(filePath, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Partilhar Diário de Obra'
    });

  } catch (error) {
    console.error("Erro ao gerar Excel:", error);
    alert("Não foi possível gerar a planilha.");
  }
};