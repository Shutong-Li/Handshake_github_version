/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import React, { useEffect, useState } from 'react';
import { fetchOrganisations } from './api';
import Modal from 'react-modal';
import '../css_files/affiliates.css';
import BaseTemplate from './Base_Template';

Modal.setAppElement('#root');

function Affiliates() {
    const [affiliates, setAffiliates] = useState([]);
    const [selectedAffiliate, setSelectedAffiliate] = useState(null);

    useEffect(() => {
        async function loadAffiliates() {
            try {
                const affiliates = await fetchOrganisations();
                setAffiliates(affiliates.Organisations);
            } catch (error) {
                console.error('Error loading affiliates', error);
            }
        }
        loadAffiliates();
    }, []);

    const openModal = (affiliate) => {
        setSelectedAffiliate(affiliate);
    };

    const closeModal = () => {
        setSelectedAffiliate(null);
    };

    return (
        <BaseTemplate>
        <div className="affiliates-page">
            <h1>Our Partner Organisations</h1>
            <div className="university-grid">
                {affiliates.map(uni => (
                    <div className="university-card" key={uni.name} onClick={() => openModal(uni)}>
                        <img src={uni.picture} alt={`${uni.name} logo`} />
                        <div className="text-content">
                            <h2>{uni.name}</h2>
                            </div>
                    </div>
                ))}
            </div>
            {selectedAffiliate && (
                <Modal
                    isOpen={!!selectedAffiliate}
                    onRequestClose={closeModal}
                    contentLabel="Affiliate Details"
                    className="modal-content"
                    overlayClassName="modal-overlay"
                >
                    <h2>{selectedAffiliate.name}</h2>
                    <img src={selectedAffiliate.picture} alt={`${selectedAffiliate.name} logo`} />
                    <p><strong>Ambassador:</strong>{selectedAffiliate.ambassador}</p>
                    <p><strong>Email:</strong>{selectedAffiliate.email}</p>
                    <p><strong>Phone:</strong>{selectedAffiliate.phone}</p>
                    <button onClick={closeModal}>Close</button>
                </Modal>
            )}
        </div>
        </BaseTemplate>
    );
}

export default Affiliates;