import ExcelJS from 'exceljs/dist/exceljs.min.js';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { encode } from 'base64-arraybuffer'; // O mesmo conversor que já usamos no Supabase!

export const exportarDiarioParaExcel = async (projeto, diario) => {
  try {
    const [ano, mes, dia] = diario.data.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;
    const enderecoObra = `OBRA: ${projeto.nome_projeto || ''} - ${projeto.bairro || ''}, ${projeto.cidade || ''} - CE, ${projeto.cep || ''}`;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Diário');

    // Configuração de largura (18 colunas mantendo a proporção)
    for (let i = 1; i <= 18; i++) {
      ws.getColumn(i).width = 11;
    }
    ws.getColumn(1).width = 15; // A primeira coluna precisa ser maior para a palavra "DIÁRIO"

    // Função interna para formatar as cores e bordas no novo formato do ExcelJS
    const applyStyle = (cell, type) => {
      cell.border = {
        top: { style: 'thin' }, bottom: { style: 'thin' },
        left: { style: 'thin' }, right: { style: 'thin' }
      };
      if (type === 'cabecalho') {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF728A3C' } }; // Verde Oliva
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 14 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if (type === 'subcabecalho') {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEAE6D5' } }; // Cinza Claro
        cell.font = { bold: true, size: 10 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if (type === 'normal') {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if (type === 'esquerda') {
        cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      }
    };

    let currentRow = 1;

    // 1. Linhas de Título Superiores
    ws.addRow(["DIÁRIO DE OBRA", ...Array(15).fill(""), "DATA", ""]);
    ws.mergeCells(currentRow, 1, currentRow, 16);
    ws.mergeCells(currentRow, 17, currentRow, 18);
    ws.getRow(currentRow).eachCell(c => applyStyle(c, 'cabecalho'));
    currentRow++;

    ws.addRow([enderecoObra.toUpperCase(), ...Array(15).fill(""), dataFormatada, ""]);
    ws.mergeCells(currentRow, 1, currentRow, 16);
    ws.mergeCells(currentRow, 17, currentRow, 18);
    ws.getRow(currentRow).eachCell((c, col) => applyStyle(c, col <= 16 ? 'cabecalho' : 'normal'));
    ws.getRow(currentRow).getCell(17).font = { bold: true, size: 12 };
    currentRow++;

    // 2. Lógica de Blocos de Colaboradores (Chunks de 8)
    const maxCargos = 8;
    const colaboradores = diario.colaboradores || [];
    const chunkedCargos = [];
    for (let i = 0; i < colaboradores.length; i += maxCargos) {
      chunkedCargos.push(colaboradores.slice(i, i + maxCargos));
    }
    if (chunkedCargos.length === 0) chunkedCargos.push([]);

    let totalAvisos = 0; let totalFaltas = 0;
    colaboradores.forEach(c => { totalAvisos += parseInt(c.avisos) || 0; totalFaltas += parseInt(c.faltas) || 0; });

    chunkedCargos.forEach((chunk, index) => {
      const rowCargos = ws.addRow(Array(18).fill(""));
      const rowSub = ws.addRow(Array(18).fill(""));
      const rowValores = ws.addRow(Array(18).fill(""));

      for (let i = 0; i < maxCargos; i++) {
        const c = i * 2 + 1;
        if (i < chunk.length) {
          const colab = chunk[i];
          rowCargos.getCell(c).value = colab.cargo.toUpperCase();
          rowSub.getCell(c).value = "AVISO"; rowSub.getCell(c + 1).value = "FALTAS";
          rowValores.getCell(c).value = parseInt(colab.avisos) || 0;
          rowValores.getCell(c + 1).value = parseInt(colab.faltas) || 0;
        } else {
          rowSub.getCell(c).value = "AVISO"; rowSub.getCell(c + 1).value = "FALTAS";
        }
        ws.mergeCells(currentRow, c, currentRow, c + 1);
        applyStyle(rowCargos.getCell(c), 'subcabecalho'); applyStyle(rowCargos.getCell(c+1), 'subcabecalho');
        applyStyle(rowSub.getCell(c), 'subcabecalho'); applyStyle(rowSub.getCell(c+1), 'subcabecalho');
        applyStyle(rowValores.getCell(c), 'normal'); applyStyle(rowValores.getCell(c+1), 'normal');
      }

      if (index === 0) {
        rowCargos.getCell(17).value = "TOTAL AVISO"; rowCargos.getCell(18).value = "TOTAL FALTAS";
        rowValores.getCell(17).value = totalAvisos; rowValores.getCell(18).value = totalFaltas;
        ws.mergeCells(currentRow, 17, currentRow + 1, 17); ws.mergeCells(currentRow, 18, currentRow + 1, 18);
        applyStyle(rowCargos.getCell(17), 'subcabecalho'); applyStyle(rowCargos.getCell(18), 'subcabecalho');
        applyStyle(rowValores.getCell(17), 'normal'); applyStyle(rowValores.getCell(18), 'normal');
      } else {
        ws.mergeCells(currentRow, 17, currentRow + 2, 18);
        applyStyle(rowCargos.getCell(17), 'normal'); applyStyle(rowCargos.getCell(18), 'normal');
      }
      currentRow += 3;
    });

    // 3. Descrições
    ws.addRow(["DESCRIÇÃO DOS SERVIÇOS", ...Array(17).fill("")]);
    ws.mergeCells(currentRow, 1, currentRow, 18);
    ws.getRow(currentRow).eachCell(c => applyStyle(c, 'cabecalho'));
    currentRow++;

    const descricoes = diario.descricoes?.length ? diario.descricoes : [{texto: ""}];
    descricoes.forEach(desc => {
      ws.addRow([desc.texto, ...Array(17).fill("")]);
      ws.mergeCells(currentRow, 1, currentRow, 18);
      ws.getRow(currentRow).eachCell(c => applyStyle(c, 'esquerda'));
      currentRow++;
    });

    // 4. Observações
    ws.addRow(["OBSERVAÇÕES", ...Array(17).fill("")]);
    ws.mergeCells(currentRow, 1, currentRow, 18);
    ws.getRow(currentRow).eachCell(c => applyStyle(c, 'cabecalho'));
    currentRow++;

    const observacoes = diario.observacoes?.length ? diario.observacoes : [{texto: ""}];
    observacoes.forEach(obs => {
      ws.addRow([obs.texto, ...Array(17).fill("")]);
      ws.mergeCells(currentRow, 1, currentRow, 18);
      ws.getRow(currentRow).eachCell(c => applyStyle(c, 'esquerda'));
      currentRow++;
    });
    
    ws.addRow(["FOTOS", ...Array(17).fill("")]);
    ws.mergeCells(currentRow, 1, currentRow, 18);
    ws.getRow(currentRow).eachCell(c => applyStyle(c, 'cabecalho'));
    currentRow++;

    const fotos = diario.fotos || [];
    if (fotos.length > 0) {

      const fotosChunked = [];
      for (let i = 0; i < fotos.length; i += 4) {
        fotosChunked.push(fotos.slice(i, i + 4));
      }
      const colSpans = [
        { s: 0, e: 4, mergeS: 1, mergeE: 4 },    
        { s: 4, e: 9, mergeS: 5, mergeE: 9 },    
        { s: 9, e: 14, mergeS: 10, mergeE: 14 }, 
        { s: 14, e: 18, mergeS: 15, mergeE: 18 } 
      ];

      for (const chunk of fotosChunked) {
        const imgRow = ws.addRow(Array(18).fill(""));
        imgRow.height = 160; 
        ws.mergeCells(currentRow, colSpans[0].mergeS, currentRow, colSpans[0].mergeE);
        ws.mergeCells(currentRow, colSpans[1].mergeS, currentRow, colSpans[1].mergeE);
        ws.mergeCells(currentRow, colSpans[2].mergeS, currentRow, colSpans[2].mergeE);
        ws.mergeCells(currentRow, colSpans[3].mergeS, currentRow, colSpans[3].mergeE);
        imgRow.eachCell(c => applyStyle(c, 'normal')); 

        for (let i = 0; i < chunk.length; i++) {
          try {
            const localUri = FileSystem.cacheDirectory + 'img_' + Date.now() + i + '.jpg';
            const { uri } = await FileSystem.downloadAsync(chunk[i].uri, localUri);
            
            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

            const imageId = wb.addImage({
              base64: 'data:image/jpeg;base64,' + base64,
              extension: 'jpeg',
            });

            ws.addImage(imageId, {
              tl: { col: colSpans[i].s, row: currentRow - 1 },
              br: { col: colSpans[i].e, row: currentRow },
              editAs: 'oneCell' 
            });
          } catch (err) {
            console.log("Erro ao embutir foto:", err);
          }
        }
        currentRow++;
      }
    } else {
       ws.addRow(["Nenhum registro fotográfico nesta data.", ...Array(17).fill("")]);
       ws.mergeCells(currentRow, 1, currentRow, 18);
       ws.getRow(currentRow).eachCell(c => applyStyle(c, 'normal'));
       currentRow++;
    }

    const uint8Array = await wb.xlsx.writeBuffer();
    const base64Excel = encode(uint8Array); 

    const nomeFicheiro = `Diario_${dataFormatada.replace(/\//g, '-')}_${Date.now()}.xlsx`;
    const filePath = FileSystem.documentDirectory + nomeFicheiro;

    await FileSystem.writeAsStringAsync(filePath, base64Excel, { encoding: FileSystem.EncodingType.Base64 });

    await Sharing.shareAsync(filePath, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Partilhar Diário de Obra'
    });

  } catch (error) {
    console.error("Erro ao gerar Excel:", error);
    alert("Não foi possível gerar a planilha.");
  }
};