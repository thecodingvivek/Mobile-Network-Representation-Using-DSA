import React from 'react'

const LoadPage = (props) => {
  return (
    <div className='w-screen h-screen bg-black flex items-center justify-center fixed top-0 left-0 z-[1000]'>
        <div className='w-[400px] bg-black border border-gray-950 rounded-xl px-5 py-10 flex flex-col gap-1'>
            <span className='text-white font-semibold text-[12px]'>{props.name}</span>
            <input type='text' className='w-full  px-2 py-1  border' onChange={(e)=>{props.setname(e.target.value)}}></input>
            <button className='bg-white' onClick={()=>{props.setload(false);props.func()}}>submit</button>
        </div>
    </div>
  )
}

export default LoadPage