import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import PF from 'pathfinding';

const Enemy = ({ playerPosition, enemyPosition, map, gridSize, onEnemyMove }) => {
  const [path, setPath] = useState([]);

  useEffect(() => {
    const finder = new PF.AStarFinder();
    const grid = new PF.Grid(gridSize.columns, gridSize.rows, map); // Note the order change here

    const path = finder.findPath(enemyPosition.column, enemyPosition.row, playerPosition.column, playerPosition.row, grid); // And here

    setPath(path);
  }, [playerPosition, enemyPosition, map]);

  useEffect(() => {
    const move = () => {
      if (path.length > 1) {
        onEnemyMove({ row: path[1][1], column: path[1][0] });
      }
    };

    const intervalId = setInterval(move, 1000);

    return () => clearInterval(intervalId);
  }, [path, onEnemyMove]);

  return (
    <View style={{ position: 'absolute', top: enemyPosition.row * 100, left: enemyPosition.column * 100, width: 100, height: 100, backgroundColor: 'purple' }} />
  );
};

export default Enemy;