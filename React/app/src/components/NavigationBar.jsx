import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useLocation } from "react-router-dom";


import logo from "/icons8-music-record-cute-color-32.png"

function NavigationBar() {

  return (
    <Container>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand >
            <Link to='/'>
              <img src={logo} alt="Logo" />
              {" "}
              SetLover</Link>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <NavDropdown disabled title="Playlist " id="NavigationBar-Playlist">
                <NavDropdown.Item href="#action3">Playlist 1</NavDropdown.Item>
                <NavDropdown.Item href="#action4">Playlist 2</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">Create New Playlist</NavDropdown.Item>
              </NavDropdown>

              <Nav.Link href="#Setting" disabled>Settings</Nav.Link>


            </Nav>
            <Nav>
              <Nav.Link ><Link to='/login'>Login</Link></Nav.Link>
              <Nav.Link ><Link to='/signup'>Signup</Link></Nav.Link>
              {/* <Nav.Link href="/signup">Sign up</Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Container>
  );
}

export default NavigationBar;