import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import '../styles/paymentsPage.css';

// Load Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51QHsJ2G0z5dm3mYn4KjgN5Aa5LwZBs43BD49tuJfJPyswVsIpVQThxtjfQXygYSfTvv8t85H9vL3dCqjROasghql00H65ZAPec');

const PaymentsPage = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const [duration, setDuration] = useState(1); // Default to 1 month
    const [loading, setLoading] = useState(false); // Loading state
    const costPerMonth = 9.99;
    const totalAmount = (duration * costPerMonth).toFixed(2);

    const handleDurationChange = (event) => {
        setDuration(Number(event.target.value));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/payments/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, duration, totalAmount: totalAmount * 100 }),
            });
            const { clientSecret } = await response.json();

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { name: 'User Name' },
                },
            });

            if (error) {
                console.error('Payment error:', error);
                showFailedToastNotification('Payment failed. Please try again.');
                navigate('/payments');
                setLoading(false);
            } else if (paymentIntent.status === 'succeeded') {
                showSuccessToastNotification("Payment successful! Welcome to Premium!");

            const subscriptionDate = new Date();
            const renewalDate = new Date();
            renewalDate.setMonth(renewalDate.getMonth() + duration);

                setTimeout(async () => {
                    await fetch('http://localhost:5000/api/users/update-premium-status', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, isPremium: true, subscriptionDate, renewalDate }),
                    });
                    setLoading(false);
                    localStorage.setItem("isPremiumUser", true);
                    window.dispatchEvent(new Event("storage"));
                    navigate('/dashboard');
                }, 3000);
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            showFailedToastNotification('Payment failed. Please try again.');
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const showSuccessToastNotification = (message) => {
        const notification = document.createElement("div");
        notification.className = "success-toast-notification";
        notification.innerText = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    const showFailedToastNotification = (message) => {
        const notification = document.createElement("div");
        notification.className = "failed-toast-notification";
        notification.innerText = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="payment-page">
            <h2>Select Your Subscription Duration</h2>
            <div className="radio-group">
                {[1, 3, 6, 9, 12].map((months) => (
                    <label key={months}>
                        <input
                            type="radio"
                            name="duration"
                            value={months}
                            checked={duration === months}
                            onChange={handleDurationChange}
                        />
                        {months} {months === 1 ? 'month' : 'months'}
                    </label>
                ))}
            </div>

            <h3>Total: ${totalAmount}</h3>

            <CardElement
                className="StripeElement"
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': { color: '#aab7c4' },
                        },
                        invalid: { color: '#9e2146' },
                    },
                }}
            />
            <button
                type="submit"
                disabled={!stripe}
                className="pay-now-button"
            >
                Pay ${totalAmount}
            </button>

            {loading && <div className="loading-screen">Processing payment...</div>}
        </form>
    );
};

export default PaymentsPage;
