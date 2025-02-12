import Home from "./home/home.jsx";
import Login from "./auth/login.jsx";
import Register from "./auth/register.jsx";
import Spaces from "./spaces/spaces.jsx";
import Public from "./publicSpace/public.jsx";
import Create from "./create/create.jsx";
import React, {useState} from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {

  console.log("App mounted");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/spaces" element={<Spaces/>}/>
          <Route path="/public" element={<Public/>}/>
          <Route path="/create" element={<Create/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
