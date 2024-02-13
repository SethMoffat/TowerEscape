import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import RandomMap, { generateMap } from '../components/RandomMap';
import { gridSize } from '../config';
import Enemy from '../components/Enemy';

const initialPlayerPosition = { row: 0, column: gridSize.columns / 2 };

const GameScreen = () => {
  const [playerPosition, setPlayerPosition] = useState(initialPlayerPosition);
  const [map, setMap] = useState(generateMap());
  const [enemyPosition, setEnemyPosition] = useState({ row: gridSize.rows - 2, column: gridSize.columns / 2 });
  const [allKeysCollected, setAllKeysCollected] = useState(false); // New state variable to track whether all keys have been collected

  const playerPositionRef = useRef(playerPosition);
  const enemyPositionRef = useRef(enemyPosition);

  useEffect(() => {
    playerPositionRef.current = playerPosition;
  }, [playerPosition]);

  useEffect(() => {
    enemyPositionRef.current = enemyPosition;
  }, [enemyPosition]);

  // Check if the player is on the same space as a key
  useEffect(() => {
    if (map[playerPosition.row][playerPosition.column] === 'key') {
      let newMap = [...map];
      newMap[playerPosition.row][playerPosition.column] = 'empty';
      setMap(newMap);
    }

    // Check if all keys are gone
    let keysExist = false;
    for (let i = 0; i < gridSize.rows; i++) {
      for (let j = 0; j < gridSize.columns; j++) {
        if (map[i][j] === 'key') {
          keysExist = true;
          break;
        }
      }
      if (keysExist) break;
    }

    // If all keys are gone, remove the obstacles in the last row
    if (!keysExist) {
      let newMap = [...map];
      newMap[gridSize.rows - 1] = Array(gridSize.columns).fill('empty');
      setMap(newMap);
      setAllKeysCollected(true); // All keys have been collected
    }
  }, [playerPosition]);

  const movePlayer = useCallback((direction) => {
    let newPosition = { ...playerPositionRef.current };
  
    switch (direction) {
      case 'up':
        newPosition.row = Math.max(0, newPosition.row - 1);
        break;
      case 'down':
        newPosition.row = Math.min(gridSize.rows - 1, newPosition.row + 1);
        break;
      case 'left':
        newPosition.column = Math.max(0, newPosition.column - 1);
        break;
      case 'right':
        newPosition.column = Math.min(gridSize.columns - 1, newPosition.column + 1);
        break;
    }

    // Check if the new position is an obstacle
    if (map[newPosition.row][newPosition.column] !== 'obstacle') {
      setPlayerPosition(newPosition);
      playerPositionRef.current = newPosition;
    }

    // If the player has reached the last row, reset the player's position and generate a new map
    if (newPosition.row === gridSize.rows - 1 && allKeysCollected) {
      setPlayerPosition(initialPlayerPosition);
      playerPositionRef.current = initialPlayerPosition;
      setMap(generateMap());
      setAllKeysCollected(false); // Reset the allKeysCollected state to false for the new map
    }
  }, [allKeysCollected, map]);

  // Move the enemy towards the player at regular intervals
  useEffect(() => {
    const intervalId = setInterval(() => {
      let enemyNewPosition = { ...enemyPositionRef.current };
      if (enemyPositionRef.current.row < playerPositionRef.current.row) {
        enemyNewPosition.row += 1;
      } else if (enemyPositionRef.current.row > playerPositionRef.current.row) {
        enemyNewPosition.row -= 1;
      }
  
      if (enemyPositionRef.current.column < playerPositionRef.current.column) {
        enemyNewPosition.column += 1;
      } else if (enemyPositionRef.current.column > playerPositionRef.current.column) {
        enemyNewPosition.column -= 1;
      }
  
      // Check if the new position is an obstacle
      if (map[enemyNewPosition.row][enemyNewPosition.column] !== 'obstacle' && 
          !(enemyNewPosition.row === playerPositionRef.current.row && enemyNewPosition.column === playerPositionRef.current.column)) {
        setEnemyPosition(enemyNewPosition);
      }
    }, 500); // 500ms interval for enemy movement
  
    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []); // Empty dependency array

  return (
    <View style={styles.container}>
      <RandomMap playerPosition={playerPosition} enemyPosition={enemyPosition} map={map} />
      <Enemy playerPosition={playerPosition} enemyPosition={enemyPosition} map={map} gridSize={gridSize} />
      <View style={styles.controller}>
        <View style={styles.verticalController}>
          <TouchableOpacity style={styles.button} onPress={() => movePlayer('up')}>
            <Text style={styles.buttonText}>Up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.horizontalController}>
          <TouchableOpacity style={styles.button} onPress={() => movePlayer('left')}>
            <Text style={styles.buttonText}>Left</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => movePlayer('right')}>
            <Text style={styles.buttonText}>Right</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.verticalController}>
          <TouchableOpacity style={styles.button} onPress={() => movePlayer('down')}>
            <Text style={styles.buttonText}>Down</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222831',
    padding: 20,
  },
  grid: {
    width: '90%',
    height: '70%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#393e46',
    borderColor: '#00adb5',
    borderWidth: 2,
    borderRadius: 10,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    borderColor: '#eeeeee',
    borderWidth: 1,
  },
  controller: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  horizontalController: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  verticalController: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    padding: 10,
    backgroundColor: '#00adb5',
    borderRadius: 5, // Reduce the border radius to make the buttons less round
    justifyContent: 'center',
    alignItems: 'center',
    width: 60, // Reduce the width to make the buttons smaller
    height: 50, // Reduce the height to make the buttons smaller
  },
  buttonText: {
    color: '#eeeeee',
    fontWeight: 'bold',
    fontSize: 12, // Reduce the font size to fit the smaller buttons
  },
});

export default GameScreen;
