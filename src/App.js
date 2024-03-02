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
  const bl = ['頂埔', '永寧', '土城', '海山', '亞東醫院', '府中', '板橋', '新埔', '江子翠', '龍山寺', '西門', '台北車站', '善導寺', '忠孝新生', '忠孝復興', '忠孝敦化', '國父紀念館', '市政府', '永春', '後山埤', '昆陽', '南港', '南港展覽館'];

  const r = ['動物園', '木柵', '萬芳社區', '萬芳醫院', '辛亥', '麟光', '六張犁', '科技大樓', '大安', '忠孝復興', '南京復興', '中山國中', '松山機場', '大直', '劍南路', '西湖', '港墘', '文德', '內湖', '大湖公園', '葫洲', '東湖', '南港軟體園區', '南港展覽館', '象山', '台北101/世貿', '信義安和', '大安森林公園', '東門', '中正紀念堂', '台大醫院', '台北車站', '中山', '雙連', '民權西路', '圓山', '劍潭', '士林', '芝山', '明德', '石牌', '唭哩岸', '奇岩', '北投', '復興崗', '忠義', '關渡', '竹圍', '紅樹林', '淡水'];

  const o = ['南勢角', '景安', '永安市場', '頂溪', '古亭', '東門', '忠孝新生', '松江南京', '行天宮', '中山國小', '民權西路', '大橋頭', '台北橋', '菜寮', '三重', '先嗇宮', '頭前庄', '新莊', '輔大', '丹鳳', '迴龍'];

  const br = ['動物園', '木柵', '萬芳社區', '萬芳醫院', '辛亥', '麟光', '六張犁', '科技大樓', '大安', '忠孝復興', '南京復興', '中山國中', '松山機場', '大直', '劍南路', '西湖', '港墘', '文德', '內湖', '大湖公園', '葫洲', '東湖', '南港軟體園區', '南港展覽館'];

  const g = ['新店', '新店區公所', '七張', '大坪林', '景美', '萬隆', '公館', '台電大樓', '古亭', '中正紀念堂', '小南門', '西門', '北門', '中山', '松江南京', '南京復興', '台北小巨蛋', '南京三民', '松山'];


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
              if (bl.includes(response.data)) {
                setSelectedRoute("bl");
              }
              else if (r.includes(response.data)) {
                setSelectedRoute("r");
              }
              else if (g.includes(response.data)) {
                setSelectedRoute("g");
              }
              else if (o.includes(response.data)) {
                setSelectedRoute("o");
              }
              else if (br.includes(response.data)) {
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



        <Grid columns="1" gap="5" style={{ width: '100%', margin: '0 auto' }}>
          <Grid columns="7" gap="5" style={{ width: '80%', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
            <Button size="2" color='red' onClick={() => handleRouteChange('r')}>R</Button>
            <Button size="2" color='blue' onClick={() => handleRouteChange('bl')}>BL</Button>
            <Button size="2" color='green' onClick={() => handleRouteChange('g')}>G</Button>
            <Button size="2" color='orange' onClick={() => handleRouteChange('o')}>O</Button>
            <Button size="2" color='brown' onClick={() => handleRouteChange('br')}>BR</Button>
          </Grid>
          <Grid columns="2" gap="5" style={{ width: '80%', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
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
              color="brown"
              variant={station === selectedStation ? "surface" : "soft"}
              key={index}
              value={station}
              onClick={() => handleStationChange(station)}
              style={{
                whiteSpace: 'nowrap', // Prevent text wrapping
                overflow: 'hidden', // Prevent text from overflowing
                textOverflow: 'ellipsis', // Add ellipsis if text overflows
                fontSize: station.length > 4 ? '0.70rem' : '0.75rem', // Adjust font size based on text length
                maxWidth: '90%', // Ensure the button text does not exceed its container
                display: 'flex', // Use flexbox for alignment
                justifyContent: 'center', // Center the text horizontally
                alignItems: 'center', // Center the text vertically
              }}
            >
              {station}
            </Button>
          ))}
        </Grid>

        <p></p>

        <Grid columns="1" gap="5" style={{ width: '100%', margin: '0 auto' }}>
          <Grid columns="3" gap="4" style={{ width: '80%', margin: '0 auto' }}>
            <Blockquote size="4">
              <Flex gap="2">
                <Badge color="red">即將進站</Badge>
                <Badge color="gray">尚未到站</Badge>
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
