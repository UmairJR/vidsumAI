import React from 'react'
import ThemeController from './ThemeController'
import Swap from './Swap'

const Navbar = () => {
  return (
    <div className="navbar bg-primary text-primary-content rounded-sm shadow-md">
  <div className="navbar-start">
    <a className="btn btn-ghost text-primary-content text-xl">VidSumAI</a>
  </div>
  <div className="navbar-end">
    {/* <ThemeController /> */}
    <Swap />
  </div>
</div>
  )
}

export default Navbar