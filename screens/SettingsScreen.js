import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const SettingScreen = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const navigation = useNavigation();

  const images = Array.from({ length: 10 }, (_, index) => ({
    id: index,
    source: '', // You can replace this with your actual image source
  }));

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image style={styles.image} source={{ uri: item.source }} />
      <TouchableOpacity
        style={[styles.button, selectedImageIndex === item.id ? styles.buttonSelected : {}]}
        onPress={() => setSelectedImageIndex(item.id)}
      >
        <Text style={styles.buttonText}>Use</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </TouchableOpacity>
        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 50,
    height: 50,
    backgroundColor: 'gray', // Replace this with the actual background color or remove it if you have image sources
  },
  button: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonSelected: {
    backgroundColor: '#007aff',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
  },
  goBackButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  goBackButtonText: {
    fontSize: 16,
    color: '#007aff',
  },
});

export default SettingScreen;