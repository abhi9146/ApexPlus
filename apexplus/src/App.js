import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Sidebar } from './components/sidebar';
import { Home } from './components/home';
import { AllScenarios } from './components/allScenario';
import { AddVehicle } from './components/addVehicle';
import { AddScenario } from './components/addScenario';

function App() {
  return (
    <div>
      <BrowserRouter>
        <div className="App">
          <Sidebar />
          <div className='right-section'>
            <Routes>
              <Route exact path='/' element={<Home />} />
              <Route exact path='/add-scenario' element={<AddScenario />} />
              <Route exact path='/all-scenarios' element={<AllScenarios />} />
              <Route exact path='/add-vehicle' element={<AddVehicle />} />
              <Route exact path='/add-vehicle/:index' element={<AddVehicle />} />
              <Route exact path='/edit-scenario/:index' element={<AddScenario/>}></Route> 
              <Route exact path='/edit-vehicle/:scenarioIndex/vehicle/:vehicleIndex' element={<AddVehicle/>}></Route> 
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
