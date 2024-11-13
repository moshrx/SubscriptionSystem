import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/addSubscription.css';

const AddSubscriptionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const existingSubscription = location.state?.existingSubscription || null;

    const [apps, setApps] = useState([]);
    const [appError, setAppError] = useState('');
    const [subscriptionDateError, setSubscriptionDateError] = useState('');
    const [costError, setCostError] = useState('');
    const [renewalMonthsError, setRenewalMonthsError] = useState('');
    const [isPremiumUser, setIsPremiumUser] = useState(false);
    const [subscription, setSubscription] = useState({
        appId: '',
        cost: '',
        subscriptionDate: '',
        renewalDate: '',
        reminderEnabled: false,
        subscriptionPeriod: '',
        reminderDate: '',
        reminderDays: 3,
    });

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

      const formatSubsDate = (value) =>{
        const date = new Date(value);
        return date.toISOString().split("T")[0];
      }

    const [isEditMode, setIsEditMode] = useState(!!existingSubscription);
    useEffect(() => {
        // Check if the user is premium
        const premiumStatus = JSON.parse(localStorage.getItem('isPremiumUser'));
        setIsPremiumUser(premiumStatus);


        if (isEditMode && existingSubscription) {
            setIsEditMode(true);
            setSubscription({
                appId: existingSubscription.appId || '',
                cost: existingSubscription.cost || '',
                subscriptionDate: formatSubsDate(existingSubscription.subscriptionDate),
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
    }, [existingSubscription, isEditMode]);

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
    
        setSubscription((prev) => {
            // Handle changes based on user premium status
            if (name === "reminderEnabled" && checked) {
                // Reminder checkbox is checked
                if (!isPremiumUser) {
                    // Non-premium user: set default reminderDays to 3 and calculate reminderDate
                    const calculatedReminderDate = calculateReminderDate(prev.renewalDate, 3);
                    return {
                        ...prev,
                        reminderEnabled: true,
                        reminderDays: 3,
                        reminderDate: calculatedReminderDate
                    };
                } else {
                    // Premium user: allow changing reminderDays
                    return { ...prev, reminderEnabled: true };
                }
            } else if (name === "reminderEnabled" && !checked) {
                // Reminder checkbox is unchecked
                return { ...prev, reminderEnabled: false, reminderDays: '', reminderDate: '' };
            } else if (name === "reminderDays") {
                // Calculate reminderDate whenever reminderDays is changed (only for premium users)
                const days = parseInt(value, 10);
                const calculatedReminderDate = calculateReminderDate(prev.renewalDate, days);
                return {
                    ...prev,
                    reminderDays: value,
                    reminderDate: calculatedReminderDate
                };
            }
    
            return {
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            };
        });
    };

    // Helper function to calculate reminder date
    const calculateReminderDate = (renewalDate, daysBefore) => {
        if (!renewalDate || isNaN(daysBefore)) return '';
        const renewal = new Date(renewalDate);
        renewal.setDate(renewal.getDate() - daysBefore);
        return renewal.toISOString().split('T')[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let valid = true;
        
        console.log("Subs Id = ",subscription.appId);
        if (subscription.appId === "") {
            setAppError("Please select an application." );
            valid = false;
        }else{
            setAppError(" ");
        }
        if (subscription.cost.trim() === "") {
            setCostError("Please enter the cost.");
            valid = false;
        }else{
            setCostError(" ");
        }
        if(subscription.subscriptionDate.trim() === ""){
            setSubscriptionDateError("Please select a subscription date.");
            valid = false;
        }else{
            setSubscriptionDateError("");
        }
        if(subscription.renewalMonths === ""){
            setRenewalMonthsError("Please select renewal months.");
            valid = false;
        }else{
            setRenewalMonthsError("");
        }

        if (!valid) return;

        const apiUrl = isEditMode
            ? `http://localhost:5000/api/subscription/${existingSubscription.subscriptionId}/update`
            : 'http://localhost:5000/api/subscription/add';
        
        const method = isEditMode ? 'PUT' : 'POST';

        const updatedSubscription = isEditMode
        ? { ...existingSubscription, ...subscription }
        : subscription;

        console.log("Updated subs details - ",updatedSubscription);

        try {
            const response = await fetch(apiUrl, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSubscription)
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
                    <select name="appId" value={subscription.appId} onChange={handleChange} disabled={isEditMode} className="select-dropdown">
                        <option value="">Select an app</option>
                        {Object.entries(
                            apps.reduce((acc, app) => {
                                const category = app.categoryDetails.category;
                                if (!acc[category]) acc[category] = [];
                                acc[category].push(app);
                                return acc;
                            }, {})
                        ).map(([category, categoryApps]) => (
                            <optgroup key={category} label={category}>
                                {categoryApps.map((app) => (
                                    <option key={app.appId} value={app.appId}>{app.appName}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                    {appError && <p className="error-text">{appError}</p>}
                </label>


                <label>
                    Cost:
                    <input type="text" name="cost" value={subscription.cost} onChange={handleCostChange} />
                    {costError && <p className="error-text">{costError}</p>}
                </label>
                <label>
                    Subscription Date:
                    <input type="date" name="subscriptionDate" value={subscription.subscriptionDate} onChange={handleChange} max={new Date().toISOString().split("T")[0]} />
                    {subscriptionDateError && <p className="error-text">{subscriptionDateError}</p>}
                </label>
                <label>
                    Subscription Period (Months):
                    <select name="renewalMonths" value={subscription.renewalMonths} onChange={handleChange} >
                        <option value="">Select subscribed months</option>
                        <option value="1">1</option>
                        <option value="3">3</option>
                        <option value="6">6</option>
                        <option value="9">9</option>
                        <option value="12">12</option>
                    </select>
                    {renewalMonthsError && <p className="error-text">{renewalMonthsError}</p>}
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
                            <input type="number" name="reminderDays" value={subscription.reminderDays} onChange={handleChange} min="1" max="7" disabled={!isPremiumUser}/>
                        </label>
                        <label>
                            Reminder Date:
                            <input type="date" name="reminderDate" value={subscription.reminderDate} readOnly />
                        </label>
                    </>
                )}
                <div className="form-buttons">
                    <button type="submit" className="add-subscription-btn">
                        {isEditMode ? 'Update Subscription' : 'Add Subscription'}
                    </button>
                    
                    <button type="button" onClick={handleCancel} className="cancel-btn">
                        Cancel
                    </button>
                    
                </div>
            </form>
        </div>
    );
};

export default AddSubscriptionPage;
