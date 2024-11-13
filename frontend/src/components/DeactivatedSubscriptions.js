import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/deactivated-subscription.css'; // Ensure this file is properly included

const DeactivatedSubscriptions = () => {
    const [deactivatedSubscriptions, setDeactivatedSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) {
            setError("User ID not found.");
            setLoading(false);
            return;
        }

        const fetchDeactivatedSubscriptions = async () => {
            try {
                const response = await axios.get(`/api/subscription/deactivated-apps/${userId}`);
                setDeactivatedSubscriptions(response.data || []);
            } catch (err) {
                setError("Failed to load deactivated subscriptions.");
            } finally {
                setLoading(false);
            }
        };

        fetchDeactivatedSubscriptions();
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (deactivatedSubscriptions.length === 0) {
        return <div>No deactivated subscriptions found.</div>;
    }

    return (
        <div className="subscription-cards">
            <h2>Deactivated Subscriptions</h2>
            <div className="cards-container">
                {deactivatedSubscriptions.map((subscription) => (
                    <div key={subscription.subscriptionId} className="subscription-card">
                        <h3>{subscription.appName}</h3>

                        {/* Subscription Table for each deactivated subscription */}
                        <table className="subscription-table">
                            <tbody>
                                <tr>
                                    <td><strong>Cost:</strong> {subscription.cost}</td>
                                </tr>
                                <tr>
                                    <td><strong>Duration:</strong> {subscription.duration}</td>
                                </tr>
                                <tr>
                                    <td><strong>Deactivation Date:</strong> {new Date(subscription.deactivationDate).toLocaleDateString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeactivatedSubscriptions;
