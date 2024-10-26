import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import api from '../api';
import '../styles/styles.css';

const Subscription = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            try {
                const { data } = await api.getUserSubscriptions(userId, token);
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
                        <th>Actions</th>
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
                            <td>
                                <button>Edit</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add a "+" button to navigate to the add subscription page */}
            <Link to="/add-subscription">
                <button className="add-subscription-btn">+ Add Subscription</button>
            </Link>
        </div>
    );
};

export default Subscription;
