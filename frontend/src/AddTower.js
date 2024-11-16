import React from 'react';
import { useContext } from 'react';
import { useState,useEffect } from 'react';
import MapperContext from './MapContext';

const AddTower = () => {

    const mapper = useContext(MapperContext);
    const [name, setName] = useState('');
    const [height, setHeight] = useState(0);
    useEffect(() => {
      let k=0;
      if(name.length>0 )
      {
        k++;
        document.getElementsByClassName("addtowerinp")[0].style.borderColor="green";
      }
      else{
        document.getElementsByClassName("addtowerinp")[0].style.borderColor="#dbb52c25";
      }

      if(height>0)
      {
        k++;
        document.getElementsByClassName("addhtinp")[0].style.borderColor="green"; 
      }
      else
      {
        document.getElementsByClassName("addhtinp")[0].style.borderColor="#dbb52c25"; 
      }
      if(k==2)
      {
        document.getElementsByClassName("addtowerbtn")[0].disabled=false;
      }
      else{
        document.getElementsByClassName("addtowerbtn")[0].disabled=true;
      }
    }, [name,height]);


    return (
      <>
      <div className='w-full  p-2 py-3 flex flex-col'>
          <input onChange={(e)=>{setName(e.target.value)}} type='text' className='addtowerinp w-full px-2 py-[5px] bg-black text-[12px] text-white border-[0.8px] border-[#ffffff30] rounded outline-none mt-1 transition-all duration-150 ease-in' placeholder='enter tower name'></input>
          <input onChange={(e)=>{setHeight(e.target.value)}} type='text' className='addhtinp w-full px-2 py-[5px] bg-black text-[12px] text-white border-[0.8px] border-[#ffffff30] rounded outline-none mt-1 transition-all duration-150 ease-in' placeholder='enter tower height'></input>
          <button onClick={()=>{
            mapper.cursorCoverage(name,height);
          }}  className='addtowerbtn w-full h-[30px] bg-white text-black text-[10px] rounded-lg font-semibold mt-2'>Add Tower</button>
      </div>
      </>
    )
}

export default AddTower