import React, { useEffect, useState } from 'react';
import api from '../api'; // Import your API module
import '../styles/styles.css'; // Import your styles

const Subscription = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
            try {
                const { data } = await api.getUserSubscriptions(userId, token); // Fetch subscriptions
                setSubscriptions(data);
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    if (isLoading) {
        return <div>Loading subscriptions...</div>;
    }

    return (
        <div className="subscription-table">
            <h2>Your Subscriptions</h2>
            <table>
                <thead>
                    <tr>
                        <th>App Name</th>
                        <th>Cost</th>
                        <th>Subscription Date</th>
                        <th>Renewal Date</th>
                        <th>Reminder Date</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.map((subscription) => (
                        <tr key={subscription.id}>
                            <td>{subscription.appName}</td>
                            <td>{subscription.cost}</td>
                            <td>{new Date(subscription.subscriptionDate).toLocaleDateString()}</td>
                            <td>{new Date(subscription.renewalDate).toLocaleDateString()}</td>
                            <td>{new Date(subscription.reminderDate).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Subscription;
