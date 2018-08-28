import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './SearchInput.module.css';

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
    onKeywordChange: PropTypes.func.isRequired,
    onAutoCompleteItemClick: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  };

  state = {
    hideAutoComplete: true,
  };

  componentWillReceiveProps(nextProps) {
    const { loading } = this.props;
    // auto complete loading done, show the auto complete suggestions
    if (!nextProps.loading && loading) {
      this.setState({
        hideAutoComplete: false,
      });
    }
  }

  onClick = autoCompleteItem => {
    const { onAutoCompleteItemClick } = this.props;
    this.setState({
      hideAutoComplete: true,
    });

    onAutoCompleteItemClick(autoCompleteItem);
  };

  render() {
    const { hideAutoComplete } = this.state;
    const { suggestions, onKeywordChange, value } = this.props;

    return (
      <div>
        <input type="text" className={style.input} onChange={onKeywordChange} value={value} />
        <ul className={style.autoCompleteList}>
          {!hideAutoComplete &&
            suggestions.map(({ name, floor, coordinates, id }) => (
              <li key={id} className={style.autoCompleteListItem}>
                <button
                  type="button"
                  onClick={() => this.onClick({ name, floor, coordinates, id })}
                >
                  <span className={style.autoCompleteListItemName}>{name}</span>
                  <span className={style.autoCompleteListItemLocation}>
                    , Building, Floor {floor}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}

export default SearchInput;
