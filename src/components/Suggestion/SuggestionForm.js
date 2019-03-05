import React from 'react';
import PropTypes from 'prop-types';
import styles from './SuggestionForm.module.css';
import { TYPES, TABS } from './constants';

const SuggestionForm = ({
  tab,
  position = null,
  values,
  onSubmit,
  onInputChange,
  submitting,
  failure,
}) => (
  <div className={styles.body}>
    <div className={styles.row}>
      <div className={styles.label}>Name (optional)</div>
      <input type="text" onChange={onInputChange('name')} value={values.name} />
    </div>
    <div className={styles.row}>
      <div className={styles.label}>Email (optional)</div>
      <input type="text" onChange={onInputChange('email')} value={values.email} />
    </div>
    {position ? (
      <>
        <div className={styles.row}>
          <div className={styles.label}>Type</div>
          <div className={styles.radioRow}>
            <div>
              <input
                type="radio"
                name="type"
                value={TYPES.NEW}
                checked={values.type === TYPES.NEW}
                onChange={onInputChange('type')}
              />
              <div className={styles.radioLabel}>A new location</div>
            </div>
            <div className={styles.radioRow}>
              <input
                type="radio"
                name="type"
                value={TYPES.WRONG}
                onChange={onInputChange('type')}
                checked={values.type === TYPES.WRONG}
              />
              <div className={styles.radioLabel}>Wrong information </div>
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Position</div>
          <div>{position}</div>
        </div>
      </>
    ) : null}
    <div className={styles.row}>
      <div className={styles.label}>Description {tab === TABS.BUG ? ' of the bugs' : ''}</div>
      <textarea onChange={onInputChange('description')} value={values.description} />
    </div>
    {failure ? (
      <div className={styles.message}>
        Please make sure you fill in all required fields and your email are in correct format if
        filled in and try again.
      </div>
    ) : null}
    <input
      className={styles.submit}
      type="button"
      onClick={onSubmit}
      value={submitting ? 'Submitting...' : 'Submit'}
    />
  </div>
);

SuggestionForm.propTypes = {
  position: PropTypes.string,
  values: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    type: PropTypes.oneOf([TYPES.NEW, TYPES.WRONG]),
    description: PropTypes.string.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  tab: PropTypes.oneOf(Object.values(TABS)).isRequired,
  failure: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default SuggestionForm;
