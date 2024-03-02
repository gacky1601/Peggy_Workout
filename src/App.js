import './App.css';
import React, { useState, useEffect } from 'react';
import '@radix-ui/themes/styles.css';
import axios from 'axios';
import { Card, Text, Button, Select, Table, Box, Grid, Blockquote, Flex, Badge, Callout } from '@radix-ui/themes';
import { UpdateIcon, Crosshair2Icon } from '@radix-ui/react-icons'
import * as stationConfigs from './stationsConfig';
const api_url = "https://api.yupooooo.me"

function App() {
  const [realtime_data, setRealTimeData] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(localStorage.getItem('selectedRoute') || 'r');
  const [selectedStation, setSelectedStation] = useState(localStorage.getItem('selectedStation') || '台北車站');
  const [location, setlocation] = useState(localStorage.getItem('location') || '25.046255,121.517532')
  const stationMap = {
    r: stationConfigs.r,
    bl: stationConfigs.bl,
    g: stationConfigs.g,
    o: stationConfigs.o,
    br: stationConfigs.br,
  };

  useEffect(() => {
    setStations(stationMap[selectedRoute] || []);

    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 100000);

    return () => clearInterval(intervalId);

  }, [selectedRoute,selectedStation]);


  const requestLocationPermission = () => {
    if ("geolocation" in navigator) {
      // Check if geolocation is supported/enabled on the current device
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // On success, do something with the obtained position
          console.log("Latitude: ", position.coords.latitude);
          console.log("Longitude: ", position.coords.longitude);

          setlocation(`${position.coords.latitude},${position.coords.longitude}`);
          axios.get(`${api_url}/api/location/${encodeURIComponent(location)}`)
            .then(response => {
              handleStationChange(response.data);
              if (stationMap.bl.includes(response.data)) {
                setSelectedRoute("bl");
              }
              else if (stationMap.r.includes(response.data)) {
                setSelectedRoute("r");
              }
              else if (stationMap.g.includes(response.data)) {
                setSelectedRoute("g");
              }
              else if (stationMap.o.includes(response.data)) {
                setSelectedRoute("o");
              }
              else if (stationMap.br.includes(response.data)) {
                setSelectedRoute("br");
              }
            })
            .catch(error => {
              console.log('Error fetching data:', error);
            });
        },
        (error) => {
          // Handle error or denial
          console.error("Error obtaining location: ", error.message);
        },
        {
          // Optional: Configuration object for the location request
          enableHighAccuracy: true, // Provides a hint that the application needs the best possible results
          timeout: 5000, // Amount of time before the error callback is invoked, if 0 it will never invoke.
          maximumAge: 0 // Maximum cached position age.
        }
      );
    } else {
      // Geolocation is not supported
      console.error("Geolocation is not supported by this browser.");
    }
  };


  const handleStationChange = (newValue) => {
    setSelectedStation(newValue);
    localStorage.setItem('selectedStation', newValue);
  };

  const handleRouteChange = (newValue) => {
    setSelectedRoute(newValue);
    localStorage.setItem('selectedRoute', newValue);
  };

  const fetchData = () => {
    if (!selectedStation) return;
    axios.get(`${api_url}/api/metro/${encodeURIComponent(selectedStation)}`)
      .then(response => {
        setRealTimeData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  };

  return (
    <div className="App h-screen flex justify-center items-center">
      <div className='New'>
        <h1> </h1>
        <p></p>
        <Grid gap="4" className="grid-full">
          <Grid columns="5" gap="2" className="grid-80-center">
            <Button className="button-nowrap" color='red' onClick={() => handleRouteChange('r')}>R</Button>
            <Button className="button-nowrap" color='blue' onClick={() => handleRouteChange('bl')}>BL</Button>
            <Button className="button-nowrap" color='green' onClick={() => handleRouteChange('g')}>G</Button>
            <Button className="button-nowrap" color='orange' onClick={() => handleRouteChange('o')}>O</Button>
            <Button className="button-nowrap" color='brown' onClick={() => handleRouteChange('br')}>BR</Button>
          </Grid>
          <Grid columns="2" gap="2" className="grid-80-center">
            <Button onClick={fetchData} color='iris'> <UpdateIcon></UpdateIcon> </Button>
            <Button onClick={requestLocationPermission} color='gray'> <Crosshair2Icon> </Crosshair2Icon></Button>
          </Grid>

          <Grid columns="3" gap="2" className="grid-80-center">
            {stations.map((station, index) => (
              <Button
                className={`button-nowrap ${station === selectedStation ? "surface" : "soft"}`}
                color="brown"
                variant={station === selectedStation ? "surface" : "soft"}
                key={index}
                value={station}
                onClick={() => handleStationChange(station)}
              >
                {station}
              </Button>
            ))}
          </Grid>

          <Grid className="grid-80-center">
            <Blockquote size="4">
              <Flex gap="2">
                <Badge color="red">即將進站</Badge>
                <Badge color="gray">尚未到站</Badge>
              </Flex>
            </Blockquote>
          </Grid>

          <Grid columns="2" gap="2" className="grid-80-center">
            {realtime_data.map((item, index) => (
              <Card
                asChild
                className={`card-max ${item.CountDown == "列車進站" ? "card-train-approaching" : ""}`}
                key={index}
              >
                <a href="#">
                  <Text as="div" size="2" weight="bold">
                    往 {item.DestinationName}
                  </Text>
                  <Text as="div" color="gray" size="2">
                    {item.CountDown}
                  </Text>
                  <Text as="div" color="gray" size="2">
                    {item.TrainNumber}
                  </Text>
                </a>
              </Card>
            ))}
          </Grid>
        </Grid>

      </div>
    </div >
  );


}
export default App;
