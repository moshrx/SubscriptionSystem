import React from 'react';
import '../styles/upgradeModal.css';

const UpgradeModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // Only render if modal is open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>&times;</button> {/* Close button */}
                <div className="modal-header">
                    <h2>Upgrade to Premium</h2>
                    <p>Manage all your subscriptions seamlessly. Choose a plan that fits your needs and take full control of your renewals.</p>
                </div>
                <div className="plans-container">
                    <div className="plan-card">
                        <h3>Basic</h3>
                        <p>Get started with essential features for organizing subscriptions.</p>
                        <ul>
                            <li>✓ Track up to 5 subscriptions</li>
                            <li>✓ Standard renewal alerts</li>
                            <li>✓ Basic reminder settings</li>
                        </ul>
                    </div>
                    <div className="plan-card">
                        <h3>Premium</h3>
                        <p>Unlock advanced tools to manage unlimited subscriptions effortlessly.</p>
                        <ul>
                            <li>✓ Unlimited subscriptions</li>
                            <li>✓ Customizable renewal reminders</li>
                            <li>✓ Priority support and new feature access</li>
                        </ul>
                        <p className="price">$9.99<br/><span>/mo billed monthly</span></p>
                    </div>
                </div>
                <button className="btn-upgrade" onClick={() => alert("Upgrade process here")}>Upgrade</button> {/* Central Upgrade button */}
            </div>
        </div>
    );
};

export default UpgradeModal;
