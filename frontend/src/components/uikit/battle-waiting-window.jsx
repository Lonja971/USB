export function BattleWaitingWindow({ exitSearchBattle }) {
   function handleExitSearch() {
     exitSearchBattle();
   }
 
   return (
     <div className="waiting">
       <div>
         Чекаємо на битву
       </div>
      <button onClick={handleExitSearch}>вийти</button>
     </div>
   );
 }