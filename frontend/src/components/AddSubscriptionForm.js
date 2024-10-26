import React, { useEffect, useState } from 'react';
import api, { getApplications } from '../api'; // Assuming you have the correct API setup
import { useNavigate } from 'react-router-dom';

const AddSubscriptionForm = () => {
    const [userId, setUserId] = useState(''); // State to hold userId
    const [applications, setApplications] = useState([]);
    const [selectedAppId, setSelectedAppId] = useState('');
    const [cost, setCost] = useState('');
    const [renewalDate, setRenewalDate] = useState('');
    const [reminderDate, setReminderDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const apps = await getApplications(); // Use the new function
                console.log('Applications fetched:', apps); // Log response
                setApplications(apps);
            } catch (error) {
                console.error('Error fetching applications:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); // Get userId from local storage
    
        // Log the userId to check its value
        console.log('Retrieved User ID:', userId);
    
        console.log('Submitting Subscription:', { userId, selectedAppId, cost, renewalDate, reminderDate });
    
        try {
            // Send the subscription data to the backend
            await api.post('/subscribe', {
                userId,           // Make sure this is defined and not undefined
                appId: selectedAppId,
                cost,
                renewalDate,
                reminderDate,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
    
            // Navigate to the subscriptions page after successful submission
            navigate('/subscriptions');
        } catch (error) {
            console.error('Error adding subscription:', error);
        }
    };
    

    if (isLoading) {
        return <div>Loading applications...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="app">Select Application:</label>
                <select
                    id="app"
                    value={selectedAppId}
                    onChange={(e) => setSelectedAppId(e.target.value)}
                    required
                >
                    <option value="" disabled>Select an application</option>
                    {applications.map((app) => (
                        <option key={app._id} value={app._id}>
                            {app.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="cost">Cost:</label>
                <input
                    type="number"
                    id="cost"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="renewalDate">Renewal Date:</label>
                <input
                    type="date"
                    id="renewalDate"
                    value={renewalDate}
                    onChange={(e) => setRenewalDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="reminderDate">Reminder Date:</label>
                <input
                    type="date"
                    id="reminderDate"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                />
            </div>
            <button type="submit">Add Subscription</button>
        </form>
    );
};

export default AddSubscriptionForm;
