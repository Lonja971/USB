import { useState } from "react";
import { FormLayout } from "./components/uikit/form-layout";
import { Button } from "./components/uikit/button";
import "./css/login.css";
import { useNavigate } from "react-router-dom";

export function Register(){
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
      playerName: "",
      password: "",
      passwordConfirmation: ""
   });

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (formData.password !== formData.passwordConfirmation){
         alert("Паролі повинні бути однаковими (React)");
         return;
      }

      try {
         const response = await fetch(`${process.env.REACT_APP_BACKEND_PORT}/register`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
         });

         const data = await response.json();
         if (response.status !== 201){
            alert(data.message);
         }else{
            alert(data.message);
         }
      } catch (error) {
         console.error("Помилка:", error);
      }
  };
   
   return (
      <div className="full-fixed-screen register__container">
         <FormLayout
            handleSubmit={handleSubmit}
            button={
               <Button>Зареєструватися</Button>
            }
            text={
               <>Вже є акаунт? Ви можете увійти в нього <a href="#" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>тут!</a></>
            }
         >
            <input type="text" name="playerName" placeholder="Ім'я" onChange={handleChange} maxLength="15" required/>
            <input type="password" name="password" placeholder="Пароль" onChange={handleChange} required/>
            <input type="password" name="passwordConfirmation" placeholder="Повторіть пароль" onChange={handleChange} required/>
         </FormLayout>
      </div>
  );
}