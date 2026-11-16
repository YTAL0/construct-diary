import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useProjectDetailsViewModel } from '../viewmodels/useProjectDetailsViewModel';
import { exportarDiarioParaExcel } from '../services/excelService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../services/supabase'; 

export function ProjectDetailsScreen({ route, navigation }) {
  const { projeto } = route.params;
  const { diarios, isLoading, fetchDiarios } = useProjectDetailsViewModel(projeto.id);

  useFocusEffect(
    useCallback(() => {
      fetchDiarios();
    }, [fetchDiarios])
  );
  const handleDeleteDiario = (diarioId, fotosDoDiario) => {
    Alert.alert(
      "Excluir Diário",
      "Tem certeza de que deseja excluir este diário de obra? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              if (fotosDoDiario && fotosDoDiario.length > 0) {
                const arquivosParaApagar = [];
                fotosDoDiario.forEach(foto => {
                  if (foto.uri) {
                    const partes = foto.uri.split('/');
                    const nomeArquivo = partes[partes.length - 1];
                    if (nomeArquivo) arquivosParaApagar.push(nomeArquivo);
                  }
                });

                if (arquivosParaApagar.length > 0) {
                  await supabase.storage
                    .from('fotos_diario')
                    .remove(arquivosParaApagar);
                }
              }
              const { error } = await supabase
                .from('diarios')
                .delete()
                .eq('id', diarioId);

              if (error) throw error;

              fetchDiarios();
              Alert.alert("Sucesso", "Diário excluído com sucesso.");
            } catch (error) {
              console.error("Erro ao excluir diário:", error.message);
              Alert.alert("Erro", "Não foi possível excluir o diário.");
            }
          }
        }
      ]
    );
  };

  const renderDiario = ({ item }) => {
    const [ano, mes, dia] = item.data.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;

    return (
      <TouchableOpacity 
        style={styles.diarioCard}
        onPress={() => {
          navigation.navigate('NewDiary', { 
            projeto: projeto, 
            diario: item 
          });
        }}
        onLongPress={() => handleDeleteDiario(item.id, item.fotos)} 
        delayLongPress={500}
      >
        <Ionicons name="document-text" size={30} color="#F47B20" />
        <View style={styles.diarioInfo}>
          <Text style={styles.diarioTitle}>Diário de Obra</Text>
          <Text style={styles.diarioDate}>{dataFormatada}</Text>
        </View>

        {}
        <TouchableOpacity 
          style={{ padding: 10, backgroundColor: '#E8F5E9', borderRadius: 8 }}
          onPress={() => exportarDiarioParaExcel(projeto, item)}
        >
          <Ionicons name="download-outline" size={24} color="#28A745" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#F47B20' }}>
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle} numberOfLines={1}>
            {projeto.nome_projeto}
          </Text>
        </View>
      </SafeAreaView>

      {isLoading ? (
        <ActivityIndicator size="large" color="#F47B20" style={{ marginTop: 50 }} />
      ) : diarios.length === 0 ? (
        <View style={styles.content}>
          <Text style={styles.emptyText}>
            Sua pasta de diarios está vazia,{'\n'}
            aperte no icione de "+" para criar um{'\n'}
            novo diário
          </Text>
        </View>
      ) : (
        <FlatList
          data={diarios}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderDiario}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('NewDiary', { projeto })}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  topBar: { height: 60, backgroundColor: '#F47B20', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15 },
  topBarTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  emptyText: { textAlign: 'center', color: '#F47B20', fontSize: 16, lineHeight: 24 },
  
  diarioCard: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#EEEEEE'
  },
  diarioInfo: { flex: 1, marginLeft: 15 },
  diarioTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  diarioDate: { fontSize: 14, color: '#666', marginTop: 3 },

  fab: { 
    position: 'absolute', bottom: 30, right: 30, backgroundColor: '#F47B20', width: 60, height: 60, 
    borderRadius: 30, justifyContent: 'center', alignItems: 'center',
    elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3
  }
});