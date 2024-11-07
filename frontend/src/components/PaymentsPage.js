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
    const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);

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
                // Log the error message
                console.error('Payment error:', error.message);
    
                // Check for specific Stripe error codes to provide clearer feedback
                if (error.type === 'card_error' || error.type === 'validation_error') {
                    showFailedToastNotification(`Payment failed: ${error.message}`);
                } else {
                    showFailedToastNotification('Payment failed due to a technical issue. Please try again.');
                }
                navigate('/payments');
                setLoading(false);
            } else if (paymentIntent.status === 'succeeded') {

                setIsPaymentCompleted(true);
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
        setTimeout(() => notification.classList.add("success-toast-visible"), 10);

        setTimeout(() => {
            notification.classList.remove("success-toast-visible");
            setTimeout(() => notification.remove(), 300);
        }, 3000); // 3 seconds visible time
    };

    const showFailedToastNotification = (message) => {
        const notification = document.createElement("div");
        notification.className = "failed-toast-notification";
        notification.innerText = message;
    
        document.body.appendChild(notification);
    
        // Trigger transition by adding visible class after append
        setTimeout(() => notification.classList.add("failed-toast-visible"), 10);
    
        setTimeout(() => {
            notification.classList.remove("failed-toast-visible");
            setTimeout(() => notification.remove(), 300);
        }, 3000); // 3 seconds visible time
    };

    return (
        <div className="payment-page">
            <div className="premium-benefits">
                <h2>Unlock Premium Benefits</h2>
                <p>Upgrade now and enjoy the following features:</p>
                <br/>
                <ul>
                    <li>✓ Unlimited subscription management</li>
                    <li>✓ Customizable renewal reminders</li>
                    <li>✓ Priority support and early access to new features</li>
                </ul>
            </div>

            <form onSubmit={handleSubmit} className="payment-form">
                <h3>Select Your Subscription Duration</h3>
                <div className="radio-group-container">
                    <label className="group-label">Months</label>
                    <div className="radio-group">
                        {[1, 3, 6, 9, 12].map((months) => (
                            <label key={months} className="radio-label">
                                <input
                                    type="radio"
                                    name="duration"
                                    value={months}
                                    checked={duration === months}
                                    onChange={handleDurationChange}
                                />
                                {months}
                            </label>
                        ))}
                    </div>
                </div>

                <h4>Total Amount Due: ${totalAmount}</h4>

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
                    disabled={!stripe || loading || isPaymentCompleted}
                    className={`pay-now-button ${loading || isPaymentCompleted ? 'button-disabled' : ''}`}
                >
                    Pay ${totalAmount}
                </button>

                {loading && <div className="loading-screen">Processing payment...</div>}
            </form>
        </div>
    );
};

export default PaymentsPage;
