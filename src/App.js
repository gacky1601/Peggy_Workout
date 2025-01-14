import './App.css';
import { Card, Text, Button, Grid } from '@radix-ui/themes';
import React, { useState } from 'react';
import { BrandHeader } from './Header.js';
import Metro from './metro';
import Bus from './bus';

function App() {
  const [Mode, setMode] = useState(localStorage.getItem('mode') || [false]);

  return (
    <div className="App h-screen flex flex-col">

      <header className="fixed top-0 w-full bg-white shadow-lg z-10">
        <Grid gap="4" className="grid-full">
          <BrandHeader />
        </Grid>

      </header>

      {/* 主內容部分 */}
      <div className="flex-grow mt-16 mb-16"> {/* 預留 header 和 footer 的高度 */}
        <Grid gap="4" className="grid-full">
          {Mode ? <Metro /> : <Bus />}
        </Grid>
      </div>

      {/* Footer 固定在底部 */}
      <footer className="fixed bottom-0 w-full bg-white shadow-lg z-10">
        <Grid columns="2" gap="2" className="grid-80-center">
          <Button onClick={() => setMode(true)} variant={Mode ? "surface" : "soft"} color='Teal'>Metro</Button>
          <Button onClick={() => setMode(false)} variant={!Mode ? "surface" : "soft"} color='ruby'>Bus</Button>
        </Grid>
      </footer>
    </div>
  );
}

export default App;
