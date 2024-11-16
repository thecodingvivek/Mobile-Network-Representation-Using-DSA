import React, { useContext, useEffect, useState } from 'react';
import MapperContext from './MapContext';

const MakeCall = () => {

    const mapper = useContext(MapperContext);

    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    useEffect(() => {
      let k=0;
      if(from.length==10 )
      {
        k++;
        document.getElementsByClassName("fromuser")[0].style.borderColor="green";
      }
      else{
        document.getElementsByClassName("fromuser")[0].style.borderColor="#dbb52c25";
      }

      if(to==10)
      {
        k++;
        document.getElementsByClassName("touser")[0].style.borderColor="green"; 
      }
      else
      {
        document.getElementsByClassName("touser")[0].style.borderColor="#dbb52c25"; 
      }
      if(k==2)
      {
        document.getElementsByClassName("callbtn")[0].disabled=false;
      }
      else{
        document.getElementsByClassName("callbtn")[0].disabled=true;
      }
    }, [to,from]);


    return (
      <>
      <div className='w-full  p-2 py-3 flex flex-col'>
          <input onChange={(e)=>{setFrom(e.target.value)}} type='text' className='fromuser w-full px-2 py-[5px] bg-black text-[12px] text-white border-[0.8px] border-[#ffffff30] rounded outline-none mt-1 transition-all duration-150 ease-in' placeholder='enter from user number'></input>
          <input onChange={(e)=>{setTo(e.target.value)}} type='text' className='touser w-full px-2 py-[5px] bg-black text-[12px] text-white border-[0.8px] border-[#ffffff30] rounded outline-none mt-1 transition-all duration-150 ease-in' placeholder='enter from to number'></input>
          <button onClick={()=>{
          }}  className='callbtn w-full h-[30px] bg-white text-black text-[10px] rounded-lg font-semibold mt-2'>Call user</button>
      </div>
      </>
    )
}

export default MakeCall