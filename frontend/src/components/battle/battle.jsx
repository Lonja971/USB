import { useRoute } from "../../routing/RouteContext";

export function Battle({ text }) {
   const { navigateToPage } = useRoute();

   function handleToHome() {
      navigateToPage("home")
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