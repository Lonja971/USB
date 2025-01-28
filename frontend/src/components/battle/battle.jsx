import { useRoute } from "../../context/RouteContext";

export function Battle({ text }) {
   const { navigateToScreen } = useRoute();

   function handleToHome(){
      navigateToScreen("home")
   }

   return (
      <div>
         <div>
            <p>BattleId</p>
            <p>Data: {text}</p>
            <button
               onClick={handleToHome}
            >
               To the Home
            </button>
         </div>
      </div>
   );
}