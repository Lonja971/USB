import './css/map_test.css';
import { useRoute } from './routing/RouteContext';

export function MapTest({testProp}) {
   const { navigateToPage } = useRoute();

   return (
      <div>
         <div>Test Page</div>
         <p>My testProp: {testProp ? testProp : "null"}</p>
         <button onClick={ () => navigateToPage()}>Return to Default</button>
      </div>
   );
}


