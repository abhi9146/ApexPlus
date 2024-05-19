import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addScenario, updateScenario, getAllScenarios } from '../api/scenarioApis';
import '../App.css';

export const AddScenario = () => {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [scenarioData, setScenarioData] = useState(null);
  const [allData, setAllData] = useState([]);
  const [errors, setErrors] = useState({}); // State to track validation errors
  const { index } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllScenarios();
        setAllData(data);
      } catch (error) {
        console.error('Error fetching scenarios:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (index !== undefined && allData.length > 0) {
      // If index is defined and data is loaded
      const scenario = allData[index];
      setName(scenario.scenarioName);
      setTime(scenario.scenarioTime);
      setScenarioData(scenario);
    }
  }, [index, allData]);

  const handleAddOrUpdateScenario = async () => {
    try {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length === 0) {
        // If there are no validation errors
        if (scenarioData) {
          // If scenarioData exists, it means we're updating an existing scenario
          const updatedScenario = { ...scenarioData, scenarioName: name, scenarioTime: time };
          await updateScenario(index, updatedScenario);
          handleReset();
          navigate(-1);
        } else {
          // Otherwise, it's a new scenario, so add it
          await addScenario({ scenarioName: name, scenarioTime: time });
          handleReset();
        }
      } else {
        // If there are validation errors, update the errors state
        setErrors(validationErrors);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleReset = () => {
    setName('');
    setTime('');
    setErrors({}); // Clear validation errors on reset
  };

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Scenario name is required';
    }
    if (!time.trim()) {
      errors.time = 'Scenario time is required';
    }
    return errors;
  };

  return (
    <div className='AddScenario'>
      <div className='scenarioPath'>Scenario / {scenarioData ? 'edit' : 'add'}</div>
      <div className='Scenario-heading'>{scenarioData ? 'Edit Scenario' : 'Add Scenario'}</div>
      <div className='Scenario-body'>
        <div className={`inputs ${errors.name ? 'error' : ''}`}>
          <label htmlFor="name">Scenario Name</label>
          <input type="text" id="name" value={name} className={errors.name ? 'error' : ''} onChange={(e) => setName(e.target.value)} />
          {errors.name && <span className='error-message'>{errors.name}</span>}
        </div>
        <div className={`inputs ${errors.time ? 'error' : ''}`}>
          <label htmlFor="time">Scenario Time</label>
          <input type="text" id="time" value={time} className={errors.name ? 'error' : ''} onChange={(e) => setTime(e.target.value)} />
          {errors.time && <span className='error-message'>{errors.time}</span>}
        </div>
      </div>
      <div className='button-div'>
        <button className='button' style={{ backgroundColor: '#5CB65E' }} onClick={handleAddOrUpdateScenario}>{scenarioData ? 'Update' : 'Add'}</button>
        <button className='button' style={{ backgroundColor: '#DF7B36' }} onClick={handleReset}>Reset</button>
        <button className='button' style={{ backgroundColor: '#4C9AB8' }} onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );
};
