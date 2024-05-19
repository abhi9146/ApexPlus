import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllScenarios, deleteScenario,deleteAllScenarios } from '../api/scenarioApis';
import '../App.css';

export const AllScenarios = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleDelete = async (index) => {
    try {
      await deleteScenario(index);
      setAllData(allData.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting scenario:', error);
    }
  };
  const handleDeleteAll = async () => {
    try {
      await deleteAllScenarios();
      setAllData([]);
    } catch (error) {
      console.error('Error deleting scenario:', error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllScenarios();
        setAllData(data);
      } catch (error) {
        console.error('Error fetching scenarios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='AddScenario'>
      <div className='AllScenario-header'>
        <div className='Scenario-heading'>All Scenario</div>
        <div className='button-div'>
          <button className='button' style={{ backgroundColor: '#4C9AB8' }} onClick={() => navigate('/add-scenario')}>New Scenario</button>
          <button className='button' style={{ backgroundColor: '#5CB65E' }} onClick={() => navigate('/add-vehicle')}>Add Vehicle</button>
          <button className='button' style={{ backgroundColor: '#DF7B36' }} onClick={() => handleDeleteAll()}>Delete All</button>
        </div>
      </div>
      <div className='allScenario-body'>
        <table className='scenario-table'>
          <thead>
            <tr>
              <th>Scenario ID</th>
              <th>Scenario Name</th>
              <th>Scenario Time</th>
              <th>Number of Vehicles</th>
              <th>Add Vehicle</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
          {allData && allData.map((scenario, index) => (
            <tr key={index + 1}>
              <td>{index + 1}</td>
              <td>{scenario.scenarioName}</td>
              <td>{scenario.scenarioTime}</td>
              <td>{scenario.vehicles ? scenario.vehicles.length : 0}</td>
              <td><button className='plus radius' onClick={() => navigate(`/add-vehicle/${index}`)}></button></td>
              <td><button style={{ border: 'none' }} onClick={() => navigate(`/edit-scenario/${index}`)}><i className="fa fa-pencil" style={{ fontSize: '24px', color: 'black' }}></i></button></td>
              <td><button style={{ border: 'none' }} onClick={() => handleDelete(index)}><i className="fa fa-trash-o" style={{ fontSize: '24px' }}></i></button></td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
