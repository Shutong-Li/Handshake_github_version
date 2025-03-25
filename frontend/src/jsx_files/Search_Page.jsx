/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from "../assets/search-icon.png";
import BaseTemplate from "./Base_Template";
import "../css_files/Search_Page.css";
import "../css_files/Search_Bar.css"; 

const SearchPage = () => {

  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const [seminarClicked, setSeminarClick] = useState(false)
  const [peerClicked, setPeerClick] = useState(false) 
  const [allyClicked, setAllyClick] = useState(false) 
  const [phdClicked, setPhdClick] = useState(false) 

  const [filters, setFilters] = useState(0);


  /*filter function*/
  const handleSearch = (e) => {
    // Keep function below. Prevents form from carrying out default behaviour which is sending form info to server.
    // But because query var is handled seperately by React it sends the data with an empty query causing an empty search. 
    e.preventDefault();
    
    if (query.trim() || filters > 0) {
      navigate(`/results?q=${query}&filters=${filters}`);
    };
  };

  return (
    <BaseTemplate>
      <div className="search-page">
        <div className="objects-container">
          <h1 className="search-title">Handshake</h1>
          <div className="search-bar-container">
            <form className="search-bar" id="form" onSubmit={handleSearch}>

                <input type="text" className="search-input" value={query} onChange ={(e) => setQuery(e.target.value)} placeholder="Search Handshake" />
               
                <button data-testid="search-button" className="search-button"  type= "submit">
                    <img src={searchIcon} width='20px' height='20px' />
                </button>

            </form>
            <div className="filter-container">
            <button className={`filter-button ${seminarClicked ? 'active' : ''}`} onClick={() => {setSeminarClick(!seminarClicked); setFilters(filters + ((!seminarClicked ? 1 : -1) * 1))} }>
              Open to Seminar
            </button>

            <button className={`filter-button ${peerClicked ? 'active' : ''}`} onClick={() => {setPeerClick(!peerClicked); setFilters(filters + ((!peerClicked ? 1 : -1 )* 2))}} >
              Open to Peer Review
            </button>

            <button className={`filter-button ${allyClicked ? 'active' : ''}`} onClick={() => {setAllyClick(!allyClicked); setFilters(filters + ((!allyClicked ? 1 : -1 ) * 4))}} >
              Open to Allyship
            </button>

            <button className={`filter-button ${phdClicked ? 'active' : ''}`} onClick={() => {setPhdClick(!phdClicked); setFilters(filters + ((!phdClicked ? 1 : -1) * 8))}} >
              PhD Helpers
            </button>
            
            </div>
        </div>
        </div>
      </div>
    </BaseTemplate>
  );
};

export default SearchPage;