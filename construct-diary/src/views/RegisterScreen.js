import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useAuthViewModel } from '../viewmodels/useAuthViewModel';

export function RegisterScreen({ navigation }) {
  const { 
    email, setEmail, 
    password, setPassword, 
    confirmPassword, setConfirmPassword, 
    isLoading, 
    handleSignUp 
  } = useAuthViewModel();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.topBar} />

      <View style={styles.content}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Criar Conta</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>E-mail</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Digite seu e-mail" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Senha</Text>
          <View style={styles.passwordRow}>
            <TextInput 
              style={styles.passwordInput} 
              placeholder="Crie uma senha" 
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry={!showPassword} 
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#F47B20" />
            </TouchableOpacity>
          </View>
        </View>

        {}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirmar Senha</Text>
          <View style={styles.passwordRow}>
            <TextInput 
              style={styles.passwordInput} 
              placeholder="Repita sua senha" 
              value={confirmPassword} 
              onChangeText={setConfirmPassword} 
              secureTextEntry={!showConfirmPassword} 
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="#F47B20" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 20 }} />

        {isLoading ? (
          <ActivityIndicator size="large" color="#F47B20" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>CADASTRAR</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>
            Já tem uma conta? <Text style={styles.link}>Faça login</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', justifyContent: 'space-between' },
  topBar: { height: 60, backgroundColor: '#F47B20' },
  bottomBar: { height: 60, backgroundColor: '#F47B20' },
  content: { flex: 1, paddingHorizontal: 30, justifyContent: 'center' },
  logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  inputContainer: { marginBottom: 15, borderWidth: 1, borderColor: '#F47B20', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 5 },
  inputLabel: { fontSize: 12, color: '#F47B20', marginBottom: -5 },
  input: { height: 40, fontSize: 16 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, // Coloca o input e o ícone lado a lado
  passwordInput: { flex: 1, height: 40, fontSize: 16 }, // Faz o input ocupar o espaço sobrando
  button: { backgroundColor: '#F47B20', width: '100%', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  footerText: { textAlign: 'center', color: '#000', fontSize: 14, marginTop: 10 },
  link: { textDecorationLine: 'underline', fontWeight: 'bold', color: '#F47B20' }
});