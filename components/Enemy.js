import React, { useEffect, useState, memo } from 'react';
import { View } from 'react-native';
import PF from 'pathfinding';
import { throttle } from 'lodash';
import { map } from '../components/RandomMap';

const Enemy = memo(({ playerPosition, enemyPosition, onEnemyMove }) => {
  const [path, setPath] = useState([]);
  const [grid, setGrid] = useState(null);

  useEffect(() => {
    if (!map) {
      return;
    }

    const numericMap = map.map(row => row.map(cell => (cell === 'obstacle' ? 1 : 0)));
    setGrid(new PF.Grid(numericMap));
  }, [map]);

  const calculatePath = throttle(() => {
    if (!grid) {
      return;
    }

    const finder = new PF.AStarFinder();
    const path = finder.findPath(enemyPosition.column, enemyPosition.row, playerPosition.column, playerPosition.row, grid.clone());

    setPath(path);
  }, 500); // Only calculate the path at most once every 500ms

  useEffect(() => {
    calculatePath();
  }, [calculatePath]);

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
});

export default Enemy;