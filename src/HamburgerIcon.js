import React from 'react';
import Hamburger from './hamburger.jpg';
import HamburgerGray from './hamburger1.jpg';

class HamburgerIcon extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {};
		window.hamburger = React.createRef();
		this.state.hamburgerStyle =
		{
			position: 'absolute',
			left: '20px',
			top: '40px',
		};
	}
	openClose()
	{

	}
	highlight()
	{
		console.log("highlight called");
		if(window.hamburger.style.visibility === 'visible' ||
		   window.hamburger.style.visibility === '')
			window.hamburger.style.visibility = 'hidden';

	}
	unhighlight()
	{
		console.log("unhighlight called");
		if(window.hamburger.style.visibility === 'hidden')
			window.hamburger.style.visibility = 'visible';
	}
	componentDidMount()
	{
		window.hamburger = document.getElementById('hamburger');
	}
	render()
	{
		return (<div>
			<img 
				src={Hamburger}
				style={this.state.hamburgerStyle}
				width= '140px'
				height= '140px'/>
			<img 
				id='hamburger'
				src={HamburgerGray}
				style={this.state.hamburgerStyle}
				onClick={this.openClose}
				onMouseEnter={this.highlight}
				onMouseLeave={this.unhighlight}
				ref={window.hamburger}
				width= '140px'
				height='140px'/>
			</div>
			);
	}
}

export default HamburgerIcon;
