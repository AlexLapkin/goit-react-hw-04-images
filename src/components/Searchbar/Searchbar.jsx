import css from './Searchbar.module.css';
import PropTypes from 'prop-types';
import { useState } from 'react';

const Searchbar = ({ onSubmit }) => {
  const [searchWord, setSearchWord] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    onSubmit(searchWord);
  };

  const handleInputChange = event => {
    setSearchWord(event.currentTarget.value);
  };

  return (
    <header className={css.searchbar}>
      <form className={css.searchbar_form} onSubmit={handleSubmit}>
        <button type="submit" className={css.searchbar_btn}>
          <span className={css.button_label}>Search</span>
        </button>
        <input
          name="searchWord"
          value={searchWord}
          className={css.searchbar_input}
          type="text"
          autocomplete="off"
          autofocus
          placeholder="Search images and photos"
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func,
  searchWord: PropTypes.string,
};

export default Searchbar;
