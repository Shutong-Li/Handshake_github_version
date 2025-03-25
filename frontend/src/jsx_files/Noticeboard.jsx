/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import React, { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import { createPostEvent, fetchEvents, fetchUsername, deletePostEvent, fetchAllVIPs, createVIP } from "./api";
import BaseTemplate from "./Base_Template";
import VIPModal from './VIPModal';
import "../css_files/noticeboard.css";

Modal.setAppElement("#root");

function Noticeboard() {
    const isAuthenticated = !!sessionStorage.getItem('access_token');
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');
    const [postevents, setPostEvents] = useState([]);
    const [events, setEvents] = useState([]);
    const [vips, setVIPs] = useState([]);
    const [isCreateVIPModalOpen, setIsCreateVIPModalOpen] = useState(false);
    const [isVIPDetailsModalOpen, setIsVIPDetailsModalOpen] = useState(false);
    const fileInput = useRef(null);
    const [newVIP, setNewVIP] = useState({
        title: '',
        theme: '',
        subject_area: '',
        area_of_expertise: '',
        preferred_interests_and_skills: '',
        preparation: '',
        goals: '',
        specific_issues_addressed: '',
        methods: '',
        data_available: '',
        field_lab_work: '',
        meeting_schedule: '',
        meeting_location: '',
        partner_sponsor: '',
        lead_investigator: userId,
        file_upload: '',
    });
    const [selectedVIP, setSelectedVIP] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newPostEvent, setNewPostEvent] = useState({
        post_or_event: 'Post',
        title: '',
        description: '',
        event_date: '',
        location: '',
        event_type: '',
        subject_area: '',
        area_of_expertise: '',
        image: '',
        created_by: '',
        created_by_username: ''
    });
    const [filteredEvents, setFilteredEvents] = useState([]); // Stores filtered events
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Controls filter menu visibility
    const [startDate, setStartDate] = useState(""); // Start date state
    const [endDate, setEndDate] = useState(""); // End date state
    const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
    const [selectedType, setSelectedType] = useState("");

    useEffect(() => {
        loadEvents();
        if (isAuthenticated) {
            loadVIPs();
        }
    }, [isAuthenticated]);

    const loadEvents = async () => {
        try {
            let postevents = await fetchEvents();
            const currentDate = new Date();
            postevents = postevents.filter(postevent => {
                const eventDate = new Date(postevent.event_date);
                if (postevent.post_or_event === 'Event' && eventDate < currentDate) {
                    handleDeleteEvent(postevent.id);
                    return false;
                }
                return true;
            });
            postevents = postevents.sort((b, a) => new Date(b.event_date) - new Date(a.event_date));
            const eventsonly = postevents.filter(postevent => postevent.post_or_event === 'Event');
            setEvents(eventsonly);
            postevents = postevents.sort((b, a) => new Date(b.date_created) - new Date(a.date_created));
            setPostEvents(postevents);
            setFilteredEvents(eventsonly);
            const username_id = await fetchUsername();
            console.log(username_id);
            setUsername(username_id.username);
            setUserId(username_id.id);
            setNewPostEvent(prevState => ({
                ...prevState,
                created_by: username_id.id,
                created_by_username: username_id.username
            }));

        } catch (error) {
            console.error('Failed to fetch events:', error);
        }
    };

    const loadVIPs = async () => {
        try {
            const vips = await fetchAllVIPs();
            setVIPs(vips);
        } catch (error) {
            console.error('Failed to fetch VIPs:', error);
        }
    };

    const openModal = (postevent) => {
        setSelectedEvent(postevent);
    };

    const closeModal = () => {
        setSelectedEvent(null);
    };

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPostEvent((prevState) => ({
            ...prevState,
            [name]: name === "event_date" ? new Date(value).toISOString() : value,
            ...(name === "post_or_event" && value === "Post"
                ? { event_date: new Date().toISOString() }
                : {}),
        }));
    };

    const openVIPDetailsModal = (vip) => {
        setSelectedVIP(vip);
        setIsVIPDetailsModalOpen(true);
    };

    const closeVIPDetailsModal = () => {
        setIsVIPDetailsModalOpen(false);
        setSelectedVIP(null);
    };

    const openCreateVIPModal = () => {
        setIsCreateVIPModalOpen(true);
    };
    
    const closeCreateVIPModal = () => {
        setIsCreateVIPModalOpen(false);
    };
    
    const handleVIPInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'file_upload') {
            setNewVIP((prevState) => ({
                ...prevState,
                file_upload: fileInput.current.files[0]
            }));
        } else {
            setNewVIP((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleCreateVIPSubmit = async (e) => {
        e.preventDefault();
                try {
                    const formData = new FormData();
                    Object.keys(newVIP).forEach((key) => {
                        formData.append(key, key === 'file_upload' ? fileInput.current.files[0] : newVIP[key]);
                    });
        
                    const res = await createVIP(formData); // Pass FormData to the API call
                    if (res.status === 201) {
                        setIsCreateVIPModalOpen(false);
                        setNewVIP({
                            title: '',
                            theme: '',
                            subject_area: '',
                            area_of_expertise: '',
                            preferred_interests_and_skills: '',
                            preparation: '',
                            goals: '',
                            specific_issues_addressed: '',
                            methods: '',
                            data_available: '',
                            field_lab_work: '',
                            meeting_schedule: '',
                            meeting_location: '',
                            partner_sponsor: '',
                            file_upload: ''
                        });
                        window.location.reload();
                    } else {
                        console.error('Failed to create VIP:', res.data);
                    }
                } catch (error) {
                    console.error('Failed to create VIP:', error);
                }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...newPostEvent };
        
        // Remove event_date if it's a Post
        if (payload.post_or_event === "Post") {
            delete payload.event_date;
        }
    
        payload.created_by = userId;
        payload.created_by_username = username;
    
        console.log('Submitting new post event:', payload);
    
        try {
            const res = await createPostEvent(payload);
            if (res.status === 201) {
                setIsCreateModalOpen(false);
                setNewPostEvent({
                    post_or_event: 'Post',
                    title: '',
                    description: '',
                    event_date: '',
                    location: '',
                    event_type: '',
                    subject_area: '',
                    area_of_expertise: '',
                    image: '',
                });
                window.location.reload();
            } else {
                console.error('Failed to create post/event:', res.data);
            }
        } catch (error) {
            console.error('Failed to create post/event:', error);
        }
    };

    const handleDeleteEvent = async (id) => {
        try {
            const res = await deletePostEvent(id);
            if (res.status === 204) {
                setSelectedEvent(null);
                window.location.reload();
            } else {
                console.error('Failed to delete post/event:', res.data);
            }
        } catch (error) {
            console.error('Failed to delete post/event:', error);
        }
    };

    //filter function here--------

    // Toggle the filter menu
    const toggleFilterMenu = () => {
        setIsFilterOpen(!isFilterOpen);
    };
    const toggleTypeFilterMenu = () => {
        setIsTypeFilterOpen(!isTypeFilterOpen);
    };
    // Handle date selection
    const handleDateFilter = () => {
        if (!startDate || !endDate) {
            alert("Please select both start and end dates!");
            return;
        }

        const filtered = events.filter((event) => {
            const eventDate = new Date(event.event_date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return eventDate >= start && eventDate <= end; // Check if event falls within the range
        });

        setFilteredEvents(filtered);
    };
    // Handle type selection
    const handleTypeFilter = (type) => {
        setSelectedType(type);
        const filtered = events.filter((event) => event.event_type === type);
        setFilteredEvents(filtered);
    };

    const resetFilters = () => {
        setStartDate("");
        setEndDate("");
        setSelectedType("");
        setFilteredEvents(events);
    };

    return (
        <BaseTemplate>

            <div className="user-noticeboard">
            {isAuthenticated && (
                <div className="create-buttons-container">
                    <button
                        className="create-post-button volkhov"
                        onClick={openCreateModal}
                    >
                        Create Post
                    </button>
                    <button
                        className="create-post-button volkhov"
                        onClick={openCreateVIPModal}
                    >
                        Create VIP
                    </button>
                </div>
            )}

                <h2 className="volkhov">Upcoming Events</h2>

                <div className="event-rows-top">
                    {events.map(event => (
                        <div key={event.id} className="event-tile-top" onClick={() => openModal(event)}>
                            <img src={event.image} alt={event.title} />
                            <h2>{event.title}</h2>
                        </div>
                    ))}
                </div>

                <Modal
                    isOpen={isCreateModalOpen}
                    onRequestClose={closeCreateModal}
                    className="modal-content"
                    overlayClassName="modal-overlay"

                >
                    <h2>Create Post/Event</h2>
                    <form onSubmit={handleCreateSubmit}>
                        <label>
                            Post or Event:
                            <select name="post_or_event" value={newPostEvent.post_or_event} onChange={handleInputChange}>
                                <option value="Post">Post</option>
                                <option value="Event">Event</option>
                            </select>
                        </label>

                        <label>
                            Title:
                            <input type="text" name="title" value={newPostEvent.title} onChange={handleInputChange} required />
                        </label>

                        <label>
                            Description:
                            <textarea name="description" value={newPostEvent.description} onChange={handleInputChange} required />
                        </label>
                        {newPostEvent.post_or_event === 'Event' && (
                            <label>
                                Event Date:
                                <input type="datetime-local" name="event_date" value={newPostEvent.event_date} onChange={handleInputChange} />
                            </label>
                        )}
                        {newPostEvent.post_or_event === 'Event' && (
                            <label>
                                Location:
                                <input type="text" name="location" value={newPostEvent.location} onChange={handleInputChange} />
                            </label>
                        )}
                        {newPostEvent.post_or_event === 'Event' && (
                            <label>
                                Event Type:
                                <select name="event_type" value={newPostEvent.event_type} onChange={handleInputChange}>
                                    <option value="">Select Event Type</option>
                                    <option value="Seminar">Seminar</option>
                                    <option value="Collaboration Meeting">Collaboration Meeting</option>
                                    <option value="Research Presentation">Research Presentation</option>
                                    <option value="Conference">Conference</option>
                                </select>
                            </label>
                        )}
                        <label>
                            <p>
                                Subject Area:
                                <select name="subject_area" value={newPostEvent.subject_area} onChange={handleInputChange}>
                                    <option value="">Select Subject Area</option>
                                    <option value="Animal Physiology">Animal Physiology</option>
                                    <option value="Behavioural ecology">Behavioural ecology</option>
                                    <option value="Movement ecology">Movement ecology</option>
                                    <option value="Population ecology">Population ecology</option>
                                    <option value="Community ecology">Community ecology</option>
                                    <option value="Plant ecology">Plant ecology</option>
                                    <option value="Freshwater ecology">Freshwater ecology</option>
                                    <option value="Vector ecology">Vector ecology</option>
                                    <option value="Aquaculture">Aquaculture</option>
                                    <option value="Agroecology">Agroecology</option>
                                    <option value="Statistical ecology">Statistical ecology</option>
                                    <option value="Theoretical ecology">Theoretical ecology</option>
                                    <option value="Environmental change">Environmental change</option>
                                    <option value="Population genetics">Population genetics</option>
                                    <option value="Evolutionary ecology">Evolutionary ecology</option>
                                    <option value="Disease ecology">Disease ecology</option>
                                    <option value="Animal welfare">Animal welfare</option>
                                    <option value="One Health">One Health</option>
                                    <option value="Conservation biology">Conservation biology</option>
                                    <option value="Pollution biology/Toxicology">Pollution biology/Toxicology</option>
                                    <option value="Environment economics">Environment economics</option>
                                    <option value="Biogeography">Biogeography</option>
                                    <option value="Taxonomy/Systematics">Taxonomy/Systematics</option>
                                    <option value="Genetics">Genetics</option>
                                    <option value="Carbon cycling">Carbon cycling</option>
                                    <option value="Social/Human Behavioural Scientist">Social/Human Behavioural Scientist</option>
                                    <option value="Environmental Education">Environmental Education</option>
                                    <option value="Geologist">Geologist</option>
                                    <option value="Geomorphologist">Geomorphologist</option>
                                    <option value="Data Scientist">Data Scientist</option>
                                    <option value="Geographer">Geographer</option>
                                    <option value="Geographical Information Systems expert">Geographical Information Systems expert</option>
                                    <option value="Marine (offshore)">Marine (offshore)</option>
                                    <option value="Marine (intertidal)">Marine (intertidal)</option>
                                    <option value="Coastal">Coastal</option>
                                    <option value="Upland">Upland</option>
                                    <option value="Lowland">Lowland</option>
                                    <option value="Forest/Woodland">Forest/Woodland</option>
                                    <option value="Limnology">Limnology</option>
                                    <option value="Soils">Soils</option>
                                    <option value="Peatland">Peatland</option>
                                    <option value="Estuarine">Estuarine</option>
                                    <option value="Tundra">Tundra</option>
                                    <option value="Wetland">Wetland</option>
                                    <option value="Urban">Urban</option>
                                </select>
                            </p>

                        </label>
                        <label>
                            Area of Expertise:
                            <select name="area_of_expertise" value={newPostEvent.area_of_expertise} onChange={handleInputChange}>
                                <option value="">Select Area of Expertise</option>
                                <option value="Zoology">Zoology</option>
                                <option value="Microbiology">MicroBiology</option>
                                <option value="Plant Scientist">Plant Scientist</option>
                            </select>
                        </label>
                        <label>
                            Image URL:
                            <input type="text" name="image" value={newPostEvent.image} onChange={handleInputChange} />
                        </label>
                        <br></br>
                        <br></br>
                        <button type="submit" className="create-button">Create</button>
                        <button type="button" className="cancel-button" onClick={closeCreateModal}>Cancel</button>
                    </form>
                </Modal>

                <Modal
                    isOpen={isCreateVIPModalOpen}
                    onRequestClose={closeCreateVIPModal}
                    className="modal-content"
                    overlayClassName="modal-overlay"
                >
                    <h2>Create VIP</h2>
                    <form onSubmit={handleCreateVIPSubmit}>
                        <label>
                            Title:
                            <input type="text" name="title" value={newVIP.title} onChange={handleVIPInputChange} required />
                        </label>
                        <label>
                            Theme:
                            <input type="text" name="theme" value={newVIP.theme} onChange={handleVIPInputChange} required />
                        </label>
                        <label>
                            Subject Area:
                            <input type="text" name="subject_area" value={newVIP.subject_area} onChange={handleVIPInputChange} required />
                        </label>
                        <label>
                            Area of Expertise:
                            <input type="text" name="area_of_expertise" value={newVIP.area_of_expertise} onChange={handleVIPInputChange} required />
                        </label>
                        <label>
                            Preferred Interests and Skills:
                            <input type="text" name="preferred_interests_and_skills" value={newVIP.preferred_interests_and_skills} onChange={handleVIPInputChange} required />
                        </label>
                        <label>
                            Preparation:
                            <input type="text" name="preparation" value={newVIP.preparation} onChange={handleVIPInputChange} required />
                        </label>
                        <label>
                            Goals:
                            <input type="text" name="goals" value={newVIP.goals} onChange={handleVIPInputChange} required />
                        </label>
                        <label>
                            Specific Issues Addressed:
                            <input type="text" name="specific_issues_addressed" value={newVIP.specific_issues_addressed} onChange={handleVIPInputChange} required />
                        </label>
                        <label>
                            Methods:
                            <input type="text" name="methods" value={newVIP.methods} onChange={handleVIPInputChange} required />
                        </label>
                        <label>
                            Data Available:
                            <input type="text" name="data_available" value={newVIP.data_available} onChange={handleVIPInputChange} required />
                        </label>
                        <label>
                            Field/Lab Work:
                            <input type="text" name="field_lab_work" value={newVIP.field_lab_work} onChange={handleVIPInputChange} required />
                        </label>
                        <label>
                            Meeting Schedule:
                            <input type="text" name="meeting_schedule" value={newVIP.meeting_schedule} onChange={handleVIPInputChange} required />
                        </label>
                        <label>
                            Meeting Location:
                            <input type="text" name="meeting_location" value={newVIP.meeting_location} onChange={handleVIPInputChange} required />
                        </label>
                        <label>
                            Partner/Sponsor:
                            <input type="text" name="partner_sponsor" value={newVIP.partner_sponsor} onChange={handleVIPInputChange} required />
                        </label>
                        <label>
                            File Upload:
                            <input type="file" ref={fileInput} name="file_upload" onChange={handleInputChange} />
                        </label>
                        <br></br>
                        <br></br>
                        <button type="submit" className="create-button">Create</button>
                        <button type="button" className="cancel-button" onClick={closeCreateVIPModal}>Cancel</button>
                    </form>
                </Modal>

                <div className="database-all">
                    <h2 className="volkhov">All in Database</h2>
                    <div className="nb-filter-container">
                        {/* <button onClick={() => filterBySubject()}>Filter by Subjects</button> */}
                        <button onClick={toggleFilterMenu}>Filter by Time</button>
                        <button onClick={toggleTypeFilterMenu}>Filter by Type</button>
                        <button onClick={resetFilters}>Reset Filters</button>
                    </div>

                    {/* FILTER MENU (Dropdowns for Start and End Date) */}
                    {isFilterOpen && (
                        <div className="filter-menu">
                            <label>
                                Start Date:
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </label>
                            <label>
                                End Date:
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </label>
                            <button type="button" className="apply-filter-button" onClick={handleDateFilter}>Apply Filter</button>
                        </div>
                    )}

                    {/* type filter */}
                    {isTypeFilterOpen && (
                        <div className="filter-menu">
                            <button onClick={() => handleTypeFilter("Seminar")}>Seminar</button>
                            <button onClick={() => handleTypeFilter("Collaboration Meeting")}>
                                Collaboration Meeting
                            </button>
                            <button onClick={() => handleTypeFilter("Research Presentation")}>
                                Research Presentation
                            </button>
                            <button onClick={() => handleTypeFilter("Conference")}>
                                Conference
                            </button>
                        </div>
                    )}
                    <div className="event-grid-bottom">
                        {postevents.length > 0 ? (
                            postevents.map((event) => (
                                <div
                                    key={event.id}
                                    className="event-tile-bottom"
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    <img src={event.image} alt={event.title} />
                                    <h2>{event.title}</h2>
                                </div>
                            ))
                        ) : (
                            <p>No events found in this time range.</p>
                        )}
                        {isAuthenticated && vips.length > 0 && (
                            <>
                                {vips.map((vip) => (
                                    <div
                                        key={vip.id}
                                        className="event-tile-bottom"
                                        onClick={() => openVIPDetailsModal(vip)}
                                    >
                                        <h2>{vip.title}</h2>
                                        <p>{vip.theme}</p>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
                {selectedEvent && (
                    <Modal
                        isOpen={!!selectedEvent}
                        onRequestClose={closeModal}
                        contentLabel="Event Details"
                        className="modal-content"
                        overlayClassName="modal-overlay"

                    >
                        <h2>{selectedEvent.title}</h2>
                        <img src={selectedEvent.image} alt={selectedEvent.title} />
                        <p>{selectedEvent.description}</p>
                        {selectedEvent.post_or_event === 'Event' && (
                            <p><strong>Type:</strong> {selectedEvent.event_type}</p>
                        )}
                        {selectedEvent.post_or_event === 'Event' && (
                            <p><strong>Date:</strong> {new Date(selectedEvent.event_date).toLocaleString()}</p>
                        )}
                        {selectedEvent.post_or_event === 'Event' && (
                            <p><strong>Location:</strong> {selectedEvent.location}</p>
                        )}
                        <p><strong>Subject Area:</strong> {selectedEvent.subject_area}</p>
                        <p><strong>Area of Expertise:</strong> {selectedEvent.area_of_expertise}</p>
                        <p><strong>Created By:</strong> {selectedEvent.created_by_username}</p>
                        {selectedEvent.created_by === userId && (
                            <button onClick={() => handleDeleteEvent(selectedEvent.id)}>Delete</button>
                        )}
                        <button onClick={closeModal}>Close</button>
                    </Modal>
                )}

                <VIPModal
                    isOpen={isVIPDetailsModalOpen}
                    onRequestClose={closeVIPDetailsModal}
                    vip={selectedVIP}
                />
            </div>
        </BaseTemplate>
    );
}

export default Noticeboard;