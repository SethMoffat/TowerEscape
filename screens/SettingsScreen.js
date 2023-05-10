import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const SettingScreen = () => {
  const navigation = useNavigation();
  const [isClassicMode, setIsClassicMode] = useState(true);
  const [isMusicOn, setIsMusicOn] = useState(false);

  const handleClassicModePress = () => {
    setIsClassicMode(true);
  };

  const handlePeacefulModePress = () => {
    setIsClassicMode(false);
  };

  const handleMusicToggle = () => {
    setIsMusicOn(!isMusicOn);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.content}>
          <View style={styles.toggleButtons}>
            <TouchableOpacity
              style={[styles.toggleButton, isClassicMode ? styles.toggleButtonSelected : {}]}
              onPress={handleClassicModePress}
            >
              <Icon name="gamepad-variant" size={24} color="#fff" />
              <Text style={[styles.toggleButtonText, isClassicMode ? styles.selectedButtonText : {}]}>Classic mode</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, !isClassicMode ? styles.toggleButtonSelected : {}]}
              onPress={handlePeacefulModePress}
            >
              <Icon name="nature" size={24} color="#fff" />
              <Text style={[styles.toggleButtonText, !isClassicMode ? styles.selectedButtonText : {}]}>Peaceful mode</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.musicButtons}>
            <TouchableOpacity
              style={[styles.musicButton, isMusicOn ? styles.musicButtonSelected : {}]}
              onPress={handleMusicToggle}
            >
              <Icon name="music-box-outline" size={24} color="#fff" />
              <Text style={styles.musicButtonText}>Music On</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.musicButton, !isMusicOn ? styles.musicButtonSelected : {}]}
              onPress={handleMusicToggle}
            >
              <Icon name="music-box" size={24} color="#fff" />
              <Text style={styles.musicButtonText}>Music Off</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#222',
  },
  container: {
    flex: 1,
  },
  goBackButton: {
    position: 'absolute',
    left: 15,
    top: 15,
    zIndex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 50,
    marginBottom: 30,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
marginBottom: 30,
},
toggleButton: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
width: 140,
height: 60,
borderRadius: 30,
borderWidth: 1,
borderColor: '#fff',
paddingHorizontal: 20,
},
toggleButtonSelected: {
backgroundColor: '#007aff',
},
toggleButtonText: {
marginLeft: 10,
fontSize: 18,
fontWeight: 'bold',
color: '#fff',
},
selectedButtonText: {
color: '#007aff',
},
musicButtons: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
width: '80%',
},
musicButton: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
width: 140,
height: 60,
borderRadius: 30,
borderWidth: 1,
borderColor: '#fff',
paddingHorizontal: 20,
},
musicButtonSelected: {
backgroundColor: '#007aff',
},
musicButtonText: {
marginLeft: 10,
fontSize: 18,
fontWeight: 'bold',
color: '#fff',
},
});

export default SettingScreen;