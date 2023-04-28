import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

const CustomizeScreen = () => {
  const navigation = useNavigation();

  const customizationItems = [
    { id: 1, name: 'hat-wizard', color: 'red', price: 100 },
    { id: 2, name: 'glasses', color: 'blue', price: 50 },
    { id: 3, name: 'tshirt', color: 'green', price: 75 },
    { id: 4, name: 'shoe-prints', color: 'purple', price: 120 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Customize</Text>
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.customizationList}>
          {customizationItems.map((item) => (
            <View key={item.id} style={styles.customizationItem}>
              <FontAwesome5 name={item.name} size={48} color={item.color} />
              <Text style={styles.itemPrice}>{item.price} Coins</Text>
              <TouchableOpacity style={styles.purchaseButton}>
                <Text style={styles.purchaseButtonText}>Buy</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
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
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  goBackButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  goBackButtonText: {
    fontSize: 16,
    color: '#007aff',
  },
  customizationList: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  customizationItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  purchaseButton: {
    backgroundColor: '#007aff',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  purchaseButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default CustomizeScreen;