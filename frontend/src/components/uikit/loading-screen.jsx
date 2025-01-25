export function LoadingScreen({message}){
   return(
      <>
         <div>Loading Screen</div>
         {message ? <div>{message}</div> : ""}
      </>
   )
}