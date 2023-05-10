import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';

const BOX_SIZE = 20;
const GRID_ROWS = 20;
const GRID_COLS = 12;

const GameScreen = () => {
  const [playerPosition, setPlayerPosition] = useState({
    x: Math.floor(GRID_COLS / 2),
    y: Math.floor(GRID_ROWS / 2),
  });

  const grid = [];
  for (let i = 0; i < GRID_ROWS; i++) {
    const row = [];
    for (let j = 0; j < GRID_COLS; j++) {
      row.push(
        <View
          key={`${i}-${j}`}
          style={[
            styles.box,
            {
              backgroundColor:
                playerPosition.x === j && playerPosition.y === i
                  ? 'blue'
                  : 'grey',
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

    // Find a suitable runner position, avoiding obstacles and keys
    let foundSuitablePosition = false;
    let newRunnerX = 0;
    let newRunnerY = currentY;

    while (!foundSuitablePosition) {
        if (newMap[newRunnerX][newRunnerY] === 'empty') {
            foundSuitablePosition = true;
        } else {
            newRunnerY = (newRunnerY + 1) % numCols;
        }
    }

    setRunnerPosition({ x: newRunnerX, y: newRunnerY });
    initializeEnemy(newMap); // Call initializeEnemy with the newMap

    // Find a suitable enemy position, avoiding obstacles, keys, and the runner
    let foundSuitableEnemyPosition = false;
    let newEnemyX = 0;
    let newEnemyY = currentY;

    while (!foundSuitableEnemyPosition) {
        const positionsToCheck = [
            { x: newEnemyX, y: newEnemyY - 1 },
            { x: newEnemyX, y: newEnemyY + 1 },
        ];

        const positionIsValid = (position) =>
            position.y >= 0 &&
            position.y < numCols &&
            newMap[position.x][position.y] !== 'obstacle' &&
            newMap[position.x][position.y] !== 'key' &&
            (position.x !== newRunnerX || position.y !== newRunnerY); // Avoid spawning on the runner

        const validPositions = positionsToCheck.filter(positionIsValid);

        if (validPositions.length > 0) {
            const randomIndex = Math.floor(Math.random() * validPositions.length);
            const newPosition = validPositions[randomIndex];
            newEnemyY = newPosition.y;
            foundSuitableEnemyPosition = true;
        } else {
            newEnemyY = Math.floor(Math.random() * numCols);
        }

        // Check if the enemy is not on the same position as the runner
        if (newEnemyX !== newRunnerX || newEnemyY !== newRunnerY) {
            foundSuitableEnemyPosition = true;
        } else {
            foundSuitableEnemyPosition = false;
        }
    }

    setEnemyPosition({ x: newEnemyX, y: newEnemyY }); // Set the enemy position

    // Now that we have updated the runner and enemy positions, we can set the new map.
    setMap(newMap);
};

  const moveEnemyTowardsRunner = () => {
    if (!runnerPosition || !enemyPosition) {
      return;
    }
  
    const runnerX = runnerPosition.x;
    const runnerY = runnerPosition.y;
    const enemyX = enemyPosition.x;
    const enemyY = enemyPosition.y;
  
    const dx = runnerX - enemyX;
    const dy = runnerY - enemyY;
  
    const newPositionIsValid = (x, y) =>
      x >= 0 &&
      x < numRows &&
      y >= 0 &&
      y < numCols &&
      map[x][y] !== 'obstacle' &&
      map[x][y] !== 'key';
  
    const possibleMoves = [
      { x: enemyX + Math.sign(dx), y: enemyY },
      { x: enemyX, y: enemyY + Math.sign(dy) },
      { x: enemyX - Math.sign(dx), y: enemyY },
      { x: enemyX, y: enemyY - Math.sign(dy) },
    ];
  
    // Sort the moves based on their distance to the runner
    possibleMoves.sort((moveA, moveB) => {
      const distA = Math.hypot(moveA.x - runnerX, moveA.y - runnerY);
      const distB = Math.hypot(moveB.x - runnerX, moveB.y - runnerY);
      return distA - distB;
    });
  };

  return (
    <View style={styles.container}>
      {grid}
      <View style={styles.gamepad}>
        <Icon name="arrow-up" type="font-awesome" onPress={() => movePlayer('up')} />
        <View style={styles.horizontalButtons}>
          <Icon name="arrow-left" type="font-awesome" onPress={() => movePlayer('left')} />
          <Icon name="arrow-right" type="font-awesome" onPress={() => movePlayer('right')} />
        </View>
        <Icon name="arrow-down" type="font-awesome" onPress={() => movePlayer('down')} />
      </View>
    </View>
  );
};

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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  horizontalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
  },
});

export default GameScreen;
