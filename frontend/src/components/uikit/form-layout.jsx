import "../../css/form.css"

export function FormLayout({handleSubmit, children, button, text}){
   return (
      <div className="form__container">
         <form onSubmit={handleSubmit}>
            <div className="form__inputs">
               {children}
            </div>
            <div className="form__buttons">
               {button}
            </div>
            <div className="form__text">
               {text}
            </div>
         </form>
      </div>
   )
}