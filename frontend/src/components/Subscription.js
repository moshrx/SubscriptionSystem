import React, { useEffect, useState } from 'react';
import '../styles/subscription.css';
import UpgradeModal from './UpgradeModal';
import { useNavigate } from 'react-router-dom';
import { getUserSubscriptions } from '../api';

const Subscription = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const isPremiumUser = localStorage.getItem('isPremiumUser') === 'true';
    const token = localStorage.getItem('token'); // Get the token outside the useEffect

    const handleAddSubscription = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/subscription/subscriptionCount?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch subscription count');
            }
            const { subscriptionCount } = await response.json();

            if (!isPremiumUser && subscriptionCount >= 5) {
                setModalOpen(true);
            } else {
                navigate('/add-subscription');
            }
        } catch (error) {
            console.error("Error fetching subscription count:", error);
        }
    };

    const handleDeactivate = async (subscriptionId) => {
        // Show confirmation prompt before deactivating
        const isConfirmed = window.confirm("Are you sure you want to deactivate this subscription?");
    
        if (isConfirmed) {
            try {
                const response = await fetch(`http://localhost:5000/api/subscription/deactivate/${subscriptionId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    alert(data.message); // Show success message
                    // Refresh the subscriptions after deactivation
                    setSubscriptions(prevState =>
                        prevState.filter(subscription => subscription.subscriptionId !== subscriptionId)
                    );
                } else {
                    alert(data.message); // Show error message
                }
            } catch (error) {
                console.error("Error deactivating subscription:", error);
                alert("Error deactivating subscription");
            }
        }
    };
    
    const handleEditSubscription = (subscription) => {
        navigate('/add-subscription', { state: { existingSubscription: subscription } });
    };

    useEffect(() => {
        if (!token) {
            console.error('Token is missing.');
            return;
        }

        // Fetch subscriptions using the getUserSubscriptions function
        getUserSubscriptions(userId, token)
            .then(data => {
                // Filter and map the subscriptions as required
                const activeSubscriptions = data.filter(subscription => !subscription.inActive);
                const parsedSubscriptions = activeSubscriptions.map(subscription => ({
                    ...subscription,
                    cost: subscription.cost?.$numberDecimal || subscription.cost
                }));
                setSubscriptions(parsedSubscriptions);
            })
            .catch(error => {
                console.error('Error fetching subscriptions:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });

        // Fetch applications data
        fetch('http://localhost:5000/api/subscription/apps')
            .then(response => response.json())
            .then(appsData => setApplications(appsData))
            .catch(error => console.error('Error fetching apps:', error));
    }, [userId, token]); // Now token is safely used outside

    const getAppName = (appId) => {
        const app = applications.find(app => app.appId === appId);
        return app ? app.appName : 'Unknown';
    };

    const formatDate = (value) => {
        const date = new Date(value);
      
        const options = {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          timeZone: "UTC", // Specify UTC to avoid local time zone issues
        };
        return date.toLocaleString("en-US", options);
      };

    if (isLoading) {
        return <div>Loading subscriptions...</div>;
    }

    return (
        <div className="subscription-cards">
            <h2>Your Subscriptions</h2>

            <button onClick={handleAddSubscription} className="btn btn-primary">
                Add New Subscription
            </button>
            <UpgradeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

            {/* Subscription Cards */}
            <div className="cards-container">
                {subscriptions.map((subscription) => (
                    <div key={subscription.subscriptionId} className="subscription-card">
                        <h3>{getAppName(subscription.appId)}</h3>

                        {/* Subscription Table for each card */}
                        <table className="subscription-table">
                            <tbody>
                                <tr>
                                    <td><strong>Cost:</strong> {subscription.cost}</td>
                                </tr>
                                <tr>
                                    <td><strong>Subscription Date:</strong> {formatDate(subscription.subscriptionDate)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Renewal Date:</strong> {formatDate(subscription.renewalDate)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Reminder Date:</strong> {subscription.reminderDate ? formatDate(subscription.reminderDate) : '-'}</td>
                                </tr>
                                <tr>
                                    <td className="actions">
                                        <button onClick={() => handleEditSubscription(subscription)} className="btn btn-secondary">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeactivate(subscription.subscriptionId)} className="btn btn-deactivate">
                                            Deactivate
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Subscription;
