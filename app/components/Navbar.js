

import Link from 'next/link'
import React from 'react'

export const Navbar = () => {
  return (
      <div className='w-full h-auto border-solid flex py-7 px-25'>
          <div className='bg-amber-800'></div>
          <div className='rightside'> 
              <Link /> signup
            <Link /> login
          </div>
      
    </div>
  )
}


