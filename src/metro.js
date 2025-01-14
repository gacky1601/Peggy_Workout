import './App.css';
import React, { useState, useEffect } from 'react';

import { Card, Text, Button, Grid, Blockquote, Flex, Box, Badge, Callout } from '@radix-ui/themes';
import { UpdateIcon, Crosshair2Icon, InfoCircledIcon, CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons'
import * as stationConfigs from './stationsConfig';
import { fetchRealtimeData, requestLocationPermission } from './utils';
import { BrandHeader } from './Header.js';
const api_url = "https://peggy-backend-7kg3x2vbyq-de.a.run.app/"

export function Metro() {
  const [realtime_data, setRealTimeData] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(localStorage.getItem('selectedRoute') || 'Red');
  const [selectedStation, setSelectedStation] = useState(localStorage.getItem('selectedStation') || '');
  const [location, setlocation] = useState(localStorage.getItem('location') || '')
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

  }, [selectedRoute, selectedStation]);


  const refreshLocation = () => {
    requestLocationPermission(handleStationChange, handleRouteChange, setlocation, location);
  };
  const handleStationChange = (newValue) => {
    localStorage.setItem('selectedStation', newValue);
    setSelectedStation(newValue);
  };

  const handleRouteChange = (newValue) => {
    localStorage.setItem('selectedRoute', newValue);
    setPanel(true);
    setSelectedRoute(newValue);
  };

  const fetchRealTimeData = () => {
    fetchRealtimeData(selectedStation, setRealTimeData);
    setCountdown(10);
  };

  return (

    <div className="App h-screen flex justify-center items-center">
      <div className='New'>
        <Grid gap="4" className="grid-full">
          {/* <BrandHeader></BrandHeader> */}
          <Grid columns="6" gap="2" className="grid-80-center">
            <Button className="button-nowrap" color='red' variant={"Red" === selectedRoute && panelVisibility ? "outline" : "classic"} onClick={() => handleRouteChange('Red')}>R</Button>
            <Button className="button-nowrap" color='blue' variant={"Blue" === selectedRoute && panelVisibility ? "outline" : "classic"} onClick={() => handleRouteChange('Blue')}>BL</Button>
            <Button className="button-nowrap" color='green' variant={"Green" === selectedRoute && panelVisibility ? "outline" : "classic"} onClick={() => handleRouteChange('Green')}>G</Button>
            <Button className="button-nowrap" color='orange' variant={"Orange" === selectedRoute && panelVisibility ? "outline" : "classic"} onClick={() => handleRouteChange('Orange')}>O</Button>
            <Button className="button-nowrap" color='brown' variant={"Brown" === selectedRoute && panelVisibility ? "outline" : "classic"} onClick={() => handleRouteChange('Brown')}>BR</Button>
            <Button className="button-nowrap" color='yellow' variant={"Yellow" === selectedRoute && panelVisibility ? "outline" : "classic"} onClick={() => handleRouteChange('Yellow')}>Y</Button>
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
                className={`button-nowrap`}
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

          <Grid columns="1" gap="1" className="grid-80-center">
            <Callout.Root size="1">
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
                    <Grid columns="2">
                      <Text as="div" size="2" weight="bold">
                        往 {item.DestinationName.substring(0, item.DestinationName.length - 1)}
                      </Text>
                      <Text as="div" size="2" color="gray" align={"right"}>{item.CountDown} </Text>
                    </Grid>
                  </Box>
                  <Box>
                    {/* <Text as="div" size="2" color="gray">
                    </Text> */}
                    {/* <Text as="div" color="gray" size="2">
                      {item.TrainNumber}
                    </Text> */}
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
export default Metro;
