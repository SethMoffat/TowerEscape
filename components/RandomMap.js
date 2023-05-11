import React from 'react';
import { View, Dimensions } from 'react-native';
import { gridSize } from '../config'; // adjust path accordingly

// function to generate random obstacles and keys
export const generateMap = () => {
    let map = Array(gridSize.rows)
      .fill()
      .map(() => Array(gridSize.columns).fill('empty'));
  
    // Generate keys and obstacles
    for (let i = 0; i < gridSize.rows; i++) {
      for (let j = 0; j < gridSize.columns; j++) {
        const rand = Math.random();
        if (rand < 0.1 && i !== gridSize.rows - 1) {
          map[i][j] = 'obstacle';
        } else if (rand < 0.15) {
          map[i][j] = 'key';
        }
      }
    }
  
    // Make last row as obstacles
    map[gridSize.rows - 1] = Array(gridSize.columns).fill('obstacle');
  
    return map;
  };

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Calculate cell size based on the screen size and number of cells
const cellSize = Math.min(screenWidth / gridSize.columns, screenHeight / gridSize.rows);

const RandomMap = ({ playerPosition, enemyPosition, map }) => {
    return (
      <View style={{ flexDirection: 'column' }}>
        {map.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: 'row', height: cellSize }}>
            {row.map((cell, columnIndex) => {
              let backgroundColor = 'transparent';
              if (playerPosition.row === rowIndex && playerPosition.column === columnIndex) {
                backgroundColor = 'blue'; // player color
              } else if (enemyPosition.row === rowIndex && enemyPosition.column === columnIndex) {
                backgroundColor = 'purple'; // enemy color
              } else if (cell === 'obstacle') {
                backgroundColor = 'red'; // obstacle color
              } else if (cell === 'key') {
                backgroundColor = 'yellow'; // key color
              }
              return (
                <View
                  key={columnIndex}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: backgroundColor,
                    borderWidth: 1,
                    borderColor: 'black',
                  }}
                />
              );
            })}
          </View>
        ))}
      </View>
    );
  };

export default RandomMap;