/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import React, { useLayoutEffect, useState , useRef} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import profileIcon from "../assets/profile-icon.png";
import rightArrow from "../assets/right-arrow.jpg";
import searchIcon from "../assets/search-icon.png";
import sidebarIcon from "../assets/sidebar-icon.jpg";
import BaseTemplate from './Base_Template.jsx';
import '../css_files/Search_Results.css';
import '../css_files/Search_Bar.css';
import { fetchSearchResults } from './api.jsx';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState({ users: [] });
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(Number(searchParams.get("filters")));
  const filterBitstring = filters.toString(2);
  const [seminarClicked, setSeminarClick] = useState(filterBitstring[filterBitstring.length-1] == '1');
  const [peerClicked, setPeerClick] = useState(filterBitstring[filterBitstring.length-2] == '1');
  const [allyClicked, setAllyClick] = useState(filterBitstring[filterBitstring.length-3] == '1');
  const [phdClicked, setPhdClick] = useState(filterBitstring[filterBitstring.length-4] == '1');

  const[pageNumber, setPage] = useState(Number(searchParams.get('p')) || 1);
  const pageRange = useRef([1]);

  const [query, setQuery] = useState(searchParams.get("q"));
  const navigate = useNavigate();
  const [sideBar, showSideBar] = useState(false);
  const [dateDrop, showDateDrop] = useState(false);
  const [dateSort, setDateSort] = useState(searchParams.get("orderby"));
  const [universityDrop, showUnivesityDrop] = useState(false);
  const [university, setUnivesity] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() || filters > 0 || dateSort || university) {
      navigate(`/results?q=${query}&filters=${filters}&orderby=${dateSort}&university=${university}`);
    }
  };

  useLayoutEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await fetchSearchResults(query, filters, dateSort, university, pageNumber);
        setResults(data); // this needs changed
        pageRange.current = data['page-range'];
      } catch (err) {
        setError(err.message);
      }
    };
    fetchResults();
  }, [query, filters, dateSort, university, pageNumber]);

  if (error) {
    return (
      <BaseTemplate>
        <div className="results-content">
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </BaseTemplate>
    );
  }

  return (
    <BaseTemplate>
      <div className="results-content">
        
        <div className="top">
          <div className="search-bar-container">
            <form className="search-bar" id="form" onSubmit={handleSearch}>
              <button className="search-button" onClick={() => showSideBar(!sideBar)} type="button">
                <img src={sidebarIcon} width='20px' height='20px' />
              </button>
              <input
                type="text"
                className="search-input"
                value={query || ''}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Handshake"
              />
              <button className="search-button" type="submit">
                <img src={searchIcon} width='20px' height='20px' />
              </button>
            </form>
            <div className="filter-container">
              <button className={`filter-button ${seminarClicked ? 'active' : ''}`} onClick={() => { setSeminarClick(!seminarClicked); setFilters(filters + ((!seminarClicked ? 1 : -1) * 1)) }}>
                Open to Seminar
              </button>
              <button className={`filter-button ${peerClicked ? 'active' : ''}`} onClick={() => { setPeerClick(!peerClicked); setFilters(filters + ((!peerClicked ? 1 : -1) * 2)) }}>
                Open to Peer Review
              </button>
              <button className={`filter-button ${allyClicked ? 'active' : ''}`} onClick={() => { setAllyClick(!allyClicked); setFilters(filters + ((!allyClicked ? 1 : -1) * 4)) }}>
                Open to Allyship
              </button>
              <button className={`filter-button ${phdClicked ? 'active' : ''}`} onClick={() => { setPhdClick(!phdClicked); setFilters(filters + ((!phdClicked ? 1 : -1) * 8)) }}>
                PhD Helpers
              </button>
            </div>
          </div>
          <div className="page-turner">
                        <span className={`change-page ${pageRange.current[0]==Number(pageNumber) ? 'disabled' : 'enabled'}`} id='backward' onClick={
                            () => {
                                if(pageNumber-1 >= 1){
                                    setPage(pageNumber-1)
                                }
                            }
                        }>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#494641" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H6M12 5l-7 7 7 7"/></svg>
                        </span> {/* Change the svg */}
                        
                        <span id="current-page ">
                            <p>Page {pageNumber}</p>
                        </span>
                        
                        <span className={`change-page ${pageRange.current[pageRange.current.length-1]==Number(pageNumber) ? 'disabled' : 'enabled'}`} id='forward' onClick={
                            () => {
                              console.log(pageRange.current, pageNumber)
                                if(pageNumber+1 <= pageRange.current.length){
                                    setPage(pageNumber+1)
                                    console.log(pageNumber);
                                    

                                }
                            }
                        }>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#494641" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M12 5l7 7-7 7"/></svg>
                        </span>
          </div> {/* Need set own class names and css  */}
        </div>


        <div className="search-results-container">
          <div className={`sidebar ${sideBar ? 'open' : ''}`}>
            <div className={`sidebar-row ${dateDrop ? 'open' : ''}`} id='date'>
              <div onClick={() => { showDateDrop(!dateDrop) }} className="sidebar-button">Sort by Date Joined <img src={rightArrow} width="20px" height="20px" alt="right-arrow" /></div>
              <div className='date-drop'>
                <div className='drop-item'>
                  <input type="checkbox" id="newest" value="newest" onClick={(e) => { dateSort == "newest" ? setDateSort('') : setDateSort(e.target.value) }} checked={dateSort == "newest"} />
                  <label htmlFor="newest">Newest First</label>
                </div>
                <div className='drop-item'>
                  <input type="checkbox" id="oldest" value="oldest" onClick={(e) => { dateSort == "oldest" ? setDateSort('') : setDateSort(e.target.value) }} checked={dateSort == "oldest"} />
                  <label htmlFor="oldest">Oldest First</label>
                </div>
              </div>
            </div>

            <div className={`sidebar-row ${universityDrop ? 'open' : ''}`} id='university'>
              <div onClick={() => { showUnivesityDrop(!universityDrop) }} className="sidebar-button">Filter by University <img src={rightArrow} width="20px" height="20px" alt="right-arrow" /></div>
              <div className='date-drop'>
                <div className='drop-item'>
                  <input type="checkbox" id="aberdeen" value='3' onClick={(e) => { university == "3" ? setUnivesity('') : setUnivesity(e.target.value) }} checked={university == "3"} />
                  <label htmlFor="aberdeen">University of Aberdeen</label>
                </div>
                <div className='drop-item'>
                  <input type="checkbox" id="edinburgh" value="2" onClick={(e) => { university == "2" ? setUnivesity('') : setUnivesity(e.target.value) }} checked={university == "2"} />
                  <label htmlFor="edinburgh">University of Edinburgh</label>
                </div>
                <div className='drop-item'>
                  <input type="checkbox" id="glasgow" value="1" onClick={(e) => { university == "1" ? setUnivesity('') : setUnivesity(e.target.value) }} checked={university == "1"} />
                  <label htmlFor="glasgow">University of Glasgow</label>
                </div>
                <div className='drop-item'>
                  <input type="checkbox" id="stirling" value="4" onClick={(e) => { university == "4" ? setUnivesity('') : setUnivesity(e.target.value) }} checked={university == "4"} />
                  <label htmlFor="stirling">University of Stirling</label>
                </div>
              </div>
            </div>
          </div>

          <div className="result-grid">
            {results.users.length > 0 ? (
              results.users.map((user, index) => (
                <div className="user-object" key={index}>
                  <img onClick={() => { navigate(`/profile/?u=${user.user_id}`) }} src={profileIcon} width="50px" height="50px" alt="Profile Icon" />
                  <div className="user-info">
                    <h2 onClick={() => { navigate(`/profile/?u=${user.user_id}`) }}>{user.first_name} {user.last_name}</h2>
                    <p>{user.affiliation__name}</p>
                    <p>Date Joined: {user.user__date_joined.slice(8,10)}/{user.user__date_joined.slice(5,7)}/{user.user__date_joined.slice(0,4)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No users found</p>
            )}
          </div>

          
        </div>
        
      </div>
      
    </BaseTemplate>
  );
};

export default SearchResults;