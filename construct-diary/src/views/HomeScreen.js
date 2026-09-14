import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../services/supabase';

export function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Welcome');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar} />
      
      <View style={styles.content}>
        <Text style={styles.title}>Meus Diários</Text>
        <Text style={styles.subtitle}>Nenhum relatório gerado ainda.</Text>

        <TouchableOpacity style={styles.button} onPress={() => alert('Criação em breve!')}>
          <Text style={styles.buttonText}>+ NOVO RELATÓRIO</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  topBar: { height: 60, backgroundColor: '#F47B20' },
  content: { flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 40 },
  button: { backgroundColor: '#F47B20', width: '100%', paddingVertical: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  logoutButton: { padding: 20, alignItems: 'center', marginBottom: 20 },
  logoutText: { color: 'red', fontSize: 16, fontWeight: 'bold' }
});