export function Button({children, type="submit"}){
   return(
      <button type={type} className="_glass">
         {children}
         <div className="line line-top"></div>
         <div className="line line-right"></div>
         <div className="line line-bottom"></div>
         <div className="line line-left"></div>
      </button>
   )
}