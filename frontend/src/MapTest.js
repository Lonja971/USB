import React, { useRef, useState } from 'react';

export function MapTest({rows = 20, columns = 20}) {
   const mapRef = useRef(null);
   const [scale, setScale] = useState(1);
   const [drag, setDrag] = useState({ x: 0, y: 0 });
   const [dragStart, setDragStart] = useState(null);
 
   const handleWheel = (event) => {
     event.preventDefault();
     const zoomSpeed = 0.1;
     const newScale = Math.min(Math.max(scale + event.deltaY * -zoomSpeed, 0.5), 2);
     setScale(newScale);
   };
 
   const handleMouseDown = (event) => {
     setDragStart({ x: event.clientX - drag.x, y: event.clientY - drag.y });
   };
 
   const handleMouseMove = (event) => {
     if (dragStart) {
       setDrag({ x: event.clientX - dragStart.x, y: event.clientY - dragStart.y });
     }
   };
 
   const handleMouseUp = () => {
     setDragStart(null);
   };
 
   return (
      <div className='lol'>
         <div
            ref={mapRef}
            className="battle-map"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
               transform: `scale(${scale}) translate(${drag.x}px, ${drag.y}px)`,
            }}
         >
            {Array.from({ length: rows * columns }).map((_, index) => (
               <div key={index} className="map-cell" />
            ))}
         </div>
      </div>
   );
}
