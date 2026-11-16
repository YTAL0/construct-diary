import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useProjectViewModel } from '../viewmodels/useProjectViewModel';

export function HomeScreen({ navigation }) {
  const { projetos, isLoading, fetchProjetos } = useProjectViewModel();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProjetos();
    });
    return unsubscribe;
  }, [navigation]);

  const renderFolder = ({ item }) => (
    <TouchableOpacity 
      style={styles.folderContainer}
      onPress={() => navigation.navigate('ProjectDetails', { projeto: item })}
    >
      <View style={styles.folderTab} />
      <View style={styles.folderBody}>
        <Text style={styles.folderText}>{item.nome_projeto}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {}
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#F47B20' }}>
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Projetos</Text>
        </View>
      </SafeAreaView>
      
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#F47B20" />
        ) : (
          <FlatList
            data={projetos}
            keyExtractor={(item, index) => item.id ? String(item.id) : String(index)}
            renderItem={renderFolder}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum projeto encontrado.</Text>}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('NewProject')}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  topBar: { 
    height: 60, 
    backgroundColor: '#F47B20', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  topBarTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, padding: 20 },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
  folderContainer: { marginBottom: 20 },
  folderTab: { width: 80, height: 15, backgroundColor: '#F47B20', borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  folderBody: { backgroundColor: '#F47B20', borderRadius: 10, borderTopLeftRadius: 0, paddingVertical: 40, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  folderText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  fab: { 
    position: 'absolute', 
    bottom: 30, 
    right: 30, 
    backgroundColor: '#F47B20', 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  }
});