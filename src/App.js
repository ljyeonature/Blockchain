import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Donation from "./Donation";
import Purchase from "./Purchase";

function App() {
  

  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/donation" element={<Donation/>}/>
            <Route path="/purchase" element={<Purchase/>} />
          </Routes>
        </Router>
      
     </>
  );
}

export default App;
