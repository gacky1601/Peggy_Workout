import './App.css';
import React, { useState, useEffect, useCallback } from 'react';

import { Card, Text, Button, Grid, Blockquote, Flex, Box, Badge, ThemePanel, Avatar, Heading, IconButton, Callout } from '@radix-ui/themes';
import { UpdateIcon, Crosshair2Icon, InfoCircledIcon, CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons'
import * as stationConfigs from './stationsConfig';
import { fetchRealtimeData, requestLocationPermission } from './utils';
const api_url = "https://api.yupooooo.me"

function App() {
  const [realtime_data, setRealTimeData] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(localStorage.getItem('selectedRoute') || 'Red');
  const [selectedStation, setSelectedStation] = useState(localStorage.getItem('selectedStation') || '台北車站');
  const [location, setlocation] = useState(localStorage.getItem('location') || '25.046255,121.517532')
  const [panelVisibility, setPanel] = useState([false]);
  const [countdown, setCountdown] = useState(10);

  const stationMap = {
    Red: stationConfigs.RedLine,
    Blue: stationConfigs.BlueLine,
    Green: stationConfigs.GreenLine,
    Orange: stationConfigs.OrangeLine,
    Brown: stationConfigs.BrownLine,
    Yellow: stationConfigs.YellowLine
  };

  useEffect(() => {
    setStations(stationMap[selectedRoute] || []);
    fetchRealTimeData();

    const timerId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          fetchRealTimeData();
          return 10;
        }
        return prevCountdown - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);

  }, [selectedRoute, selectedStation, location]);


  const refreshLocation = () => {
    requestLocationPermission(handleStationChange, handleRouteChange, setlocation, location);
  };
  const handleStationChange = (newValue) => {
    setSelectedStation(newValue);
    localStorage.setItem('selectedStation', newValue);
  };

  const handleRouteChange = (newValue) => {
    setPanel(true);
    setSelectedRoute(newValue);
    localStorage.setItem('selectedRoute', newValue);
  };

  const fetchRealTimeData = () => {
    fetchRealtimeData(selectedStation, setRealTimeData);
    setCountdown(10);
  };

  return (
    <div className="App h-screen flex justify-center items-center">
      <div className='New'>
        <Grid gap="4" className="grid-full">
          <Box color='white'> </Box>
          <Text weight="bold"><Avatar
            size="1"
            src="https://mrt.yupooooo.me/logo512.png"
            radius="full"
            fallback="T"
          /> 小豬出行</Text>
          <Grid columns="6" gap="2" className="grid-80-center">
            <Button className="button-nowrap" color='red' onClick={() => handleRouteChange('Red')}>R</Button>
            <Button className="button-nowrap" color='blue' onClick={() => handleRouteChange('Blue')}>BL</Button>
            <Button className="button-nowrap" color='green' onClick={() => handleRouteChange('Green')}>G</Button>
            <Button className="button-nowrap" color='orange' onClick={() => handleRouteChange('Orange')}>O</Button>
            <Button className="button-nowrap" color='brown' onClick={() => handleRouteChange('Brown')}>BR</Button>
            <Button className="button-nowrap" color='yellow' onClick={() => handleRouteChange('Yellow')}>Y</Button>
          </Grid>
          <Grid columns="3" gap="2" className="grid-80-center">
            <Button onClick={() => setPanel(!panelVisibility)}>
              {panelVisibility ? <CaretUpIcon></CaretUpIcon> : <CaretDownIcon></CaretDownIcon>}
            </Button>
            <Button onClick={fetchRealTimeData} color='iris'> <UpdateIcon></UpdateIcon> </Button>
            <Button onClick={refreshLocation} color='gray'> <Crosshair2Icon> </Crosshair2Icon></Button>
          </Grid>

          {panelVisibility && <Grid columns="3" gap="2" className="grid-80-center">
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
          </Grid>}

          <Grid className="grid-80-center">
            <Blockquote size="4">
              <Flex gap="2">
                <Badge color="red">即將進站</Badge>
                <Badge color="gray">尚未到站</Badge>
                <Badge size="1">{countdown}</Badge>
              </Flex>
            </Blockquote>
          </Grid>
          <Grid columns="1" gap="2" className="grid-80-center">
            <Callout.Root>
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>
                {selectedStation}
              </Callout.Text>
            </Callout.Root>
          </Grid>

          <Grid columns="2" gap="2" className="grid-80-center">
            {
              realtime_data.map((item, index) => (
                <Card
                  style={{
                    background: item.CountDown === "列車進站" ? "rgba(160, 0, 0, 0.2)" : "",
                  }}
                  key={index}
                >
                  <Box>
                    <Text as="div" size="2" weight="bold">
                      往 {item.DestinationName.substring(0, item.DestinationName.length - 1)}
                    </Text>
                  </Box>
                  <Box>
                    <Text as="div" size="2" color="gray">
                      {item.CountDown}
                    </Text>
                    <Text as="div" color="gray" size="2">
                      {item.TrainNumber}
                    </Text>
                  </Box>
                </Card>
              ))
            }
          </Grid>

        </Grid>



      </div>
    </div >
  );


}
export default App;
