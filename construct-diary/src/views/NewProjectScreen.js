import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useProjectViewModel } from '../viewmodels/useProjectViewModel';

export function NewProjectScreen({ navigation }) {
  const {
    engenheiro, setEngenheiro,
    empresa, setEmpresa,
    nomeProjeto, setNomeProjeto,
    cep, setCep,
    cidade, setCidade,
    bairro, setBairro,
    isLoading, saveProjeto
  } = useProjectViewModel();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Projetos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Dados do projeto</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Engenheiro responsável</Text>
          <TextInput style={styles.input} value={engenheiro} onChangeText={setEngenheiro} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome da empresa</Text>
          <TextInput style={styles.input} value={empresa} onChangeText={setEmpresa} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do projeto</Text>
          <TextInput style={styles.input} value={nomeProjeto} onChangeText={setNomeProjeto} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>CEP</Text>
          <TextInput style={styles.input} value={cep} onChangeText={setCep} keyboardType="numeric" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cidade</Text>
          <TextInput style={styles.input} value={cidade} onChangeText={setCidade} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bairro</Text>
          <TextInput style={styles.input} value={bairro} onChangeText={setBairro} />
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#F47B20" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => saveProjeto(() => navigation.goBack())}
          >
            <Text style={styles.buttonText}>Salvar</Text>
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
  content: { padding: 30, paddingBottom: 50 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#F47B20', textAlign: 'center', marginBottom: 30 },
  inputGroup: { marginBottom: 15 },
  label: { color: '#F47B20', fontWeight: 'bold', textAlign: 'center', marginBottom: 5, fontSize: 14 },
  input: { backgroundColor: '#E0E0E0', borderRadius: 15, height: 45, paddingHorizontal: 15, fontSize: 16 },
  button: { backgroundColor: '#F47B20', paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginTop: 20, marginHorizontal: 30 },
  buttonText: { color: '#FFF', fontSize: 22, fontWeight: 'bold' }
});