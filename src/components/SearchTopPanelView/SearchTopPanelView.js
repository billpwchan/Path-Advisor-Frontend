import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import style from './SearchTopPanelView.module.css';
import '../TopPanel/TopPanel.css';
import SearchInput from '../SearchInput/SearchInput';
import PopUpMenu from '../PopUpMenu/PopUpMenu';
import OverlayMessageBox from '../OverlayMessageBox/OverlayMessageBox';

const INPUT_DIRECTION = 'from';
const NEAREST_DIRECTION = 'to';

function makeButton({ image, onClick, label }) {
  return (
    <button type="button" className={style.button} onClick={onClick}>
      <img className={style.icon} src={image} alt={label} />
      <span className={style.text}>{label}</span>
    </button>
  );
}

makeButton.propTypes = {
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

class SearchTopPanelView extends Component {
  state = {
    shouldNearestPopUpDisplay: false,
    shouldFacilityPopUpDisplay: false,
    shouldAutoCompleteDisplay: false,
    shouldInputErrorDisplay: false,
  };

  componentDidUpdate(prevProps) {
    const { searchMapItemStore, onAutoCompleteItemClick, searchAreaInputStore } = this.props;
    if (
      prevProps.searchMapItemStore !== searchMapItemStore &&
      searchMapItemStore.suggestions.length
    ) {
      const [{ name, floor, coordinates, id }] = searchMapItemStore.suggestions;
      // Auto select the first suggestion as input before user click on it
      onAutoCompleteItemClick(INPUT_DIRECTION)({
        name,
        floor,
        coordinates,
        id,
        displayName: searchAreaInputStore[INPUT_DIRECTION].name,
      });
    }
  }

  setNearestPopUpDisplay = value => {
    this.setState({ shouldNearestPopUpDisplay: value });
  };

  setFacilityPopUpDisplay = value => {
    this.setState({ shouldFacilityPopUpDisplay: value });
  };

  setAutoCompleteDisplay = value => {
    this.setState({ shouldAutoCompleteDisplay: value });
  };

  setInputErrorDisplay = value => {
    this.setState({ shouldInputErrorDisplay: value });
  };

  fillInputField = value => {
    this.props.onKeywordChange(INPUT_DIRECTION)(value);
    this.setAutoCompleteDisplay(true);
  };

  clearInputField = direction => () => {
    this.props.onKeywordChange(direction)('');
  };

  checkInputAndShowNearestPopUp = () => {
    const { searchAreaInputStore, searchMapItemStore, onAutoCompleteItemClick } = this.props;

    if (!searchAreaInputStore[INPUT_DIRECTION].name) {
      this.setInputErrorDisplay(true);
      return;
    }

    const [{ name, floor, coordinates, id }] = searchMapItemStore.suggestions;
    // Mainly to update the input field display value if user hasn't complete their input before click search button where the first autocomplete item will be selected automatically
    onAutoCompleteItemClick(INPUT_DIRECTION)({
      name,
      floor,
      coordinates,
      id,
    });

    this.setAutoCompleteDisplay(false);
    this.setNearestPopUpDisplay(true);
  };

  searchNearest = async value => {
    const { onNearestItemClick, search } = this.props;

    await onNearestItemClick(NEAREST_DIRECTION)({
      data: { type: 'nearest', value },
    });
    search();
  };

  render() {
    console.log('SearchTopPanelView render');
    const {
      floorStore,
      searchMapItemStore,
      searchAreaInputStore,
      onKeywordChange,
      onAutoCompleteItemClick,
    } = this.props;

    const {
      shouldNearestPopUpDisplay,
      shouldFacilityPopUpDisplay,
      shouldAutoCompleteDisplay,
      shouldInputErrorDisplay,
    } = this.state;
    return (
      <>
        <button type="button" onClick={() => this.setFacilityPopUpDisplay(true)}>
          <img src="/images/mobile/search.png" className={style.search} alt="Search" />
        </button>
        <div className={style.inputArea}>
          <div className="topPanel__tabLeft" />
          <div className={classnames(style.inputAreaContent, 'topPanel__tabSpace')}>
            <SearchInput
              placeholder="Room No / Dept / Office Name"
              inputClassName={style.input}
              autoCompleteListClassName={style.autoCompleteList}
              suggestions={searchMapItemStore.suggestions}
              onKeywordChange={onKeywordChange(INPUT_DIRECTION)}
              loading={searchMapItemStore.loading}
              onAutoCompleteItemClick={onAutoCompleteItemClick(INPUT_DIRECTION)}
              value={searchAreaInputStore[INPUT_DIRECTION].name}
              floorStore={floorStore}
              shouldAutoCompleteDisplay={shouldAutoCompleteDisplay}
              setAutoCompleteDisplay={this.setAutoCompleteDisplay}
              onFocus={this.clearInputField(INPUT_DIRECTION)}
            />
          </div>
          <div className="topPanel__tabRight" />
        </div>
        <button type="button" onClick={this.checkInputAndShowNearestPopUp}>
          <div className="topPanel__tabLeft" />
          <div className={classnames('topPanel__tabSpace', style.pathSpace)} />
          <div className={style.pathIcon} />
          <div className={classnames('topPanel__tabSpace', style.pathSpace)} />
          <div className="topPanel__tabRight" />
        </button>
        {shouldNearestPopUpDisplay && (
          <PopUpMenu
            title="Nearest Facility"
            items={[
              makeButton({
                image: '/images/legends/lift.png',
                label: 'Lift',
                onClick: () => this.searchNearest('lift'),
              }),
              makeButton({
                image: '/images/legends/malewc.png',
                label: 'Male Toilet',
                onClick: () => this.searchNearest('male toilet'),
              }),
              makeButton({
                image: '/images/legends/femalewc.png',
                label: 'Female Toilet',
                onClick: () => this.searchNearest('female toilet'),
              }),
              makeButton({
                image: '/images/legends/fountain.png',
                label: 'Drinking Fountain',
                onClick: () => this.searchNearest('drinking fountain'),
              }),
            ]}
            onClose={() => this.setNearestPopUpDisplay(false)}
          />
        )}
        {shouldFacilityPopUpDisplay && (
          <PopUpMenu
            title="Campus Facility"
            items={[
              makeButton({
                image: '/images/legends/atm.png',
                label: 'ATM',
                onClick: () => this.fillInputField('ATM'),
              }),
              makeButton({
                image: '/images/legends/express.png',
                label: 'Express Station',
                onClick: () => this.fillInputField('Express Station'),
              }),
              makeButton({
                image: '/images/legends/lec.png',
                label: 'Lecture Theater',
                onClick: () => this.fillInputField('Lecture'),
              }),
              makeButton({
                image: '/images/legends/mail.png',
                label: 'Mailbox',
                onClick: () => this.fillInputField('Mailbox'),
              }),
              makeButton({
                image: '/images/legends/res.png',
                label: 'Restaurant',
                onClick: () => this.fillInputField('Restaurant'),
              }),
            ]}
            onClose={() => this.setFacilityPopUpDisplay(false)}
          />
        )}
        {shouldInputErrorDisplay && (
          <OverlayMessageBox onClose={() => this.setInputErrorDisplay(false)}>
            <div className={style.inputErrorMessage}>Please input a location</div>
          </OverlayMessageBox>
        )}
      </>
    );
  }
}

export default SearchTopPanelView;
