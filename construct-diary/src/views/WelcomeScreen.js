import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topBar} />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.title}><Text style={styles.titleOrange}>Construct</Text>-Diary</Text>
        <Text style={styles.subtitle}>Diário de Obras {"\n"}Registro  diário das suas construções</Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>ENTRAR</Text>
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
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  logoContainer: { marginBottom: 30 },
  logo: { width: 220, height: 220 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  titleOrange: { color: '#F47B20' },
  subtitle: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 40 },
  subtitle: { fontSize: 14, color: '#555', textAlign: 'center', marginTop: 80, marginBottom: 40 },
  button: { backgroundColor: '#F47B20', width: '100%', paddingVertical: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});