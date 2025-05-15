import { useState } from "react";
import { FormLayout } from "./components/uikit/form-layout";
import { Button } from "./components/uikit/button";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export function Login(){
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
      playerName: "",
      password: "",
   });

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
         const response = await fetch(`${process.env.REACT_APP_BACKEND_PORT}/login`, {
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
            if (data.token){
               Cookies.set('usb_player_token', data.token, { expires: 30 });
               navigate("/");
            }
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
               <Button>Увійти</Button>
            }
            text={
               <>Ще немає акаунту? Ви можеште створити його <a href="#" onClick={(e) => { e.preventDefault(); navigate("/register"); }}>тут!</a></>
            }
         >
            <input type="text" name="playerName" placeholder="Ім'я" onChange={handleChange} maxLength="15" required/>
            <input type="password" name="password" placeholder="Пароль" onChange={handleChange} required/>
         </FormLayout>
      </div>
  );
}