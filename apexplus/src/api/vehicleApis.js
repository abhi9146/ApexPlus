// api/addVehicle.js

import axios from 'axios';

// Function to add a vehicle
export const addVehicle = async (vehicleData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/addVehicle", vehicleData);
    return response.data;
  } catch (error) {
    throw new Error('Error adding vehicle:', error);
  }
};

// Function to delete a vehicle
export const deleteVehicle = async (scenarioIndex, vehicleIndex) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/deleteVehicle/${scenarioIndex}/${vehicleIndex}`);
    return response.data;
  } catch (error) {
    throw new Error('Error deleting vehicle:', error);
  }
};

export const updateVehicle = async (scenarioIndex, vehicleIndex, updatedVehicleData) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/updateVehicle/${scenarioIndex}/${vehicleIndex}`, updatedVehicleData);
    return response.data;
  } catch (error) {
    throw new Error('Error updating vehicle:', error);
  }
};

