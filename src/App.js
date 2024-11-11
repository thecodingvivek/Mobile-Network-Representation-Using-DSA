import { useEffect, useState } from 'react';
import './App.css';
import Mapper from './map';

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
    <div className="main w-fit h-fit bg-black">
      <canvas width={window.innerWidth} height={window.innerHeight} id={'canv'}>
      </canvas>
      <div className='cursor_coverage'>
      </div>
    </div>
  );
}

export default App;
