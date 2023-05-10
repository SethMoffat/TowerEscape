import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';


const BOX_SIZE = 20;
const GRID_ROWS = 20;
const GRID_COLS = 12;

useEffect(() => {
  generateMap();
}, []);

const GameScreen = () => {
  const [keys, setKeys] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({
    x: Math.floor(GRID_COLS / 2),
    y: Math.floor(GRID_ROWS / 2),
  });

  const grid = [];
for (let i = 0; i < GRID_ROWS; i++) {
  const row = [];
  for (let j = 0; j < GRID_COLS; j++) {
    let boxColor = 'grey';
    if (playerPosition.x === j && playerPosition.y === i) {
      boxColor = 'blue';
    } else if (keys.some(key => key.x === j && key.y === i)) {
      boxColor = 'yellow';
    } else if (obstacles.some(obstacle => obstacle.x === j && obstacle.y === i)) {
      boxColor = 'red';
    }

    row.push(
      <View
        key={`${i}-${j}`}
        style={[
          styles.box,
          {
            backgroundColor: boxColor,
          },
        ]}
      />
    );
  }
  grid.push(
    <View key={i} style={styles.row}>
      {row}
    </View>
  );
}

  const generateMap = () => {
    // Reset keys and obstacles
    setKeys([]);
    setObstacles([]);
  
    // Generate keys
    for (let i = 0; i < 5; i++) { // generates 5 keys
      let keyPosition;
      do {
        keyPosition = { x: Math.floor(Math.random() * GRID_COLS), y: Math.floor(Math.random() * GRID_ROWS) };
      } while (isPositionTaken(keyPosition));
      setKeys(keys => [...keys, keyPosition]);
    }
  
    // Generate obstacles
    for (let i = 0; i < 10; i++) { // generates 10 obstacles
      let obstaclePosition;
      do {
        obstaclePosition = { x: Math.floor(Math.random() * GRID_COLS), y: Math.floor(Math.random() * GRID_ROWS) };
      } while (isPositionTaken(obstaclePosition));
      setObstacles(obstacles => [...obstacles, obstaclePosition]);
    }
  };
  
  const isPositionTaken = (newPosition) => {
    if (newPosition.x === playerPosition.x && newPosition.y === playerPosition.y) {
      return true;
    }
  
    for (let key of keys) {
      if (newPosition.x === key.x && newPosition.y === key.y) {
        return true;
      }
    }
  
    for (let obstacle of obstacles) {
      if (newPosition.x === obstacle.x && newPosition.y === obstacle.y) {
        return true;
      }
    }
  
    return false;
  };
  

  const movePlayer = (direction) => {
    setPlayerPosition((prev) => {
      let { x, y } = prev;

      switch (direction) {
        case 'up':
          y = Math.max(y - 1, 0);
          break;
        case 'down':
          y = Math.min(y + 1, GRID_ROWS - 1);
          break;
        case 'left':
          x = Math.max(x - 1, 0);
          break;
        case 'right':
          x = Math.min(x + 1, GRID_COLS - 1);
          break;
      }

      return { x, y };
    });
  };

  return (
    <View style={styles.container}>
      {grid}
      <View style={styles.gamepad}>
        <View style={styles.verticalButtons}>
          <Icon name="arrow-up" type="font-awesome" color="blue" onPress={() => movePlayer('up')} />
          <View style={styles.horizontalButtons}>
            <Icon name="arrow-left" type="font-awesome" color="blue" onPress={() => movePlayer('left')} />
            <Icon name="arrow-right" type="font-awesome" color="blue" onPress={() => movePlayer('right')} />
          </View>
          <Icon name="arrow-down" type="font-awesome" color="blue" onPress={() => movePlayer('down')} />
        </View>
      </View>
    </View>
);
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    margin: 1,
    borderRadius: 5,
  },
  gamepad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  verticalButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
  },
  horizontalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default GameScreen;