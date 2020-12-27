import React, { PropTypes, Component } from 'react'
import style from './ImageLocalization.css';

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

function buildFileSelector() {
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('multiple', 'multiple');
  return fileSelector;
}

class ImageLocalization extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      imagePreviewUrl: ''
    }
  }

  componentDidMount() {
    this.fileSelector = buildFileSelector();
  }

  fileOnChangeHandler = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    console.log(file);
    this.setState({
      selectedFile: file,
      imagePreviewUrl: reader.result
    });

    reader.readAsDataURL(file);
  }

  uploadOnClickHandler = (e) => {
    // const data = new FormData()
    // data.append('file', this.state.selectedFile)
    e.preventDefault();
    console.log("handle uploading -", this.state.selectedFile);
  }

  fileName() {

  }

  render() {
    let { imagePreviewUrl } = this.state;
    let $fileName = null;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
      $fileName = imagePreviewUrl.file.name;
      console.log(imagePreviewUrl);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }
    return (
      <>
        <form class="form" >
          <div class="file-upload-wrapper" data-text={$fileName}>
            <input name="file-upload-field" type="file" class="file-upload-field" onChange={this.fileOnChangeHandler} accept="image/*" />
          </div>
          <button type="button" class="btn draw-border" onClick={this.uploadOnClickHandler}>Upload</button>
        </form>
        <div className="imgPreview">
          {$imagePreview}
        </div>
      </>
    )
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
