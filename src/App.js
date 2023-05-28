import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Donation from "./Donation";

function App() {
  

  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/donation" element={<Donation/>}/>
          </Routes>
        </Router>
      
     </>
  );
}

export default App;
