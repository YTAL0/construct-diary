import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useProjectViewModel } from '../viewmodels/useProjectViewModel';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ProjectFormScreen({ route, navigation }) {
  const { projeto } = route.params || {}; 

  const {
    engenheiro, setEngenheiro,
    empresa, setEmpresa,
    nomeProjeto, setNomeProjeto,
    cep, setCep,
    cidade, setCidade,
    bairro, setBairro,
    saveProjeto, isLoading, isEditing
  } = useProjectViewModel(projeto);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#F47B20' }}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>
          {isEditing ? 'Editar Projeto' : 'Novo Projeto'}
        </Text>
      </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Nome do Projeto</Text>
        <TextInput style={styles.input} value={nomeProjeto} onChangeText={setNomeProjeto} placeholder="Ex: Obra Centro" />

        <Text style={styles.label}>Engenheiro Responsável</Text>
        <TextInput style={styles.input} value={engenheiro} onChangeText={setEngenheiro} placeholder="Nome do engenheiro" />

        <Text style={styles.label}>Empresa</Text>
        <TextInput style={styles.input} value={empresa} onChangeText={setEmpresa} placeholder="Nome da empresa" />

        <Text style={styles.label}>CEP</Text>
        <TextInput style={styles.input} value={cep} onChangeText={setCep} keyboardType="numeric" placeholder="00000-000" />

        <Text style={styles.label}>Cidade</Text>
        <TextInput style={styles.input} value={cidade} onChangeText={setCidade} placeholder="Cidade" />

        <Text style={styles.label}>Bairro</Text>
        <TextInput style={styles.input} value={bairro} onChangeText={setBairro} placeholder="Bairro" />

        {isLoading ? (
          <ActivityIndicator size="large" color="#F47B20" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={() => saveProjeto(() => navigation.goBack())}
          >
            <Text style={styles.saveButtonText}>
              {isEditing ? 'SALVAR ALTERAÇÕES' : 'CRIAR PROJETO'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  topBar: { height: 60, backgroundColor: '#F47B20', justifyContent: 'center', alignItems: 'center' },
  topBarTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  form: { padding: 20, paddingBottom: 50 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5, marginTop: 15 },
  input: { backgroundColor: '#F0F0F0', borderRadius: 8, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#DDD' },
  saveButton: { backgroundColor: '#F47B20', padding: 15, borderRadius: 25, alignItems: 'center', marginTop: 30 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});