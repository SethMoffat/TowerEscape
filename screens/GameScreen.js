import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    Animated,
  } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Cell = React.memo(({ cell, isRunner, isBlinking }) => (
  <View
    style={[
      styles.cell,
      cell === 'obstacle' ? styles.obstacle : {},
      cell === 'key' ? styles.key : {},
      isRunner ? styles.runner : {},
      isBlinking ? { backgroundColor: 'green' } : {}, // Add this line to apply the green background color when isBlinking is true
    ]}
  >
    <Text style={{ color: 'transparent' }}>{cell}</Text>
  </View>
));

const GameScreen = () => {
  const [map, setMap] = useState([]);
  const [runnerPosition, setRunnerPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [totalKeyPieces, setTotalKeyPieces] = useState(0);
  const [keyPiecesCollected, setKeyPiecesCollected] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasClearedObstacles, setHasClearedObstacles] = useState(false);
  const [isBottomRowBlinking, setIsBottomRowBlinking] = useState(false);
  const [blinkIntervalId, setBlinkIntervalId] = useState(null);
  
  const navigation = useNavigation();

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    generateRandomMap();
  }, []);

  useEffect(() => {
    if (keyPiecesCollected === totalKeyPieces && map.length > 0) {
      setMap(clearBottomRowObstacles(map)); // Use the returned map from clearBottomRowObstacles
      setKeyPiecesCollected(0); // Reset key pieces collected after clearing the obstacles
      setHasClearedObstacles(true);
    }
  }, [keyPiecesCollected, totalKeyPieces]);
  
  const generateRandomMap = (startColumn) => {
    const numRows = 20;
    const numCols = 12;
    const newMap = Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => 'empty')
    );
    setIsBottomRowBlinking(false);
  
    const hasKeyNeighbor = (newMap, x, y) => {
      const numRows = newMap.length;
      const numCols = newMap[0].length;
  
      const positionsToCheck = [
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y: y - 1 },
        { x, y: y + 1 },
      ];
  
      for (const position of positionsToCheck) {
        if (
          position.x >= 0 &&
          position.x < numRows &&
          position.y >= 0 &&
          position.y < numCols &&
          newMap[position.x][position.y] === 'key'
        ) {
          return true;
        }
      }
  
      return false;
    };
  
    let currentX = 0;
    let currentY = startColumn !== undefined ? startColumn : numCols - 1;
  
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
  
    // Clear obstacles around the path
    newMap.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 'empty') {
          const randomCell = Math.random();
          if (randomCell < 0.7) {
            newMap[i][j] = 'empty';
          } else if (randomCell < 0.9) {
            // Check if any neighboring cell is a path
            const hasPathNeighbor =
              (i > 0 && newMap[i - 1][j] === 'path') ||
              (i < numRows - 1 && newMap[i + 1][j] === 'path') ||
              (j > 0 && newMap[i][j - 1] === 'path') ||
              (j < numCols - 1 && newMap[i][j + 1] === 'path');
  
            if (!hasPathNeighbor) {
              newMap[i][j] = 'obstacle';
            }
          } else {
            if (!hasKeyNeighbor(newMap, i, j)) {
              newMap[i][j] = 'key';
            } else {
              newMap[i][j] = 'empty';
            }
          }
        }
      });
    });
  
    newMap[numRows - 1].fill('obstacle');
  
    const pathKeys = newMap
      .flatMap((row, rowIndex) => row.map((cell, colIndex) => ({ cell, rowIndex, colIndex })))
      .filter(({ cell }) => cell === 'path');
  
    // Add a check to make sure pathKeys is not empty
    if (pathKeys.length > 0) {
      const randomPathKey = pathKeys[Math.floor(Math.random() * pathKeys.length)];
      newMap[randomPathKey.rowIndex][randomPathKey.colIndex] = 'key';
    }
  
    // Count the total number of key pieces
    const keyPieceCount = newMap.reduce(
      (count, row) => count + row.filter((cell) => cell === 'key').length,
      0
    );
  
    setTotalKeyPieces(keyPieceCount);
    setKeyPiecesCollected(0); // Reset key pieces collected
    setMap(newMap);
  
    // Find a suitable runner position, avoiding obstacles and keys
    let foundSuitablePosition = false;
    let newRunnerX = 0;
    let newRunnerY = currentY;
  
    while (!foundSuitablePosition) {
      const positionsToCheck = [
        { x: newRunnerX, y: newRunnerY - 1 },
        { x: newRunnerX, y: newRunnerY + 1 },
      ];
  
      const positionIsValid = (position) =>
        position.y >= 0 &&
        position.y < numCols &&
        newMap[position.x][position.y] !== 'obstacle' &&
        newMap[position.x][position.y] !== 'key';
  
      const validPositions = positionsToCheck.filter(positionIsValid);
  
      if (validPositions.length > 0) {
        const randomIndex = Math.floor(Math.random() * validPositions.length);
        const newPosition = validPositions[randomIndex];
        newRunnerY = newPosition.y;
        foundSuitablePosition = true;
      } else {
        newRunnerY = Math.floor(Math.random() * numCols);
      }
    }
  
    setRunnerPosition({ x: newRunnerX, y: newRunnerY });
  };

  const moveRunner = (direction) => {
    if (isPaused || !map.length) return;
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
        const updatedMap = [...map];
        updatedMap[newX][newY] = 'empty';
        setMap(updatedMap);
        setKeyPiecesCollected((prevKeyPiecesCollected) => prevKeyPiecesCollected + 1); // Increment key pieces collected
      }
  
      // ...
  
      if (newX === map.length - 1 && direction === 'down' && hasClearedObstacles) {
        // Clear the blink interval
        clearInterval(blinkIntervalId);
      
        // Move runner to the top row
        setRunnerPosition({ x: 0, y: newY });
      
        // Generate a new random map with the same column index at the top
        generateRandomMap(newY);
        setScore((prevScore) => prevScore + 1); // Use a callback to update the score
      
        // Reset hasClearedObstacles
        setHasClearedObstacles(false);
      }
    }
  };

  const restartGame = () => {
    generateRandomMap();
    setScore(0);
  };
  
  const clearBottomRowObstacles = (mapToClear) => {
    const numRows = mapToClear.length;
    const bottomRowIndex = numRows - 1;
  
    const updatedMap = [...mapToClear];
  
    for (let colIndex = 0; colIndex < updatedMap[bottomRowIndex].length; colIndex++) {
      updatedMap[bottomRowIndex][colIndex] = 'empty';
    }
  
    // Start blinking
    setIsBottomRowBlinking(true);
  
    // Use setInterval for continuous blinking
    const blinkInterval = setInterval(() => {
      setIsBottomRowBlinking((prev) => !prev);
    }, 500);
  
    // Save the interval ID to clear it later when needed
    setBlinkIntervalId(blinkInterval);
  
    return updatedMap;
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
        <Cell
          key={`${rowIndex}-${cellIndex}`}
          cell={cell}
          isRunner={runnerPosition.x === rowIndex && runnerPosition.y === cellIndex}
          isBlinking={rowIndex === map.length - 1 && isBottomRowBlinking} // Pass the isBlinking prop to cells in the bottom row
        />
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
      <TouchableOpacity
        style={styles.pauseButton}
        onPress={togglePause}
      >
        <FontAwesome5 name="pause" size={24} color="black" />
      </TouchableOpacity>
  
      {/* Add pause modal */}
      <Modal
  animationType="slide"
  transparent={true}
  visible={isPaused}
  onRequestClose={togglePause}
>
  <View style={styles.modalBackground}>
    <View style={styles.modalView}>
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => {
          togglePause();
          navigation.goBack();
        }}
      >
        <FontAwesome5 name="arrow-left" size={24} color="white" />
        <Text style={styles.modalButtonText}>Go Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.modalButton}
        onPress={togglePause}
      >
        <FontAwesome5 name="play" size={24} color="white" />
        <Text style={styles.modalButtonText}>Resume</Text>
      </TouchableOpacity>
      {/* Add the restart button here */}
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => {
          togglePause();
          restartGame();
        }}
      >
        <FontAwesome5 name="redo" size={24} color="white" />
        <Text style={styles.modalButtonText}>Restart</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <FontAwesome5 name="cog" size={24} color="white" />
        <Text style={styles.modalButtonText}>Settings</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
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
  blinkGreen: {
    backgroundColor: 'rgba(0, 255, 0, 0.5)',
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
    margin: 12,
  },
  pauseButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    margin:12,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: '#4A4AFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D2DFF',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalButtonText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 10,
  },
});

export default GameScreen;
