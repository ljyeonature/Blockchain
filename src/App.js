import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Donation from "./Donation";
import Purchase from "./Purchase";
import Withdrawn from "./Withdrawn";
import PurchaseList from "./PurchaseList";
import Penpal from './Penpal';

function App() {
  

  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/donation" element={<Donation/>}/>
            <Route path="/withdrawn" element={<Withdrawn/>}/>
            <Route path="/purchase" element={<Purchase/>} />
            <Route path="/purchaseList" element={<PurchaseList/>} />
            <Route path="/penpal" element={<Penpal/>} />
          </Routes>
        </Router>
      
     </>
  );
}

export default App;
