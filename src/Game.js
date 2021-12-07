import React from 'react';

class Cat extends React.Component {
    render() {
      return (
            <img alt="cat" src="/cat.png" style={{ 
                width:'100px', 
                position: 'absolute', 
                left: this.props.mouse.x, 
                top: this.props.mouse.y
            }} />
      );
    }
}

class Mouse extends React.Component {
    constructor(props) {
      super(props);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.state = { x: 0, y: 0 };
    }
  
    handleMouseMove(event) {
      this.setState({
        x: event.clientX,
        y: event.clientY
      });
    }
  
    render() {
      return (
        <div style={{ width: '100%', height: '100vh', position: 'absolute', top: '0', left: '0', backgroundColor:'black', zIndex:'4'}} onMouseMove={this.handleMouseMove}>
            {this.props.render(this.state)}
        </div>
      );
    }
}

class WindowSize extends React.Component{
    constructor(props) {
        super(props)
        this.state = { width: 0, height: 0 }
    }

    handleWindowResize = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight })
    }
    
    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize);
        this.setState({ width: window.innerWidth, height: window.innerHeight })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    render(){
        return (
            <>
                {this.props.render(this.state)}
            </>
        );
    }
}

const FoodRow = props => {
    return (
        <div style={{ 
            minWidth: '10px', minHeight: '10px', 
            backgroundColor: props.color, 
            zIndex: '5',
            position: 'absolute',
            top: props.top + 'px',
            left: props.left + 'px',
            borderRadius: '50%',
            cursor: 'pointer'
        }} />
    )
}

class Food extends React.Component {
    constructor(props) {
        super(props)
        this.state = { horizontal: 0, vertical: 0, width: props.window.width, height: props.window.height, markedFood: 0 }
    }

    /*
    * parçalar 100px'lik boşluklarla sıralanacak
    * github@ugurakcil
    */
    calculateArea = () => {
        const blocks = {
            horizontal: Math.floor(this.props.window.width / 100),
            vertical: Math.floor((this.props.window.height - 150) / 100)
        }
        this.selectSomeFoods(blocks)
        return blocks
    }

    randomMax = (max) => {
        return Math.floor(Math.random() * max + 1)
    }

    selectSomeFoods = (blocks) => {
        const max = blocks.horizontal * blocks.vertical
        this.setState({ markedFood: this.randomMax(max) })
    }

    onHandleOnClick = (e) => {
        return alert('You caught it!')
    }

    componentDidUpdate = (previousProps, previousState) => {
        if(previousProps.window.width !== this.props.window.width
         || previousProps.window.height !== this.props.window.height) {
            this.setState(this.calculateArea())
        }

        if(this.state.markedFood !== 0 && previousState.markedFood !== this.state.markedFood) {
            setTimeout(() => {
                this.selectSomeFoods({horizontal: this.state.horizontal, vertical: this.state.vertical})
            }, 1000)
        }
    }

    render(){
        let foodItems = []
        let countFoodKey = 1
        for (var verticalLoop = 1; verticalLoop <= this.state.vertical; verticalLoop++) {
            for (var horizontalLoop = 1; horizontalLoop <= this.state.horizontal; horizontalLoop++) {

                if(this.state.markedFood === 0 || this.state.markedFood !== countFoodKey) {

                    foodItems.push(<FoodRow key={countFoodKey} 
                        left={horizontalLoop*100-50} top={verticalLoop*100} color="green" />);
    
                } else {

                    foodItems.push(<div onClick={(e) => this.onHandleOnClick(e)}>
                        <FoodRow key={countFoodKey} left={horizontalLoop*100-50} top={verticalLoop*100} color="red" />
                    </div>);
    
                }

                countFoodKey++
            }
        }

        return (
        <>
            <div style={{position:"relative", marginTop:"80px"}}>
                {foodItems}
            </div>
        </>)
    }
}


class Game extends React.Component {
    render() {
      return (
        <div>
          <WindowSize render={window => (
              <>
                {window.width} - {window.height}
                <Food window={window} />
              </>
          )
          } />
          <Mouse render={mouse => (
            <>
                <h1 style={{color:"white", marginTop:"50px", textAlign:"center"}}>Catch red laser marks!</h1>
                <p style={{color:"white", textAlign:"center"}}>The mouse position is {mouse.x}, {mouse.y}</p>
                <Cat mouse={mouse} />
            </>
          )}/>
        </div>
      );
    }
}

export default Game