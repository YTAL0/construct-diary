import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDiaryViewModel } from '../viewmodels/useDiaryViewModel';

const ColaboradorCard = ({ item, updateColaborador, removeColaborador }) => {
  const inputRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false); 

return (
    <View style={[
      styles.card, 
      !isExpanded && { 
        paddingVertical: 5,       
        paddingHorizontal: 20,    
        borderRadius: 15,         
        elevation: 4,             
        shadowColor: '#000',     
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3
      }
    ]}>
      <View style={[styles.cardHeader, !isExpanded && { marginBottom: 0 }]}>
        <TextInput 
          ref={inputRef}
          style={styles.roleInput} 
          value={item.cargo} 
          onChangeText={(text) => updateColaborador(item.id, 'cargo', text)}
        />
        
        {}
        {isExpanded && (
          <TouchableOpacity onPress={() => inputRef.current?.focus()} style={{ padding: 5, marginRight: 5 }}>
            <Ionicons name="pencil" size={18} color="#007AFF" />
          </TouchableOpacity>
        )}

        {}
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={{ padding: 5 }}>
          <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      {}
      {isExpanded && (
        <>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Faltas</Text>
            <TextInput 
              style={styles.numberInput} 
              value={item.faltas} 
              onChangeText={(text) => updateColaborador(item.id, 'faltas', text)}
              keyboardType="numeric"
              maxLength={1}
            />
          </View>
          
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Avisos</Text>
            <TextInput 
              style={styles.numberInput} 
              value={item.avisos} 
              onChangeText={(text) => updateColaborador(item.id, 'avisos', text)}
              keyboardType="numeric"
              maxLength={1}
            />
          </View>

          <TouchableOpacity style={styles.deleteIcon} onPress={() => removeColaborador(item.id)}>
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const TextoCard = ({ item, updateFunc, removeFunc }) => {
  const inputRef = useRef(null);

  return (
    <View style={styles.textCard}>
      <TouchableOpacity style={styles.iconButton} onPress={() => removeFunc(item.id)}>
        <Ionicons name="trash" size={20} color="red" />
      </TouchableOpacity>
      
      <TextInput 
        ref={inputRef}
        style={styles.textArea} 
        value={item.texto} 
        onChangeText={(text) => updateFunc(item.id, text)}
        placeholder="Digite aqui..."
        multiline
      />
      
      <TouchableOpacity style={styles.iconButton} onPress={() => inputRef.current?.focus()}>
        <Ionicons name="pencil" size={20} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
};

const FotoCard = ({ item, removeFunc }) => {
  return (
    <View style={styles.fotoWrapper}>
      <Image source={{ uri: item.uri }} style={styles.fotoImage} />
      <TouchableOpacity style={styles.fotoDeleteIcon} onPress={() => removeFunc(item.id)}>
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

export function NewDiaryScreen({ route, navigation }) {
  const { projeto } = route.params;
  const { 
    colaboradores, addColaborador, updateColaborador, removeColaborador,
    descricoes, addDescricao, updateDescricao, removeDescricao,
    observacoes, addObservacao, updateObservacao, removeObservacao,
    fotos, addFoto, removeFoto,
    saveDiario, isLoading
  } = useDiaryViewModel();

  const dataAtual = new Date();
  const dataFormatada = `${String(dataAtual.getDate()).padStart(2, '0')}/${String(dataAtual.getMonth() + 1).padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Diário de obra {dataFormatada}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Colaboradores</Text>
          {colaboradores.map(c => (
            <ColaboradorCard 
              key={c.id} 
              item={c} 
              updateColaborador={updateColaborador} 
              removeColaborador={removeColaborador} 
            />
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addColaborador}>
            <Text style={styles.addButtonText}>ADICIONAR</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição dos serviços</Text>
          {descricoes.map(d => (
            <TextoCard 
              key={d.id} 
              item={d} 
              updateFunc={updateDescricao} 
              removeFunc={removeDescricao} 
            />
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addDescricao}>
            <Text style={styles.addButtonText}>ADICIONAR</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          {observacoes.map(o => (
            <TextoCard 
              key={o.id} 
              item={o} 
              updateFunc={updateObservacao} 
              removeFunc={removeObservacao} 
            />
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addObservacao}>
            <Text style={styles.addButtonText}>ADICIONAR</Text>
          </TouchableOpacity>
        </View>
          {}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fotos</Text>
          
          <View style={styles.fotosContainer}>
            {fotos.map(f => (
              <FotoCard key={f.id} item={f} removeFunc={removeFoto} />
            ))}
          </View>

          <TouchableOpacity style={styles.addButton} onPress={addFoto}>
            <Text style={styles.addButtonText}>ADICIONAR</Text>
          </TouchableOpacity>
        </View>
        {}
        {isLoading ? (
          <ActivityIndicator size="large" color="#F47B20" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={() => saveDiario(projeto.id, () => navigation.goBack())}
          >
            <Text style={styles.saveButtonText}>SALVAR DIÁRIO</Text>
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
  section: { alignItems: 'center', marginBottom: 40 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#F47B20', marginBottom: 15 },
  addButton: { backgroundColor: '#F47B20', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 10, marginTop: 10 },
  addButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  card: { backgroundColor: '#F0F0F0', borderRadius: 10, padding: 15, width: '80%', alignSelf: 'center', marginBottom: 15, position: 'relative' },
  cardHeader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  roleInput: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginRight: 5, minWidth: 100 },
  cardRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  cardLabel: { fontSize: 14, fontWeight: 'bold', width: 60 },
  numberInput: { backgroundColor: '#E0E0E0', borderRadius: 5, width: 40, height: 30, textAlign: 'center', fontWeight: 'bold', padding: 0 },
  deleteIcon: { position: 'absolute', bottom: 15, left: 15 },
  textCard: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 10, padding: 10, width: '100%', marginBottom: 15, alignItems: 'center' },
  textArea: { flex: 1, minHeight: 40, fontSize: 14, paddingHorizontal: 10, textAlign: 'center' },
  iconButton: { padding: 5 },
  fotosContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, width: '100%' },
  fotoWrapper: { alignItems: 'center', marginBottom: 15 },
  fotoImage: { width: 110, height: 110, borderRadius: 10, backgroundColor: '#E0E0E0' },
  fotoDeleteIcon: { marginTop: 10 },
  saveButton: { backgroundColor: '#F47B20', paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginTop: 30, marginHorizontal: 10 },
  saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
  
});