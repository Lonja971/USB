export function BattleLayout({ handleToHome, battleComment, sendMove, battleInfo }) {

   console.log(battleInfo);

   return (
      <div>
         <div>
            <p>BattleId</p>
            { battleComment ? (
               <p>Data: {battleComment}</p>
            ) : ""}
            <button
               onClick={sendMove}
            >
               Move
            </button>
         </div>
      </div>
   );
}