import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [orderName, setOrderName] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [dat, setDat] = useState([]);

  const getCoordinates = async (address) => {
    const apiKey = "ab3e7f8d0807598c0ebddfb023bbcefd";
    const url = http://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${encodeURIComponent(address)};

    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        const data = response.data;
        if (data && data.data && data.data.length > 0) {
          const { latitude, longitude } = data.data[0];
          return { latitude, longitude };
        } else {
          throw new Error('No coordinates found for the given address');
        }
      } else {
        throw new Error(Error: ${response.status});
      }
    } catch (error) {
      console.error(Error fetching coordinates from API: ${error});
    }
  };

  const getDistanceMatrix = async (origins, destinations) => {
    const apiKey = "BtOWonPlI3lCrD24nH43t0XebIEcAo5FwKirYXcsCMfedNWT4WVjNT7GcUkPBBFO";
    const url = https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey};

    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(Error: ${response.status});
      }
    } catch (error) {
      console.error(Error fetching data from API: ${error});
    }
  };

  const extractData = (data) => {
    if (data && data.rows && data.rows.length > 0) {
      const elements = data.rows[0].elements;
      if (elements && elements.length > 0) {
        const distance = elements[0].distance ? elements[0].distance.text : 'No distance information available';
        const duration = elements[0].duration ? elements[0].duration.text : 'No duration information available';
        return { distance, duration };
      }
    }
    return { distance: 'No distance information available', duration: 'No duration information available' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const originCoords = await getCoordinates(origin);
    const destinationCoords = await getCoordinates(destination);

    if (originCoords && destinationCoords) {
      const origins = ${originCoords.latitude},${originCoords.longitude};
      const destinations = ${destinationCoords.latitude},${destinationCoords.longitude};

      const data = await getDistanceMatrix(origins, destinations);

      if (data) {
        const { distance, duration } = extractData(data);
        if (distance !== 'No distance information available' && duration !== 'No duration information available') {
          setDat(prevData => [...prevData, {  distance, duration }]);

          setOrderName('');
          setOrigin('');
          setDestination('');
        }
      }

      console.log(dat);

    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Distance Calculator</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Order Name:
              <input
                type="text"
                value={orderName}
                onChange={(e) => setOrderName(e.target.value)}
                placeholder="Enter order name"
              />
            </label>
          </div>
          <div>
            <label>
              Origin:
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Enter origin address"
              />
            </label>
          </div>
          <div>
            <label>
              Destination:
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination address"
              />
            </label>
          </div>
          <button type="submit">Add Distance</button>
        </form>
        <div>
          <h2>Data:</h2>
          <ul>
            {dat.map((item, index) => (
              <li key={index}>
                <strong>Order Name:</strong> {item.orderName}<br />
                <strong>Origin:</strong> {item.origin}<br />
                <strong>Destination:</strong> {item.destination}<br />
                <strong>Distance:</strong> {item.distance}<br />
                <strong>Duration:</strong> {item.duration}
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
