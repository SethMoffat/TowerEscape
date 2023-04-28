import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';


const GameScreen = () => {
  const [map, setMap] = useState([]);
  const [runnerPosition, setRunnerPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [totalKeyPieces, setTotalKeyPieces] = useState(0);
const [keyPiecesCollected, setKeyPiecesCollected] = useState(0);


  useEffect(() => {
    generateRandomMap();
  }, []);
  const generateRandomMap = () => {
    const numRows = 20;
    const numCols = 12;
    const newMap = Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => 'empty')
    );
  
    let currentX = 0;
    let currentY = numCols - 1;
  
    while (currentX < numRows - 1) {
      const move = Math.floor(Math.random() * 3);
  
      if (move === 0 && currentY > 0) {
        currentY--;
      } else if (move === 1 && currentY < numCols - 1) {
        currentY++;
      } else {
        currentX++;
      }
  
      newMap[currentX][currentY] = 'path';
    }
  
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        if (newMap[i][j] === 'empty') {
          const randomCell = Math.random();
          if (randomCell < 0.7) {
            newMap[i][j] = 'empty';
          } else if (randomCell < 0.9) {
            newMap[i][j] = 'obstacle';
          } else {
            newMap[i][j] = 'key';
          }
        }
      }
    }
  
    const pathKeys = newMap
      .flatMap((row, rowIndex) => row.map((cell, colIndex) => ({ cell, rowIndex, colIndex })))
      .filter(({ cell }) => cell === 'path');
    const randomPathKey = pathKeys[Math.floor(Math.random() * pathKeys.length)];
    newMap[randomPathKey.rowIndex][randomPathKey.colIndex] = 'key';
  
    // Count the total number of key pieces
    const keyPieceCount = newMap.reduce(
      (count, row) => count + row.filter((cell) => cell === 'key').length,
      0
    );
  
    setTotalKeyPieces(keyPieceCount);
    setKeyPiecesCollected(0); // Reset key pieces collected
    setMap(newMap);
    setRunnerPosition({ x: 0, y: numCols - 1 });
  };

  const moveRunner = (direction) => {
    let newX = runnerPosition.x;
    let newY = runnerPosition.y;
  
    if (direction === 'up' && runnerPosition.x > 0) {
      newX--;
    } else if (direction === 'down' && runnerPosition.x < map.length - 1) {
      newX++;
    } else if (direction === 'left' && runnerPosition.y > 0) {
      newY--;
    } else if (direction === 'right' && runnerPosition.y < map[0].length - 1) {
      newY++;
    }
  
    if (map[newX][newY] !== 'obstacle') {
      setRunnerPosition({ x: newX, y: newY });
  
      if (map[newX][newY] === 'key') {
        setScore(score + 1);
        const updatedMap = [...map];
        updatedMap[newX][newY] = 'empty';
        setMap(updatedMap);
        setKeyPiecesCollected(keyPiecesCollected + 1); // Increment key pieces collected
      }
  
      // Restart the level when the runner is on the second last row and goes down
      if (newX === map.length - 1 && direction === 'down') {
        generateRandomMap();
        setScore(score + 1);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.keyPiecesContainer}>
    <Text style={styles.keyPieces}>
      Key Pieces: {keyPiecesCollected}/{totalKeyPieces}
    </Text>
  </View>
    {/* Render the score */}
    <View style={styles.scoreContainer}>
      <FontAwesome5 name="star" size={24} color="gold" />
      <Text style={styles.score}>{score}</Text>
    </View>

    {/* Render the map and runner */}
    <View style={styles.map}>
      {map.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, cellIndex) => (
            <View
              key={`${rowIndex}-${cellIndex}`}
              style={[
                styles.cell,
                cell === 'obstacle' ? styles.obstacle : {},
                cell === 'key' ? styles.key : {},
                runnerPosition.x === rowIndex && runnerPosition.y === cellIndex ? styles.runner : {},
              ]}
            >
              {/* Wrap cell content in a Text component */}
              <Text style={{ color: 'transparent' }}>{cell}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>

    {/* Render controls */}
    <View style={styles.controls}>
      <View style={styles.controller}>
        <View style={styles.controllerRow}>
          <View style={styles.controllerButton} />
          <TouchableOpacity style={styles.controllerButton} onPress={() => moveRunner('up')}>
            <MaterialCommunityIcons name="arrow-up" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.controllerButton} />
        </View>
        <View style={styles.controllerRow}>
          <TouchableOpacity style={styles.controllerButton} onPress={() => moveRunner('left')}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.controllerButton} />
          <TouchableOpacity style={styles.controllerButton} onPress={() => moveRunner('right')}>
            <MaterialCommunityIcons name="arrow-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.controllerRow}>
          <View style={styles.controllerButton} />
          <TouchableOpacity style={styles.controllerButton} onPress={() => moveRunner('down')}>
            <MaterialCommunityIcons name="arrow-down" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.controllerButton} />
        </View>
      </View>
    </View>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  map: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    width: 300,
  },
  row: { flexDirection: 'row' }, // Add row style
  cell: {
    width: 25, // Decrease width
    height: 25, // Decrease height
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  obstacle: { backgroundColor: 'red' },
  key: { backgroundColor: 'gold' },
  runner: { backgroundColor: 'blue' },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  controller: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  controllerRow: {
    flexDirection: 'row',
  },
  controllerButton: {
    width: 60, // Increase width
    height: 60, // Increase height
    justifyContent: 'center',
    alignItems: 'center',
  },
  directionalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalButtons: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  horizontalButtons: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  upDownContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginRight: 15,
  },
  leftRightContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 15,
  },
  scoreContainer: {
    position: 'absolute',
    marginTop: 24,
    marginRight: 24,
    top: 10, // Add top value
    right: 10, // Add right value
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    fontSize: 18,
    marginLeft: 5,
  },
  keyPiecesContainer: {
    position: 'absolute',
    marginTop: 24,
    marginLeft: 24,
    top: 10,
    left: 10,
  },
  keyPieces: {
    fontSize: 18,
  },
});

export default GameScreen;
