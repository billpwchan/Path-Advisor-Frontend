import React, { PropTypes, Component } from 'react'

// function ImageLocalizationPrimaryPanel({from}) {
//     const { data: { coordinates: [x, y] = [null, null], floor = null } = {} } = from;

//     return <h1> Hello World </h1>;
// }

// function ImageLocalizationOverlayHeader() {
//     return <h1> Hello Overlay Header </h1>;
// }

// function ImageLocalizationOverlayContent() {
//     return <h2> Hello Overlay Content </h2>;
// }
// const PrimaryPanelPlugin = { Component: ImageLocalizationPrimaryPanel, connect: ['from'] };

// const OverlayHeaderPlugin = { Component: ImageLocalizationOverlayHeader, connect: [] };
// const OverlayContentPlugin = { Component: ImageLocalizationOverlayContent, connect: [] };

// const id = "helloWorld";
// const name = "Hello World";
// const defaultOff = true;

// export { id, name, defaultOff, PrimaryPanelPlugin };

function buildFileSelector(){
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('multiple', 'multiple');
    return fileSelector;
  }

class ImageLocalization extends Component {
    componentDidMount(){
        this.fileSelector = buildFileSelector();
      }
      
      handleFileSelect = (e) => {
        e.preventDefault();
        this.fileSelector.click();
      }
      
      render(){
        return <a className="button" href="" onClick={this.handleFileSelect}>Select files</a>
      }
}

const PrimaryPanelPlugin = {
    Component: ImageLocalization,
    connect: [
        'from'
    ],
};

const id = 'imageLocalization';
const core = true;

export { id, core, PrimaryPanelPlugin };
