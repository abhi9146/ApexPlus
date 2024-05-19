import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllScenarios } from '../api/scenarioApis'; // Import the update vehicle API
import { addVehicle,updateVehicle } from '../api/vehicleApis';
import '../App.css';

export const AddVehicle = () => {
  const { scenarioIndex, vehicleIndex } = useParams();
  const [name, setName] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [speed, setSpeed] = useState('');
  const [positionX, setPositionX] = useState('');
  const [positionY, setPositionY] = useState('');
  const [direction, setDirection] = useState('');
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    name: '',
    vehicleName: '',
    speed: '',
    positionX: '',
    positionY: '',
    direction: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllScenarios();
        setAllData(data);
        if (scenarioIndex !== undefined && vehicleIndex !== undefined) {
          // If scenario index and vehicle index are provided, fetch the vehicle data
          const vehicleData = data[scenarioIndex]?.vehicles[vehicleIndex];
          if (vehicleData) {
            setName(vehicleData.name);
            setVehicleName(vehicleData.vehicleName);
            setSpeed(vehicleData.speed);
            setPositionX(vehicleData.positionX);
            setPositionY(vehicleData.positionY);
            setDirection(vehicleData.direction);
          }
        }
      } catch (error) {
        console.error('Error fetching scenarios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scenarioIndex, vehicleIndex]);

  const handleAddOrUpdateVehicle = async () => {
    try {
      // Validate all fields are filled
      const newErrors = {};
      if (!name) newErrors.name = 'Scenario List is required.';
      if (!vehicleName) newErrors.vehicleName = 'Vehicle Name is required.';
      if (!speed) newErrors.speed = 'Speed is required.';
      if (!positionX) newErrors.positionX = 'Position X is required.';
      if (!positionY) newErrors.positionY = 'Position Y is required.';
      if (!direction) newErrors.direction = 'Direction is required.';
      
      // Validate positionX and positionY values
      const posX = parseInt(positionX);
      const posY = parseInt(positionY);
      if (posX <= 1 || posX >= 800) newErrors.positionX = 'Position X should be between 1 and 800.';
      if (posY <= 1 || posY >= 800) newErrors.positionY = 'Position Y should be between 1 and 800.';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // If all validations pass, proceed to add or update vehicle
      if (scenarioIndex !== undefined && vehicleIndex !== undefined) {
        // If scenario index and vehicle index are provided, update the existing vehicle
        await updateVehicle(scenarioIndex, vehicleIndex, { name, vehicleName, speed, positionX, positionY, direction });
      } else {
        // Otherwise, add a new vehicle
        await addVehicle({ name, vehicleName, speed, positionX, positionY, direction });
      }
      handleReset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = () => {
    setName('');
    setVehicleName('');
    setSpeed('');
    setPositionX('');
    setPositionY('');
    setDirection('');
    setErrors({
      name: '',
      vehicleName: '',
      speed: '',
      positionX: '',
      positionY: '',
      direction: ''
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='AddScenario'>
      <div className='scenarioPath'>Vehicle / add</div>
      <div className='Scenario-heading'>Add Vehicle</div>
      <div className='Vehicle-body'>
        <div className='row'>
          <div className='inputs'>
            <label htmlFor="name">Scenario List</label>
            <select className="direction" id="name" value={name} onChange={(e) => setName(e.target.value)}>
              <option value="" disabled hidden>Select Scenario</option>
              {allData && allData.map((scenario, index) => (
                <option key={index} value={scenario.scenarioName}>{scenario.scenarioName}</option>
              ))}
            </select>
            {errors.name && <div className="error">{errors.name}</div>}
          </div>
          <div className='inputs'>
            <label htmlFor="vehicleName">Vehicle Name</label>
            <input type="text" id="vehicleName" value={vehicleName} onChange={(e) => setVehicleName(e.target.value)} />
            {errors.vehicleName && <div className="error">{errors.vehicleName}</div>}
          </div>
          <div className='inputs'>
            <label htmlFor="speed">Speed</label>
            <input type="text" id="speed" value={speed} onChange={(e) => setSpeed(e.target.value)} />
            {errors.speed && <div className="error">{errors.speed}</div>}
          </div>
        </div>
        <div className='row'>
          <div className='inputs'>
            <label htmlFor="positionX">Position X</label>
            <input type="text" id="positionX" value={positionX} onChange={(e) => setPositionX(e.target.value)} />
            {errors.positionX && <div className="error">{errors.positionX}</div>}
          </div>
          <div className='inputs'>
            <label htmlFor="positionY">Position Y</label>
            <input type="text" id="positionY" value={positionY} onChange={(e) => setPositionY(e.target.value)} />
            {errors.positionY && <div className="error">{errors.positionY}</div>}
          </div>
          <div className='inputs'>
            <label htmlFor="direction">Direction</label>
            <select className="direction" id="direction" value={direction} onChange={(e) => setDirection(e.target.value)}>
              <option value="" disabled hidden>Select Direction</option>
              <option value="towards">Towards</option>
              <option value="upwards">Upwards</option>
              <option value="forwards">Forwards</option>
              <option value="backwards">Backwards</option>
            </select>
            {errors.direction && <div className="error">{errors.direction}</div>}
          </div>
        </div>
      </div>
      <div className='button-div'>
        <button className='button' style={{ backgroundColor: '#5CB65E' }} onClick={handleAddOrUpdateVehicle}>{scenarioIndex ? 'Update' : 'Add'}</button>
        <button className='button' style={{ backgroundColor: '#DF7B36' }} onClick={handleReset}>Reset</button>
        <button className='button' style={{ backgroundColor: '#4C9AB8' }} onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );
};
