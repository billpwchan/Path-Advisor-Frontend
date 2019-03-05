import React, { Component } from 'react';
import infoImage from './info.png';
import style from './LegendButton.module.css';
import FullScreenOverlay from '../../components/FullScreenOverlay/FullScreenOverlay';

class LegendButton extends Component {
  state = { shouldLengendPopUpDisplay: false };

  setLengendPopUpDisplay = value => () => {
    this.setState({ shouldLengendPopUpDisplay: value });
  };

  render() {
    const {
      legendStore: { legends, legendIds },
    } = this.props;
    return (
      <>
        {this.state.shouldLengendPopUpDisplay && (
          <FullScreenOverlay onBodyClick={this.setLengendPopUpDisplay(false)} center>
            <div className={style.body}>
              <div className={style.header}>Legends</div>
              <div className={style.content}>
                <ul className={style.legendList}>
                  {legendIds.map(id => {
                    const { name, image } = legends[id];
                    return (
                      <li key={id}>
                        <img className={style.image} src={image} alt={name} />
                        <span className={style.text}>{name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </FullScreenOverlay>
        )}
        <button className={style.button} type="button" onClick={this.setLengendPopUpDisplay(true)}>
          <img className={style.buttonImage} src={infoImage} alt="Legend Info" />
        </button>
      </>
    );
  }
}

const MapCanvasPlugin = {
  Component: LegendButton,
  connect: ['legendStore'],
  platform: ['MOBILE'],
};

const id = 'legendButton';
export { id, MapCanvasPlugin };
