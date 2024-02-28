import './App.css';
import React, { useState, useEffect } from 'react';
import '@radix-ui/themes/styles.css';
import axios from 'axios';
import { Card, Text, Button, Select, Table, Box, Grid, Blockquote, Flex, Badge, Callout } from '@radix-ui/themes';

const api_url="https://api.yupooooo.me"

function App() {
  const [data, setData] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(localStorage.getItem('selectedStation') || '');


  useEffect(() => {
    axios.get(`${api_url}/api/metro/`)
      .then(response => {
        setStations(response.data);
        if (!selectedStation && response.data.length > 0) {
          setSelectedStation(response.data[0]);
        }
      })
      .catch(error => {
        console.log('Error fetching stations:', error);
      });

    const fetchData = () => {
      if (!selectedStation) return;

      axios.get(`${api_url}/api/metro/${encodeURIComponent(selectedStation)}`)
        .then(response => {
          setData(response.data);
        })
        .catch(error => {
          console.log('Error fetching data:', error);
        });
    };

    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(intervalId);

  }, [selectedStation]);

  const handleStationChange = (newValue) => {
    setSelectedStation(newValue);
    localStorage.setItem('selectedStation', newValue);
  };

  const fetchData = () => {
    if (!selectedStation) return;

    axios.get(`${api_url}/api/metro/${encodeURIComponent(selectedStation)}`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  };

  return (
    <div className="App h-screen flex justify-center items-center">
      <div className='New'>

        <h1>捷運即時到站資訊</h1>

        <Grid columns="3" gap="3" width="auto">
          <Box height="200">

          </Box>

          <Box height="200">
            <Grid columns="3" gap="3" width="auto">
              <Text>選擇車站：</Text>

              <Select.Root onValueChange={handleStationChange} value={selectedStation} >
                <Select.Trigger placeholder="選擇車站" />
                <Select.Content >
                  <Select.Group>
                    <Select.Label>捷運站</Select.Label>
                    {stations.map((station, index) => (
                      <Select.Item key={index} value={station}>
                        {station}
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
              <Button onClick={fetchData}> 更新資料</Button>
            </Grid>
          </Box>

          <Box height="200">

          </Box>

          <Box height="200">
          </Box>

          <Box height="200">
            <Blockquote size="4">
              <Flex gap="2">
                <Badge color="red">即將進站</Badge>
                <Badge color="blue">尚未到站</Badge>
                <Badge color="green">離站</Badge>
              </Flex>
            </Blockquote>


            <Table.Root>
              <Table.Header>
                <Table.Row align="center">
                  <Table.ColumnHeaderCell align="center">列車編號</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="center">目的地</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="center">倒數時間</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body align="center">
                {data.map((item, index) => (
                  <tr key={index}>
                    <Table.RowHeaderCell >{item.TrainNumber}</Table.RowHeaderCell>
                    <Table.Cell>{item.DestinationName}</Table.Cell>
                    <Table.Cell>{item.CountDown}</Table.Cell>
                  </tr>
                ))}

              </Table.Body>
            </Table.Root>

          </Box>
          <Box height="200">



          </Box>
          <Box height="200">
          </Box>


          <Box height="200">
            {data.map((item, index) => (
              <Card asChild style={{ maxWidth: 350 }}>
                <a href="#">
                  <Text as="div" size="2" weight="bold">
                    往：{item.DestinationName}
                  </Text>
                  <Text as="div" color="gray" size="2">
                    {item.CountDown}
                  </Text>
                </a>
              </Card>

            ))}
          </Box>
        </Grid>



      </div>
    </div>
  );

}
export default App;
