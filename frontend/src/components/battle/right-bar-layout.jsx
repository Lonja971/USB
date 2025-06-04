export function RightBarLayout({ sendMove }) {
   return (
      <div className="battle__rightbar">
         <button onClick={sendMove}>Move</button>
      </div>
   )
}