import React, { useState, useEffect } from 'react';
import { Card, Text, Button, Grid, TextField, Callout, IconButton, Box, Flex } from '@radix-ui/themes';
import { MagnifyingGlassIcon, InfoCircledIcon, UpdateIcon } from '@radix-ui/react-icons'
import { BrandHeader } from './Header.js';

import './App.css';
import { fetchBusData, fetchBusInfo } from './utils';



export function Bus() {
    const [Direction, setDirection] = useState([]);
    const [realtime_bus_data, setRealTimeBusData] = useState([]);

    const [busNumber, setBusNumber] = useState([579]);
    const [busDepart, setDepart] = useState([]);
    const [busDest, setDest] = useState([]);

    useEffect(() => {
        fetchBusData(579, setRealTimeBusData)
    }, []);



    useEffect(() => { }, [realtime_bus_data, Direction, busNumber, busDepart]);
    return (
        <div className="App h-screen flex justify-center items-center">
            {/* <div className='New'>
                <Grid gap="4" className="grid-full">
                    <BrandHeader></BrandHeader>
                </Grid>
            </div> */}
            <Grid gap="3">
                <Grid columns="3" gap="3" className="grid-80-center">
                    {/* <Button onClick={() => setDirection(0)}>往</Button>
                    <Button onClick={() => setDirection(1)}>返</Button> */}

                </Grid>

                <Grid columns="1" gap="3" className="grid-80-center">

                    <TextField.Root >
                        <TextField.Slot>
                            <MagnifyingGlassIcon height="16" width="16" />
                        </TextField.Slot>
                        <TextField.Input onChange={(key) => {
                            setBusNumber(key.target.value);
                        }} placeholder="Bus Number…" />
                        <TextField.Slot pr="3">
                            <IconButton size="2" variant="ghost"
                                onClick={() => {
                                    fetchBusData(busNumber, setRealTimeBusData);
                                    fetchBusInfo(busNumber, setDepart);
                                }}>
                                <MagnifyingGlassIcon></MagnifyingGlassIcon>
                            </IconButton>
                        </TextField.Slot>
                    </TextField.Root>


                </Grid>

                <Grid columns="1" gap="2" className="grid-80-center">



                    <Grid columns="1" gap="2" width="100%">
                            <Callout.Root size="1" color='green' >
                                <Callout.Icon>
                                    <InfoCircledIcon />
                                </Callout.Icon>
                                <Callout.Text>
                                    {busNumber}
                                </Callout.Text>
                            </Callout.Root>
                        
                            <Button onClick={() => fetchBusData(579, setRealTimeBusData)} style={{ alignSelf: "flex-end" }}>
                                <UpdateIcon />
                            </Button>
                        
                    </Grid>
                </Grid>


                <Grid columns="1" gap="3" className="grid-80-center">


                    <Text align={"left"}>往</Text>


                    <Grid columns="1" gap="2" className="grid-80-center">
                        {
                            [...realtime_bus_data]
                                .map((item, index) =>
                                    item.Direction === 0 &&
                                    (
                                        <Card key={index}>
                                            <Grid columns="2">
                                                <Text size="1" as="div">{item.StopName.Zh_tw}</Text>
                                                <Text size="1" as="div" align={"right"}>{item.EstimateTime ? (item.EstimateTime / 60).toFixed(1) : "末班駛離"}{item.EstimateTime ? "min" : ""}</Text>
                                            </Grid>
                                        </Card>
                                    )
                                )
                        }
                    </Grid>

                    <Text align={"left"}>返</Text>
                    {/* {busDest} */}


                    <Grid columns="1" gap="2" className="grid-80-center">
                        {
                            [...realtime_bus_data]
                                .map((item, index) =>
                                    item.Direction === 1 &&
                                    (
                                        <Card key={index}>
                                            <Grid columns="2">
                                                <Text size="1" as="div">{item.StopName.Zh_tw}</Text>
                                                <Text size="1" as="div" align={"right"}>{item.EstimateTime ? (item.EstimateTime / 60).toFixed(1) : "末班駛離"}{item.EstimateTime ? "min" : ""}</Text>
                                            </Grid>
                                        </Card>
                                    )
                                )
                        }
                    </Grid>
                </Grid>
            </Grid>

        </div >
    );
}

export default Bus;