import React, { useEffect, useState } from 'react';
import '../styles/subscription.css';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const handleAddSubscription = () => {
        navigate('/add-subscription');
    };

    const handleEditSubscription = (subscription) => {
        navigate('/add-subscription', { state: { existingSubscription: subscription } });
    };

    useEffect(() => {
        // Fetch subscriptions from the backend
        fetch('http://localhost:5000/api/subscription/subscriptions')  
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Map the data to parse cost if it's an object
                const parsedSubscriptions = data.map(subscription => ({
                    ...subscription,
                    cost: subscription.cost?.$numberDecimal || subscription.cost // Convert cost to a readable format
                }));
                setSubscriptions(parsedSubscriptions);
            })
            .catch(error => {
                console.error('Error fetching subscriptions:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });

            fetch('http://localhost:5000/api/subscription/apps')
            .then(response => response.json())
            .then(appsData => setApplications(appsData))
            .catch(error => console.error('Error fetching apps:', error));
    }, []);

    const getAppName = (appId) => {
        const app = applications.find(app => app.appId === appId);
        return app ? app.appName : 'Unknown';
    };

    if (isLoading) {
        return <div>Loading subscriptions...</div>;
    }

    return (
        <div className="subscription-table">
            <h2>Your Subscriptions</h2>

            <button onClick={handleAddSubscription} className="btn btn-primary">
                Add New Subscription
            </button>

            <table>
                <thead>
                    <tr>
                        <th>App ID</th>
                        <th>Cost</th>
                        <th>Subscription Date</th>
                        <th>Renewal Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.map((subscription) => (
                        <tr key={subscription.subscriptionId}>
                            <td data-label="App Name">{getAppName(subscription.appId)}</td>
                            <td data-label="Cost">{subscription.cost}</td>
                            <td data-label="Subscription Date">{new Date(subscription.subscriptionDate).toLocaleDateString()}</td>
                            <td data-label="Renewal Date">{new Date(subscription.renewalDate).toLocaleDateString()}</td>
                            <td data-label="Actions">
                                <button onClick={() => handleEditSubscription(subscription)} className="btn btn-secondary">Edit</button> {/* Edit button */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Subscription;
