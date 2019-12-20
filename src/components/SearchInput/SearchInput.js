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
    shouldAutoCompleteDisplay: PropTypes.bool,
    setAutoCompleteDisplay: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
  };

  onInputChange = e => {
    const { onKeywordChange, setAutoCompleteDisplay } = this.props;
    const keyword = e.target.value;

    onKeywordChange(keyword);

    setAutoCompleteDisplay(true);
  };

  onClick = autoCompleteItem => {
    const { onAutoCompleteItemClick, onClickHook, setAutoCompleteDisplay } = this.props;
    setAutoCompleteDisplay(false);

    onAutoCompleteItemClick(autoCompleteItem);

    if (onClickHook) {
      onClickHook();
    }
  };

  render() {
    const {
      inputClassName = '',
      autoCompleteListClassName = '',
      loading,
      suggestions,
      value,
      placeholder = '',
      floorStore: { floors, buildings },
      shouldAutoCompleteDisplay,
      onFocus,
    } = this.props;

    return (
      <div>
        <input
          type="text"
          className={inputClassName}
          onChange={this.onInputChange}
          value={value}
          placeholder={placeholder}
          onFocus={onFocus}
        />
        {shouldAutoCompleteDisplay && !loading && suggestions.length > 0 && (
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
