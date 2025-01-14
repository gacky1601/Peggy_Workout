import './App.css';
import { Card, Text, Button, Grid, Blockquote, Flex, Box, Badge, Callout } from '@radix-ui/themes';
import React, { useState, useEffect } from 'react';
import { BrandHeader } from './Header.js';
import Metro from './metro';
import Bus from './bus';
const api_url = "https://peggy-backend-7kg3x2vbyq-de.a.run.app/"

function App() {
  const [Mode, setMode] = useState(localStorage.getItem('mode')||[false]);

  return (
    <div className="App h-screen flex justify-center items-center">
      <div className='New'>
        <Grid gap="4" className="grid-full">
          <BrandHeader></BrandHeader>
          <Grid columns="2" gap="2" className="grid-80-center">
          <Button onClick={() => setMode(false)} variant={ Mode? "outline" : "classic"} color='Teal'>Metro</Button>
          <Button onClick={() => setMode(true)} variant={ !Mode? "outline" : "classic"} color='ruby'>Bus</Button>
          </Grid>
          {Mode?<Metro></Metro>:<Bus></Bus>}
          {/* <Metro></Metro> */}
          {/* <Bus></Bus> */}
        </Grid>
      </div>
    </div>
  );


}
export default App;
