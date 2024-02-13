import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import PF from 'pathfinding';
import PriorityQueue from 'priority-queue';
import {map} from '../components/RandomMap'

const Enemy = ({ playerPosition, enemyPosition, onEnemyMove }) => {
  const [path, setPath] = useState([]);
  let numericMap;

  useEffect(() => {
    if (!map) {
      return;
    }

    numericMap = map.map(row => row.map(cell => (cell === 'obstacle' ? 1 : 0)));

    // Initialize the priority queue to be empty.
    const priorityQueue = new PriorityQueue();

    // Add the starting point to the priority queue.
    priorityQueue.add(enemyPosition, 0);

    // While the priority queue is not empty:
    while (!priorityQueue.isEmpty()) {
      // Remove the node with the lowest cost from the priority queue.
      const node = priorityQueue.remove();

      // If the removed node is the destination point, then we have found the shortest path.
      if (node === playerPosition) {
        setPath(node.path);
        break;
      }

      // Otherwise, add all of the removed node's neighbors to the priority queue.
      for (const neighbor of grid[node.row][node.column].neighbors) {
        if (numericMap[neighbor.row][neighbor.column] === 0) {
          priorityQueue.add(neighbor, node.cost + 1);
        }
      }
    }
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