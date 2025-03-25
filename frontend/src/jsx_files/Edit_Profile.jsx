/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */
 
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import { updateProfile } from './api';
import { useNavigate, useSearchParams } from 'react-router-dom';
 
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
  ]
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
  ]

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
}



 
function EditProfile({ profileData, setProfileData, setEditing, affiliationList, email }) {
    const navigate = useNavigate();
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(profileData);
            setEditing(false);
        } catch (error) {
            console.error('Error saving profile: ', error);
        }
    };
 
    const handleChange = (e) => {

        const { name, value } = e.target;
        if (name=="variant") {
            setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
            ["area_of_expertise"]:''
        }));
        }

        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
 
    const handleSelectChange = (selectedOptions, actionMeta) => {
        const { name } = actionMeta;
        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setProfileData((prevData) => ({
            ...prevData,
            [name]: values,
        }));
    };
 
    const handleDeleteAccount = () => {
        navigate('/delete-account');
    };
 
    return (
        <Form className = 'forms-setup' onSubmit={handleSave}>
            <Form.Group className="mb-3" controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    type="text"
                    name="first_name"
                    value={profileData.first_name || ''}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    type="text"
                    name="last_name"
                    value={profileData.last_name || ''}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={email || 'hello'}
                    onChange={handleChange}
                    disabled
                />
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label><strong>Affiliated Institution: </strong></Form.Label>
                <Form.Control 
                as="select" 
                value={affiliationList[profileData.affiliation]} 
                name="affiliation"
                onChange={handleChange}>
                <option value="">Select Affiliation</option>
                {affiliationList.map((affiliate) => 
                <option value={affiliate} key={affiliate}>{affiliate}</option>)}
                </Form.Control>
             </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label><strong>Role: </strong></Form.Label>
                <Form.Control
                 as="select"
                 value={profileData.user_type}
                 name="user_type"
                 onChange={handleChange}>
                <option value="">Select User Type</option>
                <option value="Professor">Professor</option>
                <option value="Researcher">Researcher</option>
                <option value="NatureScot Staff">NatureScot Staff</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><strong>Ecological Area: </strong></Form.Label>
              <Form.Control
                as="select"
                value={profileData.ecological_area}
                name="ecological_area"
                onChange={handleChange}
                >
                <option value="">Select Ecological Area</option>
                {ecologicalAreaOptions.map(area => (
                <option key={area} value={area}>{area}</option>
                ))}
              </Form.Control>

            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label><strong>Subject Area: </strong></Form.Label>
                <Form.Control 
                as="select" 
                value={profileData.subject_area} 
                onChange={handleChange}
                name="subject_area">
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
                value={profileData.variant} 
                name="variant"
                onChange={handleChange}>
                <option value="">Select Variant</option>
                {Object.keys(variantOptions).map(area => (
                <option key={area} value={area}>{area}</option>
                ))}
                </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAreaOfExpertise">
                <Form.Label><strong>Area of Expertise</strong></Form.Label>
                <Form.Control
                // variant options
                    as='select'
                    name="area_of_expertise"
                    value={profileData.area_of_expertise}
                    onChange={handleChange}>
                    <option value="">Area of Expertise</option> 
                    {variantOptions[profileData.variant].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Biography (max 250 words)</Form.Label>
                <Form.Control
                    as="textarea"
                    name="biography"
                    style={{resize:"vertical",
                            maxHeight:"200px"}}
                    maxLength={250} 
                    value={profileData.biography || ''}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formWillingPeerReview">
                <Form.Check
                    type="checkbox"
                    name="willing_peer_review"
                    label="Willing to Peer Review"
                    checked={profileData.willing_peer_review || false}
                    onChange={(e) => setProfileData((prevData) => ({
                        ...prevData,
                        willing_peer_review: e.target.checked,
                    }))}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formWillingAllyship">
                <Form.Check
                    type="checkbox"
                    name="willing_allyship"
                    label="Willing for Allyship"
                    checked={profileData.willing_allyship || false}
                    onChange={(e) => setProfileData((prevData) => ({
                        ...prevData,
                        willing_allyship: e.target.checked,
                    }))}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formWillingSeminar">
                <Form.Check
                    type="checkbox"
                    name="willing_seminar"
                    label="Willing for Seminar"
                    checked={profileData.willing_seminar || false}
                    onChange={(e) => setProfileData((prevData) => ({
                        ...prevData,
                        willing_seminar: e.target.checked,
                    }))}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formWillingPHDhelper">
                <Form.Check
                    type="checkbox"
                    name="willing_PHDhelper"
                    label="Willing to be a PhD Helper"
                    checked={profileData.willing_PHDhelper || false}
                    onChange={(e) => setProfileData((prevData) => ({
                        ...prevData,
                        willing_PHDhelper: e.target.checked,
                    }))}
                />
            </Form.Group>
            <Button variant="primary" type="submit">Save</Button> {}
            <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
            <button  className = "change-password-button"variant="primary" onClick={() => navigate('/change-password')}>
                            Change Password
                        </button>
                        <button className = "delete-account-button" variant="primary" onClick={handleDeleteAccount}>
                            Delete Account
                        </button>
        </Form>
    );
}
 
export default EditProfile;