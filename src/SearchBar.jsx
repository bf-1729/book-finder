import React, { useState } from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';

const SearchBar = ({ items, onSelect }) => {
  const handleOnSearch = (string, results) => {
    // Called on each keystroke; can be used for custom filtering if needed
  };

  const handleOnSelect = (item) => {
    onSelect(item);
  };

  return (
    <div style={{ width: '100%' }}>
      <ReactSearchAutocomplete
        items={items}
        onSearch={handleOnSearch}
        onSelect={handleOnSelect}
        fuseOptions={{ keys: ["name"] }} // fields for fuzzy search
        resultStringKeyName="name"
        autoFocus
      />
    </div>
  );
};

export default SearchBar;
