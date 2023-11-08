import { useCallback, useMemo , useState} from "react";
import PropTypes from "prop-types";

export default function Cell({
  cellPosition,
  row,
  col,
  cellType,
  setCellType,
  selectedCellType,
  generateCellClassName,
}) {
  // const [isAnimating, setIsAnimating] = useState(false);
  const handleCellClick = useCallback(
    (row, col) => {
      const cellPosition = generateCellClassName(row, col);
      const updatePositions = (prevPositions) => ({
        ...prevPositions,
        start:
          prevPositions.start === cellPosition ? null : prevPositions.start,
        end: prevPositions.end === cellPosition ? null : prevPositions.end,
        wall: prevPositions.wall.filter(
          (position) => position !== cellPosition
        ),
      });
      switch (selectedCellType) {
        case "start":
          setCellType((prevPositions) => ({
            ...updatePositions(prevPositions),
            start: cellPosition,
          }));
          // setIsAnimating(true)
          break;
        case "end":
          setCellType((prevPositions) => ({
            ...updatePositions(prevPositions),
            end: cellPosition,
          }));
          break;
        case "wall":
          setCellType((prevPositions) => ({
            ...updatePositions(prevPositions),
            wall: prevPositions.wall.includes(cellPosition)
              ? prevPositions.wall.filter((position) => position !== cellPosition)
              : [...prevPositions.wall, cellPosition],
          }));
          break;
        case "empty":
          setCellType((prevPositions) => updatePositions(prevPositions));
          break;
        default:
          if (!cellType.start) {
            setCellType((prevPositions) => ({
              ...updatePositions(prevPositions),
              start: cellPosition,
            }));
          // setIsAnimating(true)

          } else if (!cellType.end) {
            setCellType((prevPositions) => ({
              ...updatePositions(prevPositions),
              end: cellPosition,
            }));
          } else {
            setCellType((prevPositions) => ({
              ...updatePositions(prevPositions),
              wall: prevPositions.wall.includes(cellPosition)
                ? prevPositions.wall.filter((position) => position !== cellPosition)
                : [...prevPositions.wall, cellPosition],
            }));
          }
          break;
      }

    },
    [
      cellType.end,
      cellType.start,
      generateCellClassName,
      selectedCellType,
      setCellType,
    ]
  );
  const isStart = cellPosition === cellType.start;
  const isEnd = cellPosition === cellType.end;
  const isWall = cellType.wall.includes(cellPosition);
  const isPath = cellType.path.includes(cellPosition);
  const isExplored = cellType.explored.includes(cellPosition);
  const isUncovered = cellType.uncovered.includes(cellPosition);

  const cellStyle = useMemo(() => {
    return {
      // transform: isStart && isAnimating ? "scale(1.2)" : "scale(1)",
      // transition: "transform 0.3s ease-in-out",
      backgroundColor: isStart
        ? // ? "rgb(19, 107, 19)"
          // ? "rgb(0, 120, 255)"
          "transparent"
        : isEnd
        ? // ? "hsl(357, 100%, 67%)"
          // "rgb(150, 0, 255)"
          "darkblue"
        : // "transparent"
        isWall
        ? // ? "rgb(255, 187, 0)"
          "rgb(80, 80, 80)"
        : isPath
        ? // ? "hsl(219, 100%, 67%)"
          "rgb(255, 255, 0)"
        : isExplored
        ? // ? "rgb(0, 100, 100)"
          "rgb(100, 157, 176)"
        : isUncovered
        ? // ? 'rgb(169, 51, 8)'
          "rgb(0, 150, 0)"
        : // : "hsl(50, 50%, 50%)",
          // "rgb(220, 220, 220)",
          "whitesmoke",

    };
  }, [isStart, isEnd, isWall, isPath, isExplored, isUncovered]);
  return (
    <div
      key={cellPosition}
      className={cellPosition}
      style={cellStyle}
      onClick={() => handleCellClick(row, col)}
    >
      {isStart && (
        <svg
          viewBox="-2.4 -2.4 28.80 28.80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"
          style={{ display: "block" }}
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0">
            <rect
              x="-2.4"
              y="-2.4"
              width="28.80"
              height="28.80"
              rx="0"
              fill="#7ed0ec"
              strokeWidth="0"
            ></rect>
          </g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M6 12H18M18 12L13 7M18 12L13 17"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>{" "}
          </g>
        </svg>
      )}
    </div>
  );
}
Cell.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  selectedCellType: PropTypes.string,
  generateCellClassName: PropTypes.func.isRequired,
  cellPosition: PropTypes.string.isRequired,
  cellType: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
    wall: PropTypes.arrayOf(PropTypes.string),
    path: PropTypes.arrayOf(PropTypes.string),
    explored: PropTypes.arrayOf(PropTypes.string),
    uncovered: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setCellType: PropTypes.func.isRequired,
};
