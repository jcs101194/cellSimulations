class Cell
{
	//this.color is a hex value
	constructor(currentState,x,y)
	{
		this.currentState = currentState;
		this.nextState = -1;
		this.color = "#7400FF";
		this.x = x;
		this.y = y;
	}
	constructor1(currentState,x,y,desiredColor)
	{
		this.currentState = currentState;
		this.nextState = -1;
		this.color = desiredColor;
		this.x = x;
		this.y = y;
	}
	setNextState(desiredState)
	{
		this.nextState = desiredState;
	}
	updateState()
	{
		this.currentState = this.nextState;
	}
}

export default Cell;
