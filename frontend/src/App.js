import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Register } from "./Register.js";
import { Login } from "./Login.js";

import { CheckToken } from "./CheckToken.js";

function App() {
   return (
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
         <Routes>
            <Route path="/" element={
               <CheckToken />
            }/>
            <Route path="/register" element={<Register/>} />
            <Route path="/login" element={<Login/>} />
         </Routes>
      </Router>
   );
}

export default App;
