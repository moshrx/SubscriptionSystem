import React, { useEffect, useState } from 'react';
import '../styles/subscription.css';
import UpgradeModal from './UpgradeModal';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const isPremiumUser = localStorage.getItem('isPremiumUser') === 'true';

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
        fetch(`http://localhost:5000/api/subscription/subscriptions?userId=${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const parsedSubscriptions = data.map(subscription => ({
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
        <div className="subscription-cards">
            <h2>Your Subscriptions</h2>

            <button onClick={handleAddSubscription} className="btn btn-primary">
                Add New Subscription
            </button>
            <UpgradeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

            <div className="cards-container">
                {subscriptions.map((subscription) => (
                    <div key={subscription.subscriptionId} className="subscription-card">
                        <h3>{getAppName(subscription.appId)}</h3>
                        <p><strong>Cost:</strong> {subscription.cost}</p>
                        <p><strong>Subscription Date:</strong> {new Date(subscription.subscriptionDate).toLocaleDateString()}</p>
                        <p><strong>Renewal Date:</strong> {new Date(subscription.renewalDate).toLocaleDateString()}</p>
                        <p><strong>Reminder Date:</strong> {subscription.reminderDate ? new Date(subscription.reminderDate).toLocaleDateString() : '-'}</p>

                        <div className="actions">
                            <button onClick={() => handleEditSubscription(subscription)} className="btn btn-secondary">
                                Edit
                            </button>
                            <button onClick={() => handleDeactivate(subscription.subscriptionId)} className="btn btn-deactivate">
                                Deactivate
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Subscription;
