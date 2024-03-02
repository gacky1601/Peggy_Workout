import './App.css';
import React, { useState, useEffect } from 'react';
import '@radix-ui/themes/styles.css';
import axios from 'axios';
import { Card, Text, Button, Select, Table, Box, Grid, Blockquote, Flex, Badge, Callout } from '@radix-ui/themes';
import { UpdateIcon, RadiobuttonIcon } from '@radix-ui/react-icons'


const api_url = "https://api.yupooooo.me"

function App() {
  const [realtime_data, setRealTimeData] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(localStorage.getItem('selectedRoute') || 'r');
  const [selectedStation, setSelectedStation] = useState(localStorage.getItem('selectedStation') || '台北車站站');
  const [location, setlocation] = useState(localStorage.getItem('location') || '25.0466569,121.5231783')


  useEffect(() => {
    // requestLocationPermission();

    axios.get(`${api_url}/api/route/${selectedRoute}`)
      .then(response => {
        setStations(response.data);
        if (!selectedStation && response.data.length > 0) {
          setSelectedStation(response.data[100]);
        }
      })
      .catch(error => {
        console.log('Error fetching stations:', error);
      });

    const fetchData = () => {
      if (!selectedStation) return;

      axios.get(`${api_url}/api/metro/${encodeURIComponent(selectedStation)}`)
        .then(response => {
          setRealTimeData(response.data);
        })
        .catch(error => {
          console.log('Error fetching data:', error);
        });
    };

    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 100000);

    return () => clearInterval(intervalId);

  }, [selectedStation, selectedRoute]);


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



        <Grid columns="1" gap="5" style={{ width: '100%', margin: '0 auto' }}>
          <Grid columns="7" gap="5" style={{ width: '80%', margin: '0 auto' }}>
            <Button size="2" color='red' onClick={() => handleRouteChange('r')}>R</Button>
            <Button size="2" color='blue' onClick={() => handleRouteChange('bl')}>BL</Button>
            <Button size="2" color='green' onClick={() => handleRouteChange('g')}>G</Button>
            <Button size="2" color='orange' onClick={() => handleRouteChange('o')}>O</Button>
            <Button size="2" color='brown' onClick={() => handleRouteChange('br')}>BR</Button>
            <Button onClick={fetchData}> <UpdateIcon></UpdateIcon> </Button>
            <Button onClick={requestLocationPermission} color='yellow'> <RadiobuttonIcon> </RadiobuttonIcon></Button>
          </Grid>
        </Grid>

        <p></p>

        <Grid columns="4" gap="4" style={{ width: '80%', margin: '0 auto' }}>
          {stations.map((station, index) => (
            <Button
              size="2"
              width="3"
              align="center"
              variant={station === selectedStation ? "surface" : "soft"}
              key={index}
              value={station}
              onClick={() => handleStationChange(station)}
              style={{
                whiteSpace: 'nowrap', // Prevent text wrapping
                fontSize: station.length > 4 ? '0.5rem' : '0.75rem' // Adjust font size based on text length
              }}
            >
              {station}
            </Button>
          ))}
        </Grid>



        <Grid columns="1" gap="5" style={{ width: '100%', margin: '0 auto' }}>
          <Grid columns="3" gap="4" style={{ width: '80%', margin: '0 auto' }}>
            <Blockquote size="4">
              <Flex gap="2">
                <Badge color="red">即將進站</Badge>
                <Badge color="blue">尚未到站</Badge>
                <Badge color="green">離站</Badge>
              </Flex>
            </Blockquote>
          </Grid>

          <Grid columns="2" gap="4" style={{ width: '80%', margin: '0 auto' }}>

            {realtime_data.map((item, index) => (
              <Card asChild
                style={{
                  maxWidth: 350,
                  background: item.CountDown == "列車進站" ? "rgba(200, 0, 0, 0.3)" : "",

                }}
              >
                <a href="#">
                  <Text as="div" size="3" weight="bold">
                    往：{item.DestinationName}
                  </Text>
                  <Text as="div" color="gray" size="2">
                    {item.CountDown}
                  </Text >
                  <Text as="div" color="gray" size="2">
                    {item.TrainNumber}
                  </Text>
                </a>
              </Card>

            ))}

          </Grid>
        </Grid>




      </div>
    </div>
  );

}
export default App;
