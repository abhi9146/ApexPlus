const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// POST route to handle adding vehicle data
app.post("/api/addVehicle", (req, res) => {
  const vehicleData = req.body;
  fs.readFile('../data/scenarioData.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data.json file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    let jsonData = JSON.parse(data);
    for(let i=0;i<jsonData.length;i++) {
       if(jsonData[i].scenarioName===vehicleData.name){
         if(jsonData[i].vehicles)
          jsonData[i].vehicles.push(vehicleData);
         else{
          jsonData[i].vehicles=[];
          jsonData[i].vehicles.push(vehicleData);
         }
          break;
       }
    }

    fs.writeFile('../data/scenarioData.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('Error writing to data.json file:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      console.log('Vehicle data added successfully to scenarioData.json');
      res.json({ message: 'Vehicle added successfully to scenario' });
    });
  });
});
// Endpoint to delete a vehicle from a scenario
app.delete("/api/deleteVehicle/:scenarioIndex/:vehicleIndex", (req, res) => {
  const { scenarioIndex, vehicleIndex } = req.params;
  
  fs.readFile('../data/scenarioData.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading scenarioData.json file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    let jsonData = JSON.parse(data);

    // Check if the scenario index and vehicle index are valid
    if (scenarioIndex >= 0 && scenarioIndex < jsonData.length) {
      const scenario = jsonData[scenarioIndex];
      if (vehicleIndex >= 0 && vehicleIndex < scenario.vehicles.length) {
        // Remove the vehicle from the scenario
        scenario.vehicles.splice(vehicleIndex, 1);

        // Write the updated data back to the JSON file
        fs.writeFile('../data/scenarioData.json', JSON.stringify(jsonData, null, 2), (err) => {
          if (err) {
            console.error('Error writing to scenarioData.json file:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          console.log('Vehicle deleted successfully from scenarioData.json');
          res.json({ message: 'Vehicle deleted successfully' });
        });
      } else {
        res.status(404).json({ error: 'Vehicle not found in scenario' });
      }
    } else {
      res.status(404).json({ error: 'Scenario not found' });
    }
  });
});
const getAllScenariosFromDB = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('../data/scenarioData.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading scenarioData.json file:', err);
        reject('Internal server error');
      } else {
        try {
          const scenarios = JSON.parse(data);
          resolve(scenarios);
        } catch (error) {
          console.error('Error parsing scenarioData.json:', error);
          reject('Error parsing scenarios data');
        }
      }
    });
  });
};
const saveScenariosToDatabase = (scenarios) => {
  return new Promise((resolve, reject) => {
    fs.writeFile('../data/scenarioData.json', JSON.stringify(scenarios, null, 2), (err) => {
      if (err) {
        console.error('Error writing to scenarioData.json file:', err);
        reject('Internal server error');
      } else {
        console.log('Scenarios saved successfully to database');
        resolve();
      }
    });
  });
};
// Assuming you have a route for updating a vehicle in your Express.js server
app.put('/api/updateVehicle/:scenarioIndex/:vehicleIndex', async (req, res) => {
  const { scenarioIndex, vehicleIndex } = req.params;
  const updatedVehicleData = req.body; // Assuming updated vehicle data is sent in the request body

  try {
    // Fetch the scenario data
    let scenarios = await getAllScenariosFromDB(); // Function to fetch scenarios from your database
    const scenario = scenarios[scenarioIndex];

    if (!scenario || !scenario.vehicles || !scenario.vehicles[vehicleIndex]) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Update the vehicle data
    scenario.vehicles[vehicleIndex] = { ...scenario.vehicles[vehicleIndex], ...updatedVehicleData };

    // Save the updated scenario data back to the database
    await saveScenariosToDatabase(scenarios); // Function to save scenarios to your database

    res.json({ message: 'Vehicle updated successfully', updatedVehicle: scenario.vehicles[vehicleIndex] });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to add a scenario
app.post("/api/addScenario", (req, res) => {
  const scenarioData = req.body;
  fs.readFile('../data/scenarioData.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading scenarios.json file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    let jsonData = data ? JSON.parse(data) : [];
    scenarioData.vehicles = [];
    jsonData.push(scenarioData);

    fs.writeFile('../data/scenarioData.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('Error writing to scenarios.json file:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      console.log('Scenario data added successfully to scenarios.json');
      res.json({ message: 'Scenario added successfully' });
    });
  });
});

// Endpoint to get all scenarios
app.get("/api/allScenarios", (req, res) => {
  fs.readFile('../data/scenarioData.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading scenarios.json file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const scenarios = JSON.parse(data);
    res.json(scenarios);
  });
});
// Endpoint to update a scenario
app.put("/api/updateScenario/:scenarioIndex", (req, res) => {
  const scenarioIndex = req.params.scenarioIndex;
  const updatedScenarioData = req.body;

  // Read existing scenarios from the JSON file
  fs.readFile('../data/scenarioData.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading scenarioData.json file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    let jsonData = JSON.parse(data);

    // Update the scenario data at the specified index
    if (scenarioIndex >= 0 && scenarioIndex < jsonData.length) {
      jsonData[scenarioIndex] = updatedScenarioData;

      // Write the updated data back to the JSON file
      fs.writeFile('../data/scenarioData.json', JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.error('Error writing to scenarioData.json file:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        console.log('Scenario updated successfully in scenarioData.json');
        res.json({ message: 'Scenario updated successfully' });
      });
    } else {
      res.status(404).json({ error: 'Scenario not found' });
    }
  });
});

// DELETE route to handle deleting scenario data
app.delete("/api/deleteScenario", (req, res) => {
  const { scenarioIndex } = req.body;
  fs.readFile('../data/scenarioData.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading scenarioData.json file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    let jsonData = JSON.parse(data);

    // Delete the scenario data
    jsonData.splice(scenarioIndex, 1);

    // Write the updated data back to the JSON file
    fs.writeFile('../data/scenarioData.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('Error writing to scenarioData.json file:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      console.log('Scenario data deleted successfully from scenarioData.json');
      res.json({ message: 'Scenario deleted successfully' });
    });
  });
});
// Endpoint to delete all scenarios
app.delete("/api/deleteAllScenarios", (req, res) => {
  // Read existing scenarios from the JSON file
  fs.readFile('../data/scenarioData.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading scenarioData.json file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Overwrite the file with an empty array to delete all scenarios
    fs.writeFile('../data/scenarioData.json', '[]', (err) => {
      if (err) {
        console.error('Error writing to scenarioData.json file:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      console.log('All scenarios deleted successfully from scenarioData.json');
      res.json({ message: 'All scenarios deleted successfully' });
    });
  });
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});