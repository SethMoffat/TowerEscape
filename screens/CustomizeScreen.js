import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const CustomizeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customize</Text>
      <Button title='back' />
      {/* Add your customization components here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CustomizeScreen;