import React from 'react';
import classnames from 'classnames';

import availImage from "./img/Man_for_available.png";
import mouseoverImage from "./img/Man_for_mouseover.png";
import outsideImage from "./img/Man_already_outside.png";

class BaseMan extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            srcImage : availImage,
            manOut : false,
        };
    
    }    
    handlePress(e){
    
        let img = outsideImage;
        this.setState({
            srcImage:img,
            manOut:true,
            displayDragMan:true,
        });
     
    }
    handleMouseOver(){
    
        let img =mouseoverImage;
        this.setState({
            srcImage: img,
        });
    }
    handleMouseOut(){
       
        let img = outsideImage;
        this.setState({
            srcImage: img,    
        });
    }
    renderDragMan(buttonClassName){
        let display = this.state.displayDragMan?"block":"none";
    
           return <DragMan 
                    display = {display}
                    buttonClassName={buttonClassName}
                    initialX={this.state.dragManX}
                    initialY={this.state.dragManY}
                    onMouseUp = {()=>this.handleDrop()}
                    />
    }
    render(){
    
    console.log('Street View Icon rendered');
    const platform  = this.props.platform;
    const buttonClassName = classnames({
        [style.buttonImage]: platform !== 'MOBILE',
        [style.buttonImageMobile]: platform === 'MOBILE',
    });
    
    const image = this.state.srcImage;
    
    return (
        <div>      
          <button 
           className={classnames(style.body)}
           type="button"   
           id={id}
           onMouseDown={(e)=>this.handlePress(e)}
           onMouseOver={()=>this.handleMouseOver()}
           onMouseOut={()=>this.handleMouseOut()}
          >
          <img className={classnames(buttonClassName)} src ={image} alt="StreetViewIcon"/>
          </button>
         
          {   
           this.renderDragMan(buttonClassName)
          }
        
        </div>
        
      );
    
      
    }
    }
    