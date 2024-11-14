import React, { useContext, useEffect } from 'react';
import MapperContext from './MapContext';
import LoadPage from './LoadPage';
import { useState } from 'react';
const NavBar = (props) => {
  const mapper = useContext(MapperContext);
  const [load,setLoad]=useState(false);
  const [call,setCall]=useState(false);
  const [network,setNetwork]=useState(null);

  const handleOptionClick = (n) => {
        if(n==1)
        {
            mapper.cursorCoverage();
        }
        else if(n==2)
        {
            setLoad(true);
        }
        else if(n==3)
        {
            setCall(true);
        }
  }

  const adduser = ()=>{
    mapper.addUser();
    props.socket.send(JSON.stringify(
        {
            'action': 'register_user',
            'msc': mapper.network.msc.data,
            'number': network
        }
    ));
  }

  const calluser = ()=>{
    props.socket.send(JSON.stringify(
        {
            'action': 'call_user',
            'number': network
        }
    ));
  }


  return (
    <>
        {
            load&&
            <LoadPage setload={setLoad} setname={setNetwork} initmap={adduser} />

        }
        {
            call&&
            <LoadPage setload={setCall} setname={setNetwork} initmap={calluser} />

        }
        <div className='navbar w-[250px] h-[50px] bg-[#000000FF] border border-[#1C1C1EFF] absolute top-[10px] left-[10px] rounded-[16px] flex p-2 gap-2'>
            <div className='op w-fit h-full bg-[#023d8a53] rounded-full p-1 px-2 flex items-center gap-1 overflow-hidden' onClick={()=>handleOptionClick(0)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="#0096c7"><path d="M440-42v-80q-125-14-214.5-103.5T122-440H42v-80h80q14-125 103.5-214.5T440-838v-80h80v80q125 14 214.5 103.5T838-520h80v80h-80q-14 125-103.5 214.5T520-122v80h-80Zm40-158q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-120q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm0-80Z"/></svg>
                <span className='text-[#0096c7] font-normal text-[10px]'>co ordinates</span>
            </div>
            <div className='op aspect-square h-full rounded-full flex items-center justify-center bg-black hover:bg-[#40916d44]' onClick={()=>handleOptionClick(1)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="#40916c" ><path d="M196-276q-57-60-86.5-133T80-560q0-78 29.5-151T196-844l48 48q-48 48-72 110.5T148-560q0 63 24 125.5T244-324l-48 48Zm96-96q-39-39-59.5-88T212-560q0-51 20.5-100t59.5-88l48 48q-30 27-45 64t-15 76q0 36 15 73t45 67l-48 48ZM280-80l135-405q-16-14-25.5-33t-9.5-42q0-42 29-71t71-29q42 0 71 29t29 71q0 23-9.5 42T545-485L680-80h-80l-26-80H387l-27 80h-80Zm133-160h134l-67-200-67 200Zm255-132-48-48q30-27 45-64t15-76q0-36-15-73t-45-67l48-48q39 39 58 88t22 100q0 51-20.5 100T668-372Zm96 96-48-48q48-48 72-110.5T812-560q0-63-24-125.5T716-796l48-48q57 60 86.5 133T880-560q0 78-28 151t-88 133Z"/></svg>
                <span className='text-[#0096c7] font-normal text-[10px] hidden'>co ordinates</span>
            </div>
            <div className='op aspect-square h-full  rounded-full flex items-center justify-center bg-black hover:bg-[#dbb52c25]' onClick={()=>handleOptionClick(2)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="#dbb42c"><path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Z"/></svg>
                <span className='text-[#0096c7] font-normal text-[10px] hidden'>co ordinates</span>

            </div>
            <div className='aspect-square h-full  rounded-full flex items-center justify-center ml-auto' onClick={()=>handleOptionClick(3)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
            </div>
        </div>
    </>
  )
}

export default NavBar