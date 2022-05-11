import React from 'react';
import './App.css';
import Canvas from './Canvas.js';
import Hamburger from './hamburger.jpg';
import HamburgerIcon from './HamburgerIcon.js';

function App()
{
	return (
		<div>
			<HamburgerIcon/>
			<Canvas cellLength='10' cellColor='#cc00ff'/>
		</div>
	);
}

export default App;
