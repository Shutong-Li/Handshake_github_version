/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */
/* 
  Register.jsx
  This component handles the user registration process, including:
  - Collecting user details (name, email, password, etc.)
  - Verifying the user's email
  - Collecting additional profile information (affiliation, expertise, etc.)
  - Submitting the data to the backend API
*/

import React, { useRef, useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BaseTemplate from './Base_Template';
import "../css_files/Register.css";
import { registerUser, login, updateProfile, checkVerification, fetchOrganisations } from "./api";

// Main Register component
function Register() {
  // State variables for user input and application state
  const [first_name, setFirstName] = useState(''); // User's first name
  const [last_name, setLastName] = useState(''); // User's last name
  const [affiliation, setAffiliation] = useState(''); // User's affiliated institution
  const [affiliationList, setAffiliationList] = useState([]); // List of available affiliations
  const [biography, setBiography] = useState(''); // User's biography
  const [ecological_area, setEcologicalArea] = useState(''); // Selected ecological area
  const [subject_area, setSubjectArea] = useState(''); // Selected subject area
  const [area_of_expertise, setAreaOfExpertise] = useState(''); // Selected area of expertise
  const [expertiseOptions, setExpertiseOptions] = useState([]); // Expertise options based on subject area
  const [user_type, setUserType] = useState(''); // User type (e.g., Professor, Researcher)
  const [username, setUsername] = useState(''); // User's email (used as username)
  const [password, setPassword] = useState(''); // User's password
  const [isVerified, setIsVerified] = useState(false); // Email verification status
  const [variant, setVariant] = useState(''); // Selected variant for expertise

  // State variables for user contributions
  const [willing_peer_review, setWillingPeerReview] = useState(false);
  const [willing_allyship, setWillingAllyship] = useState(false);
  const [willing_seminar, setWillingSeminar] = useState(false);
  const [willing_PHDhelper, setWillingPHDHelper] = useState(false);

  const [stage, setStage] = useState(1); // Current stage of the registration process
  const [errors, setErrors] = useState([]); // Validation errors

  const emailRef = useRef(null); // Reference to the email input field
  const passwordRef = useRef(null); // Reference to the password input field

  const navigate = useNavigate(); // React Router navigation hook

  // Options for dropdown menus
  const subjectAreaOptions = [
    "Animal Physiology",
    "Behavioural ecology",
    "Movement ecology",
    "Population ecology",
    "Community ecology",
    "Plant ecology",
    "Freshwater ecology",
    "Vector ecology",
    "Aquaculture",
    "Agroecology",
    "Statistical ecology",
    "Theoretical ecology",
    "Environmental change",
    "Population genetics",
    "Evolutionary ecology",
    "Disease ecology",
    "Animal welfare",
    "One Health",
    "Conservation biology",
    "Pollution biology/Toxicology",
    "Environment economics",
    "Biogeography",
    "Taxonomy/Systematics",
    "Genetics",
    "Carbon cycling",
    "Social/Human Behavioural Scientist",
    "Environmental Education",
    "Geologist",
    "Geomorphologist",
    "Data Scientist",
    "Geographer",
    "Geographical Information Systems expert",
  ]; // List of subject areas
  const ecologicalAreaOptions = 
  [
   "Marine (offshore)", 
   "Marine (intertidal)", 
   "Coastal", 
   "Upland", 
   "Lowland", 
   "Forest/Woodland", 
   "Limnology", 
   "Soils", 
   "Peatland", 
   "Estuarine", 
   "Tundra", 
   "Wetland", 
   "Urban"
  ]; // List of ecological areas
  const variantOptions =
  {
    "Zoology": [
        "Mammology",
        "Marine mammals",
        "Chiropterology",
        "Herpetology",
        "Ornithology",
        "Entomology",
        "Ichthyology"
    ],
    "Plant science": [
        "Paleobotany",
        "Crop science",
        "Forestry",
        "Bryology"
    ],
    "Microbiology": [
        "Parasitology",
        "Mycology",
        "Bacteriology",
        "Virology"
    ]
}; // Mapping of variants to expertise options

  // Fetches organisations and checks if the user is already logged in
  useEffect(() => {
    if (sessionStorage.getItem("access_token")) {
      setStage(2); // Skip to stage 2 if the user is already logged in
    }
    getOrganisations(); // Fetch list of organisations for affiliation dropdown
  }, []);

  // Handles form submission for stage 1 (basic user details)
  function submitStageOne(e) {
    e.preventDefault();
    console.log("Stage 1 submitted with username:", username);
    setStage(2); // Move to stage 2
  }

  async function getOrganisations() {
    try {
      const res = await fetchOrganisations();
      const names = res.Organisations.map(org => org.name);
      setAffiliationList(names);
    } catch (error) {
      if (error.response) {
        console.error("error fetching organisations");
      }
    }
  }


  // Creates a new user account by sending data to the backend
  function createAccount() {
    console.log("Creating account for:", username);
    const userData = {
      username,
      password,
      email: username,
      first_name,
      last_name,
      userprofile: {
        first_name,
        last_name,
        affiliation: null,
        biography: '',
        subject_area: '',
        area_of_expertise: '',
        user_type: '',
      },
    };

    registerUser(userData)
      .then((res) => {
        if (res) {
          // Automatically log in the user after successful registration
          login(username, password).then(function(res) {
            sessionStorage.setItem('access_token', res.access_token);
            sessionStorage.setItem('refresh_token', res.refresh_token);
            setCurrentUser(res.user);
          });
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setErrors(error.response.data)
          console.log("Status error: "+ error.response.status);
          Object.entries(error.response.data).forEach(([field, messages]) => {
            switch (field) {
              case 'email':
                emailRef.current.style.borderColor = 'red';
                break;
              case 'username':
                emailRef.current.style.borderColor = 'red';
                break;
              case 'Password':
                passwordRef.current.style.borderColor = 'red'
                break;
            }
            alert(`${messages.join("\n ")}`); 
          });
        } else if (error.response.status === 404) {
          alert("Network error: please reconnect before attempting to register")
        }
      });

  }

  // Periodically checks if the user's email has been verified
  useEffect(() => {
    let interval;
    if (stage === 2 && !isVerified) {
      interval = setInterval(async () => {
        try {
          createAccount(); // Ensure account creation
          const response = await checkVerification(username); // Check verification status
          if (response.verified && !response.is_complete) {
            setIsVerified(true);
            setStage(3); // Move to stage 3
            clearInterval(interval); // Stop the interval
          }
        } catch (error) {
          console.error('Verification check failed:', error);
        }
      }, 5000); // Check every 5 seconds
    }
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [stage, isVerified, username]);

  // Handles form submission for stage 2 (additional profile details)
  function submitStageTwo(e) {
    e.preventDefault();

    const userProfileData = {
      first_name,
      last_name,
      affiliation: affiliationList.includes(affiliation) ? affiliationList.indexOf(affiliation) + 1 : null,
      biography,
      ecological_area,
      subject_area,
      area_of_expertise,
      user_type,
      willing_peer_review,
      willing_allyship,
      willing_seminar,
      willing_PHDhelper,
    };

    updateProfile(userProfileData)
      .then((res) => {
        navigate(`/profile/`); // Redirect to the user's profile page
      })
      .catch((error) => {
        console.error("Profile update failed:", error.response?.data || error.message);
      });
  }

  return (
    <BaseTemplate>
      <div className="center">
        <h1>Register Here!</h1>

        {/* Stage 1: Basic user details */}
        {stage === 1 && (
          <Form onSubmit={submitStageOne}>
            {/* Form fields for first name, last name, email, and password */}
            <Form.Group className="mb-3">
              <Form.Label><strong>First Name: </strong></Form.Label>
              <Form.Control required type="text" placeholder="First Name" value={first_name} onChange={e => setFirstName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><strong>Last Name: </strong></Form.Label>
              <Form.Control required type="text" placeholder="Last Name" value={last_name} onChange={e => setLastName(e.target.value)} />
            </Form.Group>

            {/* Username and Email */}
            <Form.Group className="mb-3">
              <Form.Label><strong>Email: </strong></Form.Label>
              <Form.Control ref={emailRef} required type="text" placeholder="Enter email" value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3">
              <Form.Label><strong>Password: </strong></Form.Label>
              <Form.Control ref ={passwordRef} required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>

            <Button variant="primary" type="submit">Next</Button>
          </Form>
        )}

        {/* Stage 2: Email verification */}
        {stage === 2 && (
          <div className="verification-message">
            <h3>Check your email to verify your account!</h3>
            <p>We've sent a verification link to {username}</p>
            <Button variant="link" onClick={() => setStage(1)}>
              Need to correct your email?
            </Button>
          </div>
        )}

        {/* Stage 3: Additional profile details */}
        {stage === 3 && (
          <Form onSubmit={submitStageTwo}>
            {/* Organisation (Affiliation) */}
            <Form.Group className="mb-3" >
              <Form.Label><strong>Affiliated Institution: </strong></Form.Label>
              <Form.Control as="select" value={affiliation} onChange={e => setAffiliation(e.target.value)}>
                <option value="">Select Affiliation</option>
                {affiliationList.map((affiliate) => 
                <option value={affiliate} key={affiliate}>{affiliate}</option>)}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" >
              <Form.Label><strong>Role: </strong></Form.Label>
              <Form.Control as="select" value={user_type} onChange={e => setUserType(e.target.value)}>
              <option value="">Select User Type</option>
                <option value="Professor">Professor</option>
                <option value="Researcher">Researcher</option>
                <option value="NatureScot Staff">NatureScot Staff</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
              </Form.Control>
            </Form.Group>

            {/* Biography */}
            <Form.Group className="mb-3">
              <Form.Label><strong>Describe yourself (max 250): </strong></Form.Label>
              <Form.Control id="biography" maxLength={250} as="textarea" placeholder="Biography" value={biography} onChange={e => setBiography(e.target.value)} />
            </Form.Group>

            
            <Form.Group className="mb-3">
              <Form.Label><strong>Subject Area: </strong></Form.Label>
              <Form.Control 
                as="select" 
                value={subject_area} 
                onChange={e => {
                  const selectedArea = e.target.value;
                  setSubjectArea(selectedArea);
                }}>
                <option value="">Select Subject Area</option>
                {subjectAreaOptions.map(area => (
                <option key={area} value={area}>{area}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><strong>Variant: </strong></Form.Label>
              <Form.Control 
                as="select" 
                value={variant} 
                onChange={e => {
                  const selectedArea = e.target.value;
                  setVariant(selectedArea);
                  setExpertiseOptions(variantOptions[selectedArea] || []);
                  setAreaOfExpertise(''); // Reset expertise when subject changes
                }}>
                <option value="">Select Variant</option>
                {Object.keys(variantOptions).map(area => (
                <option key={area} value={area}>{area}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><strong>Area of Expertise: </strong></Form.Label>
              <Form.Control 
                as="select" 
                value={area_of_expertise} 
                onChange={e => setAreaOfExpertise(e.target.value)} 
                disabled={!expertiseOptions.length}>
                <option value="">Select Area of Expertise</option>
                {expertiseOptions.map(expertise => (
                <option key={expertise} value={expertise}>{expertise}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label><strong>Contributions: </strong></Form.Label>
             <Form.Group className="mb-3" controlId="formWillingPeerReview">
              <Form.Check
                  type="checkbox"
                  name="willing_peer_review"
                  label="Willing to Peer Review"
                  checked={willing_peer_review}
                  onChange={() => {
                      setWillingPeerReview((!willing_peer_review));}}
              />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formWillingAllyship">
              <Form.Check
                  type="checkbox"
                  name="willing_allyship"
                  label="Willing for Allyship"
                  checked={willing_allyship}
                  onChange={() => {
                      setWillingAllyship((!willing_allyship));}}
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formWillingSeminar">
              <Form.Check
                  type="checkbox"
                  name="willing_seminar"
                  label="Willing for Seminar"
                  checked={willing_seminar}
                  onChange={() => {
                      setWillingSeminar((!willing_seminar));}}
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formWillingPHDhelper">
              <Form.Check
                  type="checkbox"
                  name="willing_PHDhelper"
                  label="Willing to be a PhD Helper"
                  checked={willing_PHDhelper}
                  onChange={() => {
                      setWillingPHDHelper((!willing_PHDhelper));}}
              />
          </Form.Group>
          </Form.Group>

            

            <Button variant="primary" type="submit">Submit</Button>
          </Form>
        )}
      </div>
    </BaseTemplate>
  );
}

export default Register;
