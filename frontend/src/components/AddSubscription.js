import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/styles.css';
import '../styles/addSubscription.css';

const AddSubscriptionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const existingSubscription = location.state?.existingSubscription || null;

    const [apps, setApps] = useState([]);
    const [subscription, setSubscription] = useState({
        appId: '',
        cost: '',
        subscriptionDate: '',
        renewalDate: '',
        reminderEnabled: false,
        subscriptionPeriod: '',
        reminderDate: '',
    });

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [isEditMode, setIsEditMode] = useState(!!existingSubscription);
    useEffect(() => {
        if (existingSubscription) {
            setIsEditMode(true);
            setSubscription({
                appId: existingSubscription.appId || '',
                cost: existingSubscription.cost || '',
                subscriptionDate: formatDate(existingSubscription.subscriptionDate),
                renewalDate: formatDate(existingSubscription.renewalDate),
                reminderEnabled: existingSubscription.reminderEnabled || false,
                reminderDate: formatDate(existingSubscription.reminderDate),
                reminderDays:calculateReminderDays(
                    existingSubscription.renewalDate,
                    existingSubscription.reminderDate
                ),
                renewalMonths: calculateSubscriptionPeriod(
                    existingSubscription.subscriptionDate,
                    existingSubscription.renewalDate
                ),
            });
        }
    }, [existingSubscription]);

    const calculateSubscriptionPeriod = (startDate, endDate) => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
    
            // Calculate the difference in years and months
            let years = end.getFullYear() - start.getFullYear();
            let months = end.getMonth() - start.getMonth();
    
            // Adjust if end month is earlier in the year than start month
            if (months < 0) {
                years--;
                months += 12;
            }
    
            // Convert total time difference to months
            const totalMonths = years * 12 + months;
            console.log("Subscirption Months - ",totalMonths);
            return totalMonths;
        }
        return '';
    };

    const calculateReminderDays = (renewalDate, reminderDate) => {
        if (!renewalDate || !reminderDate) return '';
        const renewal = new Date(renewalDate);
        const reminder = new Date(reminderDate);
        const diffTime = renewal.getTime() - reminder.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    

    useEffect(() => {
        // Set userId from local storage
        const userId = localStorage.getItem('userId');
        if (userId) {
            setSubscription(prev => ({ ...prev, userId })); // Update subscription with userId
        }
    }, []);

    useEffect(() => {
        // Fetch apps from the backend
        fetch('http://localhost:5000/api/subscription/apps')  
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setApps(data);
            })
            .catch(error => {
                console.error('Error fetching apps:', error);
            });
    }, []);

    // Calculate renewal and reminder dates when relevant fields change
    useEffect(() => {
        const { subscriptionDate, renewalMonths, reminderEnabled, reminderDays } = subscription;

        if (subscriptionDate && renewalMonths) {
            // Calculate the renewal date based on subscriptionDate and renewalMonths
            const startDate = new Date(subscriptionDate);
            startDate.setMonth(startDate.getMonth() + parseInt(renewalMonths, 10));
            const calculatedRenewalDate = startDate.toISOString().split('T')[0];

            let calculatedReminderDate = '';
            if (reminderEnabled && reminderDays) {
                // Calculate the reminder date based on reminderDays prior to the renewal date
                const reminderDate = new Date(startDate);
                reminderDate.setDate(reminderDate.getDate() - parseInt(reminderDays, 10));
                calculatedReminderDate = reminderDate.toISOString().split('T')[0];
            }

            // Update subscription state with calculated dates
            setSubscription(prev => ({
                ...prev,
                renewalDate: calculatedRenewalDate,
                reminderDate: calculatedReminderDate
            }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscription.subscriptionDate, subscription.renewalMonths, subscription.reminderEnabled, subscription.reminderDays]);

    const handleCostChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setSubscription((prev) => ({ ...prev, cost: value }));
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSubscription((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
            ...(name === 'renewalDate' && {
                subscriptionPeriod: calculateSubscriptionPeriod(subscription.subscriptionDate, value),
            }),
            ...(name === 'subscriptionDate' && {
                subscriptionPeriod: calculateSubscriptionPeriod(value, subscription.renewalDate),
            }),
        }));
    };

    const handleSubmit = async (e) => {
        console.log("Existing Subs in handle submit- ",existingSubscription);

        e.preventDefault();

        const apiUrl = isEditMode
            ? `http://localhost:5000/api/subscription/${existingSubscription.subscriptionId}/update`
            : 'http://localhost:5000/api/subscription/add';
        
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(apiUrl, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription)
            });

            if (response.ok) {
                console.log('Subscription saved successfully');
                navigate('/subscriptions');
            } else {
                console.error('Error saving subscription');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCancel = () => {
        navigate('/subscriptions');
    };

    return (
        <div className="add-subscription-form">
            <h2>{existingSubscription ? 'Update Subscription' : 'Add New Subscription'}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Application:
                    <select name="appId" value={subscription.appId} onChange={handleChange} disabled={isEditMode} required>
                        <option value="">Select an app</option>
                        {apps.map((app) => (
                            <option key={app.appId} value={app.appId}>{app.appName}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Cost:
                    <input type="number" name="cost" value={subscription.cost} onChange={handleCostChange} required />
                </label>
                <label>
                    Subscription Date:
                    <input type="date" name="subscriptionDate" value={subscription.subscriptionDate} onChange={handleChange} required />
                </label>
                <label>
                    Subscription Period (Months):
                    <select name="renewalMonths" value={subscription.renewalMonths} onChange={handleChange} required>
                        <option value="1">1</option>
                        <option value="3">3</option>
                        <option value="6">6</option>
                        <option value="9">9</option>
                        <option value="12">12</option>
                    </select>
                </label>
                <label>
                    Renewal Date:
                    <input type="date" name="renewalDate" value={subscription.renewalDate} readOnly />
                </label>
                <label>
                    Enable Reminder:
                    <input type="checkbox" name="reminderEnabled" checked={subscription.reminderEnabled} onChange={handleChange} />
                </label>
                {subscription.reminderEnabled && (
                    <>
                        <label>
                            Reminder Days Before Renewal:
                            <input type="number" name="reminderDays" value={subscription.reminderDays} onChange={handleChange} min="1" max="7" />
                        </label>
                        <label>
                            Reminder Date:
                            <input type="date" name="reminderDate" value={subscription.reminderDate} readOnly />
                        </label>
                    </>
                )}
                <div className="form-buttons">
                    <button type="submit" className="btn btn-primary">
                        {isEditMode ? 'Update Subscription' : 'Add Subscription'}
                    </button>
                    {isEditMode && (
                        <button type="button" onClick={handleCancel} className="btn btn-secondary">
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddSubscriptionPage;
