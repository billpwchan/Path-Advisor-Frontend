import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Suggestion.module.css';
import SuggestionForm from './SuggestionForm';
import postSuggestion from '../../sagas/requests/postSuggestion';
import { TABS } from './constants';

class Suggestion extends Component {
  state = {
    sumbitting: false,
    success: false,
    failure: false,
    values: {
      name: '',
      email: '',
      description: '',
      type: null,
    },
  };

  onInputChange = key => e => {
    const value = e.target.value;
    this.setState(state => ({
      values: {
        ...state.values,
        [key]: value,
      },
    }));
  };

  onSubmit = async () => {
    const { floor, x, y, tab } = this.props;
    const { values } = this.state;
    try {
      this.setState({
        sumbitting: true,
        success: false,
        failure: false,
      });

      await postSuggestion({
        ...(tab === TABS.LOCATION ? { coordinates: `${x},${y}`, floorId: floor } : {}),
        type: tab === TABS.LOCATION ? values.type : tab,
        name: values.name.trim() || undefined,
        email: values.email.trim() || undefined,
        description: values.description.trim() || undefined,
      });

      this.setState({
        sumbitting: false,
        success: true,
        failure: false,
      });
    } catch (err) {
      this.setState({
        sumbitting: false,
        success: false,
        failure: true,
      });
    }
  };

  render() {
    const { values, success, failure, sumbitting } = this.state;
    const { tab, x, y, floor, linkTo } = this.props;

    if (success) {
      return (
        <div className={styles.body}>
          <h1>Suggestions</h1>
          <div className={styles.message}>Thanks for your feedback</div>
        </div>
      );
    }

    const position = tab === TABS.LOCATION ? `Floor ${floor} at (${x},${y})` : null;
    switch (tab) {
      case TABS.LOCATION:
      case TABS.BUG:
      case TABS.GENERAL:
        return (
          <div className={styles.body}>
            <h1>Suggestions</h1>
            <SuggestionForm
              tab={tab}
              onInputChange={this.onInputChange}
              position={position}
              values={values}
              failure={failure}
              sumbitting={sumbitting}
              onSubmit={this.onSubmit}
            />
          </div>
        );
      case TABS.INDEX:
      default:
        return (
          <div className={styles.body}>
            <h1>Suggestions</h1>
            <ul>
              <li>
                Reports wrong or suggestions missing information
                <ul>
                  <li>
                    Locate the position on the map, and then right click, choose
                    {'"Suggest a location here"'}.
                  </li>
                </ul>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    linkTo({ suggestion: TABS.BUG });
                  }}
                >
                  Report a bug
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    linkTo({ suggestion: TABS.GENERAL });
                  }}
                >
                  Other suggestions
                </button>
              </li>
            </ul>
          </div>
        );
    }
  }
}

Suggestion.propTypes = {
  tab: PropTypes.oneOf(Object.values(TABS)).isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
  floor: PropTypes.string,
  linkTo: PropTypes.func.isRequired,
};

export default Suggestion;
