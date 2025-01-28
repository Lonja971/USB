import "../../css/loading_screen.css"

export function LoadingScreen({message}){
   return(
      <div className="loading__container">
         <div className="">Ultimate Sea Battle</div>
         <div className="loading__content">
            <div className="loading__message">
               {message ?
                  <p>{message}</p>
                  : ""
               }
            </div>
            <div className="loading__content-loader">
               <div className="loader"></div>
            </div>
         </div>
      </div>
   )
}