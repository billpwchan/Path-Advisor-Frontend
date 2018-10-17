import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SearchInput extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    suggestions: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        floor: PropTypes.string,
        coordinates: PropTypes.arrayOf(PropTypes.number),
        id: PropTypes.string,
      }),
    ).isRequired,
    floorStore: PropTypes.shape({}).isRequired,
    inputClassName: PropTypes.string,
    autoCompleteListClassName: PropTypes.string,
    onKeywordChange: PropTypes.func.isRequired,
    onAutoCompleteItemClick: PropTypes.func.isRequired,
    onClickHook: PropTypes.func,
    value: PropTypes.string,
    placeholder: PropTypes.string,
  };

  state = {
    hideAutoComplete: true,
  };

  onInputChange = e => {
    const { onKeywordChange } = this.props;
    const keyword = e.target.value;

    onKeywordChange(keyword);

    this.setState({
      hideAutoComplete: false,
    });
  };

  onClick = autoCompleteItem => {
    const { onAutoCompleteItemClick, onClickHook } = this.props;
    this.setState({
      hideAutoComplete: true,
    });

    onAutoCompleteItemClick(autoCompleteItem);

    if (onClickHook) {
      onClickHook();
    }
  };

  render() {
    const { hideAutoComplete } = this.state;
    const {
      inputClassName = '',
      autoCompleteListClassName = '',
      loading,
      suggestions,
      value,
      placeholder = '',
      floorStore: { floors, buildings },
    } = this.props;

    return (
      <div>
        <input
          type="text"
          className={inputClassName}
          onChange={this.onInputChange}
          value={value}
          placeholder={placeholder}
        />
        {!hideAutoComplete &&
          !loading && (
            <ul className={autoCompleteListClassName}>
              {suggestions.map(({ name, floor, coordinates, id }) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => this.onClick({ name, floor, coordinates, id })}
                  >
                    <span className="name">{name}</span>
                    <span className="location">
                      , {buildings[floors[floor].buildingId].name}, floor {floors[floor].name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
      </div>
    );
  }
}

export default SearchInput;
