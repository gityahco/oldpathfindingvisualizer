import { useMemo, useState, useCallback } from "react";
import Grid from "./Grid";
import Menu from "./Menu";

const COLUMNS = 50;
const ROWS = 20;
function Index() {
  const [cellType, setCellType] = useState({
    start: null,
    end: null,
    wall: [],
    path: [],
    explored: [],
    uncovered: [],
  });
  const getNeighbors = useCallback(
    (row, col) => {
      const neighbors = [];

      // Check the top neighbor
      if (row > 0 && !cellType.wall.includes(`${row - 1}-${col}`)) {
        neighbors.push([row - 1, col]);
      }

      // Check the right neighbor
      if (col < COLUMNS - 1 && !cellType.wall.includes(`${row}-${col + 1}`)) {
        neighbors.push([row, col + 1]);
      }

      // Check the bottom neighbor
      if (row < ROWS - 1 && !cellType.wall.includes(`${row + 1}-${col}`)) {
        neighbors.push([row + 1, col]);
      }

      // Check the left neighbor
      if (col > 0 && !cellType.wall.includes(`${row}-${col - 1}`)) {
        neighbors.push([row, col - 1]);
      }

      return neighbors;
    },
    [cellType.wall]
  );
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const dijkstra = useCallback(async () => {
    const distances = [];
    for (let i = 0; i < ROWS; i++) {
      distances[i] = new Array(COLUMNS).fill(Infinity);
    }

    const [startRow, startCol] = cellType.start.split("-").map(Number);

    distances[startRow][startCol] = 0;

    const queue = [[startRow, startCol, 0]];

    setCellType((prev) => ({
      ...prev,
      explored: [],
      path: [],
      uncovered: [],
    }));

    while (queue.length > 0) {
      await delay(10);
      const [currentRow, currentCol, distance] = queue.shift();
      setCellType((prev) => ({
        ...prev,
        explored: prev.explored.concat(`${currentRow}-${currentCol}`),
      }));
      // Path setting
      // if (cellType.end === `${currentRow}-${currentCol}`) {
      const neighbors = getNeighbors(currentRow, currentCol);
      for (const [neighborRow, neighborCol] of neighbors) {
        if (!cellType.explored.includes(`${neighborRow}-${neighborCol}`)) {
          setCellType((prev) => ({
            ...prev,
            uncovered: prev.uncovered.concat(`${neighborRow}-${neighborCol}`),
          }));
        }
        const newDistance = distance + 1;

        if (cellType.end === `${neighborRow}-${neighborCol}`) {
          const path = [];
          let row = currentRow;
          let col = currentCol;

          while (!(row === startRow && col === startCol)) {
            path.unshift(`${row}-${col}`);

            // setCellType((prev) => ({ ...prev, path: path }));
            setCellType((prev) => ({ ...prev, path: prev.path.concat(path) }));
            await delay(10);

            const neighbors = getNeighbors(row, col);
            let minDistance = Infinity;
            let nextRow = row;
            let nextCol = col;
            for (const [neighborRow, neighborCol] of neighbors) {
              const distance = distances[neighborRow][neighborCol];
              if (distance < minDistance) {
                minDistance = distance;
                nextRow = neighborRow;
                nextCol = neighborCol;
              }
            }

            row = nextRow;
            col = nextCol;
          }

          return;
        }

        // const neighbors = getNeighbors(currentRow, currentCol);
        // for (const [neighborRow, neighborCol] of neighbors) {
        //   if (!cellType.explored.includes(`${neighborRow}-${neighborCol}`)) {
        //     setCellType((prev) => ({
        //       ...prev,
        //       uncovered: prev.uncovered.concat(`${neighborRow}-${neighborCol}`)
        //     }));
        //   }
        //   const newDistance = distance + 1;

        if (newDistance < distances[neighborRow][neighborCol]) {
          distances[neighborRow][neighborCol] = newDistance;
          queue.push([neighborRow, neighborCol, newDistance]);
        }
      }
    }
  }, [cellType.end, cellType.explored, cellType.start, getNeighbors, setCellType]);



  const [selectedCellType, setSelectedCellType] = useState(null);

  const handleCellTypeChange = useCallback((option) => {
    setSelectedCellType(option);
  }, []);

  const generateCellClassName = useMemo(() => {
    const memoizedClassName = {};
    return function (row, col) {
      const position = `${row}-${col}`;
      if (!memoizedClassName[position]) {
        memoizedClassName[position] = position;
      }
      return memoizedClassName[position];
    };
  }, []);
  return (
    <>
      <Menu handleCellTypeChange={handleCellTypeChange} dijkstra={dijkstra}/>
      <Grid
        selectedCellType={selectedCellType}
        ROWS={ROWS}
        COLUMNS={COLUMNS}
        cellType={cellType}
        setCellType={setCellType}
        generateCellClassName={generateCellClassName}
        getNeighbors={getNeighbors}
        dijkstra={dijkstra}
      />
    </>
  );
}

export default Index;
