export function MainLoadingLayout({mainLoadingScreenMessage, connectionInfo }){
   return(
      <div className="loading__container">
         <div className="loading__logo">
            <img src="img/background/logo.png" alt="LOGO" />
            <div className="loading__content">
               <div className="loading__message">
                  {mainLoadingScreenMessage ?
                     <p>{mainLoadingScreenMessage}</p>
                     : ""
                  }
               </div>
            </div>
         </div>
         <div className="loading__content-loader">
            <div className="loader"></div>
         </div>
         {connectionInfo ? (
            <div className="server-status off"></div>
         ) : ""}
      </div>
   )
}