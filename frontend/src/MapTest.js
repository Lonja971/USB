import React, { useState, useRef, useEffect } from 'react';
import './css/map_test.css';

export function MapTest() {
   const [mapSize, setMapSize] = useState({ cols: 40, rows: 40 });
   const ships = {
      1: { position: [[1, 1], [1, 2], [1, 3]] },
      2: { position: [[5, 5], [5, 6], [5, 7]] },
   };


   return (
      <div>MapTest</div>
   );
}