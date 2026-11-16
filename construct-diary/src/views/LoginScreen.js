import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthViewModel } from '../viewmodels/useAuthViewModel';

export function LoginScreen({ navigation }) {
  const { 
    email, setEmail, 
    password, setPassword, 
    rememberMe, setRememberMe,
    isLoading, 
    handleSignIn 
  } = useAuthViewModel();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#FFF' }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topBar} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Login</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput 
              style={styles.input} 
              placeholder="E-mail" 
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
                placeholder="Senha" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry={!showPassword} 
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#F47B20" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={() => setRememberMe(!rememberMe)}
            >
              <Ionicons name={rememberMe ? "checkbox" : "square-outline"} size={22} color="#F47B20" />
              <Text style={styles.checkboxText}>Lembrar e-mail</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
              <Text style={{ color: '#F47B20', textAlign: 'center', marginTop: 15 }}>Esqueceu a sua senha?</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#F47B20" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => handleSignIn(() => navigation.replace('Home'))}>
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerText}>
              Não tem conta? <Text style={styles.link}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomBar} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topBar: { height: 60, backgroundColor: '#F47B20' },
  bottomBar: { height: 60, backgroundColor: '#F47B20' },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center' 
  },
  content: { paddingHorizontal: 30, paddingVertical: 20 },
  logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  inputContainer: { marginBottom: 15, borderWidth: 1, borderColor: '#F47B20', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 5 },
  inputLabel: { fontSize: 12, color: '#F47B20', marginBottom: -5 },
  input: { height: 40, fontSize: 16 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  passwordInput: { flex: 1, height: 40, fontSize: 16 },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkboxText: { marginLeft: 8, fontSize: 14, color: '#000' },
  
  button: { backgroundColor: '#F47B20', width: '100%', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  footerText: { textAlign: 'center', color: '#000', fontSize: 14, marginTop: 10 },
  link: { textDecorationLine: 'underline', fontWeight: 'bold', color: '#F47B20' }
});