export function GridLayour({ width, height, cellSize }) {
  const rows = [...Array(height).keys()];
  const cols = [...Array(width).keys()];

  return (
    <div
      style={{
        position: 'relative',
        width: width * cellSize,
        height: height * cellSize,
        backgroundColor: '#e0e0e0',
        display: 'grid',
        gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
        gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
      }}
    >
      {rows.map((y) =>
        cols.map((x) => (
          <div
            key={`${x}-${y}`}
            style={{
              border: '1px solid #ccc',
              width: cellSize,
              height: cellSize,
            }}
          />
        ))
      )}
    </div>
  );
}