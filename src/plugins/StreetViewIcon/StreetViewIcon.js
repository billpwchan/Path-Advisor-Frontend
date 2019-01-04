import React from 'react';
import classnames from 'classnames';

import style from './StreetViewIcon.module.css';
import availImage from "./img/Man_for_available.png";
import mouseoverImage from "./img/Man_for_mouseover.png";
import outsideImage from "./img/Man_already_outside.png";


const STREET_VIEW_ICON_ID = 'STREET_VIEW_ICON';

class StreetViewIcon extends React.Component {
constructor(props){
    super(props);
    this.state = {
        srcImage : availImage,
        manOut : false,
    };
}
handleClick(){
    let img = outsideImage;
    this.setState({
        srcImage:img,
        manOut:true,
    });
}
handleMouseOver(){
    let manOut = this.state.manOut;
    let img = manOut? outsideImage:mouseoverImage;
    this.setState({
        srcImage: img,
        manOut:manOut
    });
}
handleMouseOut(){
    let manOut = this.state.manOut;
    let img = manOut? outsideImage:availImage;
    this.setState({
        srcImage: img,
        manOut:manOut,
    });
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
    <div className={style.body}>
      <button
       type="button"   
       onClick={()=>this.handleClick()}
       onMouseOver={()=>this.handleMouseOver()}
       onMouseOut={()=>this.handleMouseOut()}
      >
      <img className={classnames(buttonClassName)} src ={image} alt="StreetViewIcon"/>
      </button>
    </div>
  );

  
}
}
const MapCanvasPlugin = {
  Component: StreetViewIcon,
  connect: ['platform'],
};

const id = 'StreetViewIcon';
export { id, MapCanvasPlugin };
