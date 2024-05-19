import React from 'react'
import '../App.css'
import { Link } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <div className='Sidebar'>
      <ul>
        <li><Link to="/"  className='Sidebar-list'>Home</Link></li>
        <li><Link to="/add-scenario" className='Sidebar-list'>Add Scenario</Link></li>
        <li><Link to="/all-scenarios" className='Sidebar-list'>All Scenarios</Link></li>
        <li><Link to="/add-vehicle" className='Sidebar-list'>Add Vehicle</Link></li>
      </ul>
    </div>
  )
}
