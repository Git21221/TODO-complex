import React from 'react'

function Message({value, type}) {
  if(type== 'success') return (
    <div className='z-20 absolute top-20 right-10 bg-green-100 text-emerald-500 rounded-lg p-4 border-b-2 border-b-green-500'>{value}</div>
  );
  return (
    <div className='z-20 absolute top-20 right-10 bg-red-100 text-red-500 rounded-lg p-4 border-b-2 border-b-red-500'>{value}</div>
  )
}

export default Message