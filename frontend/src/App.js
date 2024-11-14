import { useEffect, useState } from 'react';
import './App.css';
import Mapper from './map';
import NavBar from './NavBar';
import MapperContext from './MapContext';
import LoadPage from './LoadPage';


function App() {

  const [mapper,setMapper]=useState(new Mapper("tanuku"));
  const [socket,setSocket]=useState(null);
  const [load,setLoad]=useState(true);
  const [network,setNetwork]=useState(null);

  const InitPage=()=>{
    mapper.initMapper(network);
    console.log(mapper.network.msc.data);
    setSocket(new WebSocket(`ws://127.0.0.1:8000/ws/socket-server/?msc=${mapper.network.msc.data}`));
    console.log("Socket created");
  }


  useEffect(()=>{
    if(socket!==null)
    {
      socket.onopen = () => {
        console.log("WebSocket is open now.");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if(data.action==='add_user')
        {
          mapper.addUser(data);
        }
        console.log("Received message:", data);
      };

      socket.onclose = () => {
        console.log("WebSocket is closed now.");
      };

      socket.onerror = (error) => {
        console.log("WebSocket error:", error);
      };
    }
  }, [socket]);


  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.log("WebSocket is not open. Ready state is:", socket.readyState);
    }
  };

  return (
    <MapperContext.Provider value={mapper}>
      {
        load&&
        <LoadPage setload={setLoad} setname={setNetwork} initmap={InitPage} />
      }
      <div className="main w-fit h-fit bg-black">
        <NavBar socket={socket} />
        <canvas width={window.innerWidth} height={window.innerHeight} id={'canv'}>
        </canvas>
        <div className='cursor_coverage' onClick={(e)=>{mapper.addTower(e)}}>
        </div>
      </div>
    </MapperContext.Provider>
  );
}

export default App;
