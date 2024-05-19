import axios from 'axios';

// Base URL for the API
const baseURL = 'http://localhost:5000/api';

// Function to add a scenario
export const addScenario = async (scenarioData) => {
  try {
    const response = await axios.post(`${baseURL}/addScenario`, scenarioData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to get all scenarios
export const getAllScenarios = async () => {
  try {
    const response = await axios.get(`${baseURL}/allScenarios`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Function to update a scenario
export const updateScenario = async (scenarioIndex, updatedScenarioData) => {
  try {
    const response = await axios.put(`${baseURL}/updateScenario/${scenarioIndex}`, updatedScenarioData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to delete a scenario
export const deleteScenario = async (scenarioIndex) => {
  try {
    const response = await axios.delete(`${baseURL}/deleteScenario`, { data: { scenarioIndex } });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Function to delete all scenarios
export const deleteAllScenarios = async () => {
  try {
    const response = await axios.delete(`${baseURL}/deleteAllScenarios`);
    return response.data;
  } catch (error) {
    throw error;
  }
};