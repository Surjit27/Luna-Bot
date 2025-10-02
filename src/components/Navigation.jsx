import React from 'react'
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'
import { useNavigate, useLocation } from 'react-router-dom'

function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Navbar color="dark" dark expand="md" className="mb-4">
      <div className="container">
        <NavbarBrand href="#" className="fw-bold">
          🤖 Interview Bot
        </NavbarBrand>
        <Nav className="ms-auto" navbar>
          <NavItem>
            <NavLink 
              href="#" 
              className={location.pathname === '/' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault()
                navigate('/')
              }}
            >
              Interview
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              href="#" 
              className={location.pathname === '/dashboard' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault()
                navigate('/dashboard')
              }}
            >
              Dashboard
            </NavLink>
          </NavItem>
        </Nav>
      </div>
    </Navbar>
  )
}

export default Navigation
