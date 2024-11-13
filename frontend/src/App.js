import { useEffect, useState } from 'react';
import './App.css';
import Mapper from './map';
import NavBar from './NavBar';
import MapperContext from './MapContext';


function App() {

  const [mapper,setMapper]=useState(new Mapper("tanuku"));
  const [socket,setSocket]=useState(null);

  useEffect(()=>{
    mapper.initMapper("tanuku");
    console.log(mapper.network.msc.data);
    setSocket(new WebSocket(`ws://127.0.0.1:8000/ws/socket-server/?msc=${mapper.network.msc.data}`));
    console.log("Socket created");
  },[]);
  


  return (
    <MapperContext.Provider value={mapper}>
      <div className="main w-fit h-fit bg-black">
        <NavBar />
        <canvas width={window.innerWidth} height={window.innerHeight} id={'canv'}>
        </canvas>
        <div className='cursor_coverage' onClick={(e)=>{mapper.addTower(e)}}>
        </div>
      </div>
    </MapperContext.Provider>
  );
}

export default App;
