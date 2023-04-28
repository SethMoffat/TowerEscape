import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';


const App = () => {
  const [map, setMap] = useState([]);
  const [runnerPosition, setRunnerPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateRandomMap();
  }, []);
  const generateRandomMap = () => {
    const numRows = 20;
    const numCols = 12;
    const newMap = [];
  
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        const randomCell = Math.random();
        if (randomCell < 0.7) {
          row.push('empty');
        } else if (randomCell < 0.9) {
          row.push('obstacle');
        } else {
          row.push('key');
        }
      }
      newMap.push(row);
    }
  
    createPath(newMap);
  
    setMap(newMap);
    setRunnerPosition({ x: 0, y: numCols - 1 });
  };
  
  const createPath = (map) => {
    let x = 0;
    let y = Math.floor(Math.random() * map[0].length);
  
    while (x < map.length - 1) {
      const direction = Math.random();
      if (direction < 0.3 && y > 0) {
        y--;
      } else if (direction < 0.6 && y < map[0].length - 1) {
        y++;
      } else {
        x++;
      }
      map[x][y] = 'empty';
    }
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
      }
      
      if (newX === map.length - 1) {
        generateRandomMap();
        setScore(score + 1);
      }
    }
  };

  return (
    <View style={styles.container}>
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

      {/* Render controls and score */}
      <View style={styles.controls}>
  <View style={styles.directionalContainer}>
    <View style={styles.verticalButtons}>
      <TouchableOpacity onPress={() => moveRunner('up')}>
        <MaterialCommunityIcons name="arrow-up" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => moveRunner('down')}>
        <MaterialCommunityIcons name="arrow-down" size={24} color="black" />
      </TouchableOpacity>
    </View>
    <View style={styles.horizontalButtons}>
      <TouchableOpacity onPress={() => moveRunner('left')}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => moveRunner('right')}>
        <MaterialCommunityIcons name="arrow-right" size={24} color="black" />
      </TouchableOpacity>
    </View>
  </View>
  <View style={styles.scoreContainer}>
    <FontAwesome5 name="star" size={24} color="gold" />
    <Text style={styles.score}>{score}</Text>
  </View>
</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  map: { flexDirection: 'column', flexWrap: 'wrap', width: 360 }, // Update the map style
  row: { flexDirection: 'row' }, // Add row style
  cell: { width: 30, height: 30, borderWidth: 1, borderColor: '#000', justifyContent: 'center', alignItems: 'center' },
  obstacle: { backgroundColor: 'red' },
  key: { backgroundColor: 'gold' },
  runner: { backgroundColor: 'blue' },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
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
  scoreContainer: { flexDirection: 'row', alignItems: 'center' },
  score: { fontSize: 18, marginLeft: 5 },
});

export default App;
