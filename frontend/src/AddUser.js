import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import MapperContext from './MapContext';

const AddUser = () => { 

  const mapper = useContext(MapperContext);
  const [number, setNumber] = useState('');
  useEffect(() => {
    if(number.length!=10)
    {
      document.getElementsByClassName("adduserinp")[0].style.borderColor="#dbb52c25";
      document.getElementsByClassName("adduserbtn")[0].disabled=true;
    }
    else{
      document.getElementsByClassName("adduserinp")[0].style.borderColor="green";
      document.getElementsByClassName("adduserbtn")[0].disabled=false;
    }
  }, [number]);
  return (
    <>
    <div className='w-full  p-2 py-3 flex flex-col'>
        <input onChange={(e)=>{setNumber(e.target.value)}} type='text' className='adduserinp w-full px-2 py-[5px] bg-black text-[12px] text-white border-[0.8px] border-[#ffffff30] rounded outline-none mt-1 transition-all duration-150 ease-in' placeholder='enter number'></input>
        <button onClick={()=>{
          mapper.addUser(number);
        }}  className='adduserbtn w-full h-[30px] bg-white text-black text-[10px] rounded-lg font-semibold mt-2'>Add User</button>
    </div>
    </>
  )
}

export default AddUser