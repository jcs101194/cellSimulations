import React from 'react';
import Cell from './Cell.js'

class Canvas extends React.Component
{
	/*
		The way the canvas is going to be populated is the cell is
		defined in size, color, and other attributes. The canvas will
		create an array of these cells starting from the top left corner
		which will be the origin. 
		
		Nebulous ideas:
		
		-the cell will be defined in dimensions by pixels and not the size 
		of the canvas
	*/

	constructor(props)
	{
		super(props);
		//Note that this.state is a javascript object
		this.state =
		{
			cellLength: props.cellLength,
			cellColor: props.cellColor,
			windowLength: window.innerWidth,
			windowHeight: window.innerHeight,
			tick: 0,
			canvasColor: "#282c34",
			showGridLines: false,
			showCurrentCell: false
		};

		window.gridArray = this.initializeGrid(Math.floor(this.state.windowLength/this.state.cellLength));
		window.canvas = React.createRef();
		window.cellColor = this.state.cellColor;

		this.state.html = (<canvas style={{backgroundColor: "#282c34"}}
					   height="1000"
					   width='1800'
					   ref={window.canvas}>
				   </canvas>);	//<
	}
	mod(n, m)
	{
    		var remain = n % m;
        	return Math.floor(remain >= 0 ? remain : remain + m);	//<
        }
	handleStateChange(desiredCell, i, j)
	{
		//Precondition: desiredCell must be a cell object
		//Postcondition: return desiredState 0 | 1, never -1
		var height = window.canvasHeight;
		var width = window.canvasWidth;
		var numberOfLiveCells = 0;
		var answer = -1;

		if(this.state.showCurrentCell) this.highlightCell(desiredCell, "#E4F000");

		//debugger;
		for(var k = 0; k < 8; k++)
		{
			//Start with top-left cell; move clockwise
			switch(k)
			{
				case 0:
					if(window.gridArray[this.mod(i-1,height)][this.mod(j-1,width)].currentState === 1)
						numberOfLiveCells++;
				break;
				case 1:
					if(window.gridArray[this.mod(i,height)][this.mod(j-1,width)].currentState === 1)
						numberOfLiveCells++;
				break;
				case 2:
					if(window.gridArray[this.mod(i+1,height)][this.mod(j-1,width)].currentState === 1)
						numberOfLiveCells++;
				break;
				case 3:
					if(window.gridArray[this.mod(i+1,height)][this.mod(j,width)].currentState === 1)
						numberOfLiveCells++;
				break;
				case 4:
					if(window.gridArray[this.mod(i+1,height)][this.mod(j+1,width)].currentState === 1)
						numberOfLiveCells++;
				break;
				case 5:
					if(window.gridArray[this.mod(i,height)][this.mod(j+1,width)].currentState === 1)
						numberOfLiveCells++;
				break;
				case 6:
					if(window.gridArray[this.mod(i-1,height)][this.mod(j+1,width)].currentState === 1)
						numberOfLiveCells++;
				break;
				case 7:
					if(window.gridArray[this.mod(i-1,height)][this.mod(j,width)].currentState === 1)
						numberOfLiveCells++;
				break;
				default: break;
			}
		}

		if(desiredCell.currentState === 1)
		{
			if(2 <= numberOfLiveCells && numberOfLiveCells <= 3) answer = 1;
			else answer = 0;
		}
		else
		{
			if(numberOfLiveCells === 3) answer = 1;
			else answer = 0;
		}

		//Revert back cell to it's intended color, if changed
		if(this.state.showCurrentCell) this.highlightCell(desiredCell, (desiredCell.currentState === 1) ? this.state.cellColor:this.state.canvasColor);

		return answer;
	}
	colorCell(desiredCell)
	{
		//Precondition: this function is used to color the cell to it's needed state
		if(desiredCell.currentState == 1)
		{
			//Color the cell
			window.ctx.fillStyle = this.state.cellColor;
			window.ctx.fillRect(desiredCell.x, desiredCell.y, this.state.cellLength, this.state.cellLength);
		}
		else
		{
			//Erase the cell 
			window.ctx.fillStyle = this.state.canvasColor;
			window.ctx.fillRect(desiredCell.x, desiredCell.y, this.state.cellLength, this.state.cellLength);
		}

		if(this.state.showGridLines) window.ctx.stroke();
	}
	highlightCell(desiredCell, desiredColor)
	{
		//Precondition: desiredColor must be a string of the hexadecimal
		window.ctx.fillStyle = desiredColor;
		window.ctx.fillRect(desiredCell.x, desiredCell.y, this.state.cellLength, this.state.cellLength);
		window.ctx.fillStyle = this.state.cellColor
	}
	updateGridArray()
	{
		/*
			Note: in [i][j], i is the column number, j is the row
		*/
		var height = window.canvasHeight;
		var width = window.canvasWidth;
		var currentCell;
		var cellLength = this.state.cellLength;

		//Determine next states
		for(var i = 0; i < height; i++)
			for(var j = 0; j < width; j++)
				window.gridArray[i][j].setNextState(this.handleStateChange(window.gridArray[i][j], i, j));



		//Update to currentState and color the canvas 
		for(var i = 0; i < height; i++)
			for(var j = 0; j < width; j++)
			{
				window.gridArray[i][j].updateState();
				this.colorCell(window.gridArray[i][j]);
			}

	}
	setCtxVariables()
	{
		window.ctx = window.canvas.current.getContext('2d');
		window.canvasWidth = window.gridArray[0].length;
		window.canvasHeight = window.gridArray.length;

	}
	drawInitialArray()
	{
		for(var i = 0; i < window.gridArray.length; i++)
			for(var j = 0; j < window.gridArray[0].length; j++)
				this.colorCell(window.gridArray[i][j]);
	}
	componentDidMount()
	{
		//Note: component will automatically call render when setState is called
		//to update the components state
		this.setCtxVariables();
		this.drawInitialArray();
		this.timer = setInterval(() =>	//<
		{
			//Render loop
			this.updateGridArray();
		}, 100);
	}
	cellGenerator(rate)
	{
		return Math.floor(Math.random()*100) < rate*100 ? 1:0;
	}
	initializeGrid(desiredLength)
	{
		var desiredGrid = [...Array(desiredLength)].map(e => Array(desiredLength)); //<
		var d = this.state.cellLength;
		for(var i = 0; i < desiredLength; i++)
			for(var j = 0; j < desiredLength; j++)
				desiredGrid[i][j] = new Cell(this.cellGenerator(.25),d*i,d*j);

		return desiredGrid;
	}
	render()
	{
		return this.state.html;
	}
}

export default Canvas;
