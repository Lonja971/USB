export function isWithinRadius(x1, y1, x2, y2, radius) {
   const dx = x1 - x2;
   const dy = y1 - y2;
   const distSq = dx * dx + dy * dy;
   return distSq <= radius * radius;
}

export function calculateDistance(startX, startY, endX, endY) {
   // Евклідова відстань
   const dx = endX - startX;
   const dy = endY - startY;
   return Math.sqrt(dx * dx + dy * dy);
}