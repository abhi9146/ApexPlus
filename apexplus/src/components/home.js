import React, { useState, useEffect } from 'react';
import { getAllScenarios } from '../api/scenarioApis';
import { deleteVehicle } from '../api/vehicleApis';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioTime, setScenarioTime] = useState();
  const [allData, setAllData] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(null);
  const [simulationRunning, setSimulationRunning] = useState(false); // State variable to track simulation status
  const [simulationInterval, setSimulationInterval] = useState(null); // State variable to track simulation interval ID
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllScenarios();
        setAllData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching scenarios:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Define a color palette
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#8000ff', '#0080ff', '#ff0080'];
    // Update vehicle colors based on their index
    const updatedVehicles = vehicles.map((vehicle, index) => ({
      ...vehicle,
      color: colors[index % colors.length] // Assign a color from the palette based on index
    }));
    setVehicles(updatedVehicles);
  }, []);

  const handleScenarioChange = (e) => {
    const selectedScenarioName = e.target.value;
    setScenarioName(selectedScenarioName);
    const selectedIndex = allData.findIndex(scenario => scenario.scenarioName === selectedScenarioName);
    setSelectedScenarioIndex(selectedIndex);
    setScenarioTime(parseInt(allData[selectedIndex].scenarioTime));
    setVehicles(allData[selectedIndex]?.vehicles || []);
  };

  const handleDeleteVehicle = async (vehicleIndex) => {
    try {
      // Make a DELETE request to delete the vehicle
      await deleteVehicle(selectedScenarioIndex, vehicleIndex);
      
      // Update the frontend state accordingly
      const updatedVehicles = [...vehicles];
      updatedVehicles.splice(vehicleIndex, 1);
      setVehicles(updatedVehicles);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  // Function to start the simulation
  const startSimulation = () => {
    setSimulationRunning(true);
    const intervalId = setInterval(simulateMovementForAllVehicles, 1000);
    setSimulationInterval(intervalId);
  };

  // Function to stop the simulation
  const stopSimulation = () => {
    setSimulationRunning(false);
    clearInterval(simulationInterval);
  };
// Function to convert direction strings to angles in degrees
const directionToAngle = (direction) => {
  switch (direction.toLowerCase()) {
    case 'downwards':
      return 180; // Straight downwards
    case 'towards':
      return 0; // Straight towards
    case 'backwards':
      return 180; // Straight backwards (same as downwards)
    case 'upwards':
      return 90; // Straight upwards
    default:
      return 0; // Default to straight towards
  }
};
const simulateMovementForAllVehicles = async () => {
  console.log("Vehicles simulation started");
  try {
    // Iterate over each second within the scenario time
    for (let currentTime = 0; currentTime <= scenarioTime; currentTime++) {
      if (!simulationRunning) return; // Check if simulation should stop

      // Iterate over each vehicle in the scenario
      const updatedVehicles = vehicles.map((vehicle) => {
        const { speed, direction, positionX, positionY } = vehicle;

        // Calculate the direction vectors
        const directionAngle = directionToAngle(direction);
        const deltaX = Math.cos((directionAngle - 90) * (Math.PI / 180));
        const deltaY = Math.sin((directionAngle - 90) * (Math.PI / 180));

        // Calculate the step size for each second
        const stepSizeX = deltaX * speed; 
        const stepSizeY = deltaY * speed;

        // Update the current position based on the step size
        let newPositionX = positionX + stepSizeX;
        let newPositionY = positionY + stepSizeY;

        // Check if the new position is within the grid boundaries (assuming 800x800 grid)
        if (newPositionX < 1 || newPositionX > 800 || newPositionY < 1 || newPositionY > 800) {
          // Vehicle reached the end of the grid, stop movement
          console.log(`Vehicle ${vehicle.id} reached the end of the grid`);
          return vehicle;
        }

        // Update the position of the current vehicle
        return { ...vehicle, positionX: newPositionX, positionY: newPositionY };
      });

      // Update the state with the new positions of vehicles
      setVehicles(updatedVehicles);

      // Wait for 1 second before moving to the next iteration
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('Error simulating vehicle movement:', error);
  }
};
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='Home'>
      <div className='Home-header'>
        <div className='Home-heading'>Scenario</div>
        <div className='inputs'>
          <select className="direction" value={scenarioName} onChange={handleScenarioChange}>
            <option value="" disabled hidden>Select Scenario</option>
            {allData && allData.map((scenario, index) => (
              <option key={index} value={scenario.scenarioName}>{scenario.scenarioName}</option>
            ))}
          </select>
        </div>
      </div>
      <div className='allScenario-body' style={{marginBottom:'0.8rem'}}>
        <table className='scenario-table'>
          <thead>
            <tr>
              <th>Vehicle ID</th>
              <th>Vehicle Name</th>
              <th>Position X</th>
              <th>Position Y</th>
              <th>Speed</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {vehicles && vehicles.map((vehicle, vehicleIndex) => (
              <tr key={vehicleIndex}>
                <td>{vehicleIndex + 1}</td>
                <td>{vehicle.vehicleName}</td>
                <td>{vehicle.positionX}</td>
                <td>{vehicle.positionY}</td>
                <td>{vehicle.speed}</td>
                <td>
                  <button style={{ border: 'none' }} onClick={() => navigate(`/edit-vehicle/${selectedScenarioIndex}/vehicle/${vehicleIndex}`)}>
                    <i className="fa fa-pencil" style={{ fontSize: '24px', color: 'black' }}></i>
                  </button>
                </td>
                <td>
                  <button style={{ border: 'none' }} onClick={() => handleDeleteVehicle(vehicleIndex)}>
                    <i className="fa fa-trash-o" style={{ fontSize: '24px' }}></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='Home-buttons'>
          <button className='button' style={{ backgroundColor: '#5CB65E' }} onClick={startSimulation} disabled={simulationRunning}>Start Simulation</button>
          <button className='button' style={{ backgroundColor: '#4C9AB8' }} onClick={stopSimulation} disabled={!simulationRunning}>Stop Simulation</button>
      </div>
      <div className='grid-container'>
        {/* Only render visible part of the grid */}
        <div className='viewport'>
          {Array.from({ length: 60 }, (_, row) => (
            <div key={row} className='grid-row'>
              {Array.from({ length: 60 }, (_, col) => (
                <div
                  key={`${row}-${col}`}
                  className='grid-square'
                  style={{ border: '1px solid green' }}
                >
                  {/* Check if there's a vehicle at this position */}
                  {vehicles.some(
                    vehicle =>
                      parseInt(vehicle.positionX) === col &&
                      parseInt(vehicle.positionY) === row
                  ) && (
                    <div
                      className='vehicle-marker'
                      style={{
                        backgroundColor: vehicles.find(
                          vehicle =>
                            parseInt(vehicle.positionX) === col &&
                            parseInt(vehicle.positionY) === row
                        ).color
                      }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
