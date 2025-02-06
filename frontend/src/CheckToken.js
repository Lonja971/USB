import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { AppProviders } from "./context/AppProviders";
import { RouteProvider } from "./context/RouteContext";

export function CheckToken(){
   const navigate = useNavigate();
   const [playerToken, setPlayerToken] = useState();

   useEffect(() => {
      const token = Cookies.get('usb_player_token');

      if (!token){
         navigate("/login");
      }else{
         setPlayerToken(token);
      }
   }, [navigate])

   return (
      playerToken ? (
         <AppProviders playerToken={playerToken}>
            <RouteProvider />
         </AppProviders>
      ) : null
   )
}