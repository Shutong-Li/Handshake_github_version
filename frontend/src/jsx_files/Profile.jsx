/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Modal from 'react-modal';
import { createVIP, fetchUserVIPs, fetchUsername, fetchProfile, authenticateProfile, fetchUserPosts, fetchUserEvents, fetchOrganisations } from './api';
import BaseTemplate from './Base_Template';
import VIPModal from './VIPModal';
import EventModal from './EventModal';
import PostModal from './PostModal';
import EditProfile from './Edit_Profile';
import '../css_files/profilePage.css';

// Set the root element for accessibility purposes
Modal.setAppElement("#root");

/*
  Profile Component
  - Displays the user's profile page, including personal details, VIPs, posts, and events.
  - Allows users to edit their profile, create VIPs, and view details of VIPs, posts, and events.
  - Fetches and displays data dynamically based on the user ID from the URL.
*/

function Profile() {
    // State variables for managing profile data and UI state
    const [searchParams] = useSearchParams(); // Extract query parameters from the URL
    const [profileData, setProfileData] = useState({}); // Stores the user's profile data
    const [editing, setEditing] = useState(false); // Tracks whether the profile is in edit mode
    const [canEdit, setCanEdit] = useState(false); // Determines if the logged-in user can edit this profile
    const [userID, setUser] = useState(searchParams.get("u")); // User ID from the URL
    const [userVIPs, setUserVIPs] = useState([]); // List of VIPs created by the user
    const [selectedVIP, setSelectedVIP] = useState(null); // Currently selected VIP for viewing details
    const [isVIPModalOpen, setIsVIPModalOpen] = useState(false); // Controls the visibility of the "Create VIP" modal
    const [isVIPDetailsModalOpen, setIsVIPDetailsModalOpen] = useState(false); // Controls the visibility of the VIP details modal
    const [userPosts, setUserPosts] = useState([]); // List of posts created by the user
    const [userEvents, setUserEvents] = useState([]); // List of events created by the user
    const [selectedEvent, setSelectedEvent] = useState(null); // Currently selected event for viewing details
    const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false); // Controls the visibility of the event details modal
    const [selectedPost, setSelectedPost] = useState(null); // Currently selected post for viewing details
    const [isPostDetailsModalOpen, setIsPostDetailsModalOpen] = useState(false); // Controls the visibility of the post details modal
    const [affiliateList, setAffiliationList] = useState([]); // List of organisations for affiliation dropdown
    const [usernameData, setUsernameData] = useState([]); // Stores the username data of the profile being viewed

    const navigate = useNavigate(); // React Router navigation hook
    const fileInput = useRef(null); // Reference to the file input element for VIP creation
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
        file_upload: ''
    });

    // Fetches and loads profile data when the component mounts or the user ID changes
    useEffect(() => {
        const userID = searchParams.get("u");

        const loadData = async () => {
            try {
                const usernameData = await fetchUsername(userID);
                if (!usernameData) {
                    navigate('/login'); // Redirect to login if the user is not found
                    return;
                }

                const profileID = userID || usernameData.id;
                setUsernameData(usernameData);

                const profileData = await fetchProfile(profileID);
                setProfileData(profileData);

                const canEditData = await authenticateProfile(profileID);
                setCanEdit(canEditData);
            } catch (error) {
                console.error("Error loading profile data:", error);
                navigate('/login'); // Redirect to login on error
            }
        };

        loadData();
    }, [searchParams, navigate]);

    // Fetches the user's VIPs when the component mounts
    useEffect(() => {
        const loadUserVIPs = async () => {
            try {
                const vips = await fetchUserVIPs();
                setUserVIPs(vips);
            } catch (error) {
                console.error('Error fetching user VIPs:', error);
                setUserVIPs([]); // Ensure userVIPs is an array even if the API call fails
            }
        };
        loadUserVIPs();
    }, []);

    // Fetches the user's posts and events when the component mounts or the user ID changes
    useEffect(() => {
        const loadUserPosts = async () => {
            try {
                const posts = await fetchUserPosts(userID);
                setUserPosts(posts);
            } catch (error) {
                console.error('Error fetching user posts:', error);
                setUserPosts([]); // Ensure userPosts is an array even if the API call fails
            }
        };

        const loadUserEvents = async () => {
            try {
                const events = await fetchUserEvents(userID);
                setUserEvents(events);
            } catch (error) {
                console.error('Error fetching user events:', error);
                setUserEvents([]); // Ensure userEvents is an array even if the API call fails
            }
        };

        loadUserPosts();
        loadUserEvents();
        getOrganisations();
    }, [userID]);

    // Opens the "Create VIP" modal
    const openVIPModal = () => {
        setIsVIPModalOpen(true);
    };

    // Closes the "Create VIP" modal
    const closeVIPModal = () => {
        setIsVIPModalOpen(false);
    };

    // Opens the VIP details modal for a selected VIP
    const openVIPDetailsModal = (vip) => {
        setSelectedVIP(vip);
        setIsVIPDetailsModalOpen(true);
    };

    // Closes the VIP details modal
    const closeVIPDetailsModal = () => {
        setIsVIPDetailsModalOpen(false);
        setSelectedVIP(null);
    };

    // Opens the event details modal for a selected event
    const openEventDetailsModal = (event) => {
        setSelectedEvent(event);
        setIsEventDetailsModalOpen(true);
    };

    // Closes the event details modal
    const closeEventDetailsModal = () => {
        setIsEventDetailsModalOpen(false);
        setSelectedEvent(null);
    };

    // Opens the post details modal for a selected post
    const openPostDetailsModal = (post) => {
        setSelectedPost(post);
        setIsPostDetailsModalOpen(true);
    };

    // Closes the post details modal
    const closePostDetailsModal = () => {
        setIsPostDetailsModalOpen(false);
        setSelectedPost(null);
    };

    // Handles input changes for the "Create VIP" form
    const handleInputChange = (e) => {
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

    // Fetches the list of organisations for the affiliation dropdown
    const getOrganisations = async () => {
        try {
            const res = await fetchOrganisations();
            const names = res.Organisations.map(org => org.name);
            setAffiliationList(names);
        } catch (error) {
            console.error("Error fetching organisations:", error);
        }
    };

    // Handles the creation of a new VIP
    const handleCreateVIP = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.entries(newVIP).forEach(([key, value]) => {
                if (key === "file_upload" && value) {
                    formData.append(key, value);
                } else if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            const res = await createVIP(formData);
            if (res.status === 201) {
                setIsVIPModalOpen(false);
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
                window.location.reload(); // Reload the page to reflect the new VIP
            } else {
                console.error('Failed to create VIP:', res.data);
            }
        } catch (error) {
            console.error('Failed to create VIP:', error);
        }
    };

    // Redirects the user to the account deletion page
    const handleDeleteAccount = () => {
        navigate('/delete-account');
    };

    return (
        <BaseTemplate>
            <div>
                {!editing ? (
                    <>
                    <div className='profile-header'>
                        <div className="profile-picture">
                            {profileData.profile_picture ? (
                            <img src={profileData.profile_picture} alt="Profile" onError={(e) => e.target.src = "default-profile.png"} />
                            ) : (
                            <div className="placeholder">No Image</div>
                            )}
                        </div>

                        {canEdit &&<>
                        <div className='edit-button'> 
                            <Button variant="primary" onClick={() => setEditing(true)}>Edit</Button>
                        </div></>}

                        <div className="affiliation-placeholder">
                            <p><strong>Affiliation:</strong> {affiliateList[profileData.affiliation-1] || 'N/A'}</p>
                        </div>
                    </div>
                        <div className="profile-content">
                            <div className="name-field">
                                <div className='name-attribute'><h2>{profileData.first_name || 'N/A'} {profileData.last_name || 'N/A'}</h2></div>
                                <div className='personal-info'>
                                <span>{usernameData.username || 'N/A'}</span>
                                </div>
 
                            </div>
                            <div className="profile-details">
                                {profileData.willing_peer_review && (
                                    <button className='profile-detail-button'><strong>Willing to Peer Review</strong></button>
                                )}
                                {profileData.willing_allyship && (
                                    <button className='profile-detail-button'><strong>Willing for Allyship</strong></button>
                                )}
                                {profileData.willing_seminar && (
                                    <button className='profile-detail-button'><strong>Willing for Seminar</strong></button>
                                )}
                                {profileData.willing_PHDhelper && (
                                    <button className='profile-detail-button'><strong>Willing to be a PhD Helper</strong></button>
                                )}
                            </div>
                            <div className = "profile-layout">    
                                <div className="profile-section">
                                    <button className = 'vip-button' onClick={openVIPModal}>Create VIP</button>
                                        <h2>My VIPs</h2>
                                        <div className="profile-box-container">
                                            {userVIPs.map(vip => (
                                                <div key={vip.id} className="profile-box" onClick={() => openVIPDetailsModal(vip)}>
                                                    <h3>{vip.title}</h3>
                                                </div>
                                            ))}
                                        </div>
                                        <h2>My Events</h2>
                                        <div className="profile-box-container">
                                            {userEvents.map(event => (
                                                <div key={event.id} className="profile-box" onClick={() => openEventDetailsModal(event)}>
                                                    <h3>{event.title}</h3>
                                                    <p>{event.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <h2>My Posts</h2>
                                        <div className="profile-box-container">
                                            {userPosts.map(post => (
                                                <div key={post.id} className="profile-box" onClick={() => openPostDetailsModal(post)}>
                                                    <h3>{post.title}</h3>
                                                    <p>{post.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                </div>
                                <div className="about-section">
                                <p><strong>About:</strong> </p>
                                <div className='about-box'>
                                        {profileData.biography || 'N/A'}
                                </div>
                                </div>
                                <div className='about-container'>
                                    <p><strong>Subject Area:</strong> {profileData.subject_area || 'N/A'}</p>
                                    <p><strong>Ecological Area:</strong> {profileData.ecological_area || 'N/A'}</p>
                                    <p><strong>Area of Expertise:</strong> {profileData.area_of_expertise || 'N/A'}</p>
                                    <p><strong>Variant: </strong>{profileData.variant || 'N/A'}</p>
                                    <p><strong>Role: </strong>{profileData.user_type || 'N/A'}</p>
                                    </div>
                        </div>
                    </div>
                         
                    </>
                ) : (
                    <EditProfile profileData={profileData} setProfileData={setProfileData} setEditing={setEditing} affiliationList={affiliateList} email={usernameData.username || 'N/A'}/>
                )}
            </div>
            <div>
                <Modal isOpen={isVIPModalOpen} 
                       onRequestClose={closeVIPModal}
                       className="modal-vip"
                       overlayClassName="overlay-vip"
                >                    <h2>Create VIP</h2>
                    <form onSubmit={handleCreateVIP}>
                        <label>
                            Title:
                            <input type="text" name="title" value={newVIP.title} onChange={handleInputChange} required />
                        </label>
                        <label>
                            Theme:
                            <input type="text" name="theme" value={newVIP.theme} onChange={handleInputChange} />
                        </label>
                        <label>
                            Subject Area:
                            <input type="text" name="subject_area" value={newVIP.subject_area} onChange={handleInputChange} />
                        </label>
                        <label>
                            Area of Expertise:
                            <input type="text" name="area_of_expertise" value={newVIP.area_of_expertise} onChange={handleInputChange} />
                        </label>
                        <label>
                            Preferred Interests and Skills:
                            <input type="text" name="preferred_interests_and_skills" value={newVIP.preferred_interests_and_skills} onChange={handleInputChange} />
                        </label>
                        <label>
                            Preparation:
                            <input type="text" name="preparation" value={newVIP.preparation} onChange={handleInputChange} />
                        </label>
                        <label>
                            Goals:
                            <input type="text" name="goals" value={newVIP.goals} onChange={handleInputChange} />
                        </label>
                        <label>
                            Specific Issues Addressed:
                            <input type="text" name="specific_issues_addressed" value={newVIP.specific_issues_addressed} onChange={handleInputChange} />
                        </label>
                        <label>
                            Methods:
                            <input type="text" name="methods" value={newVIP.methods} onChange={handleInputChange} />
                        </label>
                        <label>
                            Data Available:
                            <input type="text" name="data_available" value={newVIP.data_available} onChange={handleInputChange} />
                        </label>
                        <label>
                            Field Lab Work:
                            <input type="text" name="field_lab_work" value={newVIP.field_lab_work} onChange={handleInputChange} />
                        </label>
                        <label>
                            Meeting Schedule:
                            <input type="text" name="meeting_schedule" value={newVIP.meeting_schedule} onChange={handleInputChange} />
                        </label>
                        <label>
                            Meeting Location:
                            <input type="text" name="meeting_location" value={newVIP.meeting_location} onChange={handleInputChange} />
                        </label>
                        <label>
                            Partner Sponsor:
                            <input type="text" name="partner_sponsor" value={newVIP.partner_sponsor} onChange={handleInputChange} />
                        </label>
                        <label>
                            File Upload:
                            <input type="file" ref={fileInput} name="file_upload" onChange={handleInputChange} />
                        </label>
                        <button type="submit">Create</button>
                        <button type="button" onClick={closeVIPModal}>Cancel</button>
                    </form>
                </Modal>
            </div>
            <VIPModal
                isOpen={isVIPDetailsModalOpen}
                onRequestClose={closeVIPDetailsModal}
                vip={selectedVIP}
            />
            <EventModal
                isOpen={isEventDetailsModalOpen}
                onRequestClose={closeEventDetailsModal}
                event={selectedEvent}
            />
 
            <PostModal
                isOpen={isPostDetailsModalOpen}
                onRequestClose={closePostDetailsModal}
                post={selectedPost}
            />
        </BaseTemplate>
    );
}
 
export default Profile;