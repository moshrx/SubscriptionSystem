import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeactivatedSubscriptions = () => {
    const [deactivatedSubscriptions, setDeactivatedSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchDeactivatedSubscriptions = async () => {
            try {
                const response = await axios.get(`/api/subscription/deactivated-apps/${userId}`);
                setDeactivatedSubscriptions(response.data || []);
            } catch (err) {
                console.error("Error fetching deactivated subscriptions:", err);
                setError("Failed to load deactivated subscriptions.");
            } finally {
                setLoading(false);
            }
        };

        fetchDeactivatedSubscriptions();
    }, [userId]);

    return (
        <div className="subscription-cards">
            <h2>Deactivated Subscriptions</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : deactivatedSubscriptions.length === 0 ? (
                <p>No deactivated subscriptions found.</p>
            ) : (
                <div className="cards-container">
                    {deactivatedSubscriptions.map((subscription) => (
                        <div key={subscription.subscriptionId} className="subscription-card">
                            <h3>{subscription.appName}</h3>
                            <p><strong>Cost:</strong> {subscription.cost}</p>
                            <p><strong>Duration:</strong> {subscription.duration}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeactivatedSubscriptions;
