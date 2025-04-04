import React from 'react';
import './Search.css'; 

const Search = ({ onSearch }) => {
  return (
    <input
      type="text"
      className='SearchInput'
      placeholder='Search by name, email or role'
      onChange={(e) => onSearch(e.target.value)}
    />
  );
};

export default Search;
