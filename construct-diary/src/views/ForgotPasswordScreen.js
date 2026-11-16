import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForgotPasswordViewModel } from '../viewmodels/useForgotPasswordViewModel';

export function ForgotPasswordScreen({ navigation }) {
  const { email, setEmail, handleResetPassword, isLoading } = useForgotPasswordViewModel();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Recuperar Senha</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.instructionText}>
          Informe o e-mail associado à sua conta para receber as instruções de redefinição de senha.
        </Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail} 
          placeholder="seu@email.com" 
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#F47B20" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => handleResetPassword(() => navigation.goBack())}
          >
            <Text style={styles.buttonText}>ENVIAR E-MAIL DE RECUPERAÇÃO</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  topBar: { height: 60, backgroundColor: '#F47B20', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  backButton: { marginRight: 15 },
  topBarTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 30, flex: 1, justifyContent: 'center' },
  instructionText: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center', lineHeight: 22 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  input: { backgroundColor: '#F0F0F0', borderRadius: 8, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#DDD', marginBottom: 20 },
  button: { backgroundColor: '#F47B20', padding: 15, borderRadius: 25, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});