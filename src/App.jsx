import * as React from 'react';
import DashboardLayoutBasic from './components/layout';
import RoutePages from './RoutePages';
import Courses from './pages/Courses'


import './App.css'



function App() {

 

  return (
  
    <div className="App">
      <DashboardLayoutBasic></DashboardLayoutBasic>
      <RoutePages>
      </RoutePages>
      
    </div>
      
    
  )
}

export default App
