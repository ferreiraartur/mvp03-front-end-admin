import React from "react";
import {BrowserRouter,Route,Routes } from "react-router-dom";

import Courses from './pages/Courses'
import Categories from './pages/Categories'
import DashboardLayoutBasic from './components/layout';

function RoutePages(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" >
                  {/*  <Route index element={<DashboardLayoutBasic />} /> */}
                  
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/categories" element={<Categories/>} />

                </Route>
            </Routes>         
       </BrowserRouter>
        
    )
}

export default RoutePages