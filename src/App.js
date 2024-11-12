import { useEffect, useState } from 'react';
import './App.css';
import Mapper from './map';
import NavBar from './NavBar';
import MapperContext from './MapContext';


function App() {

  const [mapper,setMapper]=useState(new Mapper("tanuku"));
  const [windowsize,setWindowsize]=useState({
    width:window.innerWidth,
    height:window.innerHeight
  });

  useEffect(()=>{
    mapper.initMapper("tanuku");

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
