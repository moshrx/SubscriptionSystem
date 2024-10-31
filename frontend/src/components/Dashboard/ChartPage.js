import React, { useEffect, useState } from 'react';
import { getDashboardDetails } from '../../api';
import '../../styles/styles.css';
import { Link } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the data labels plugin
import Subscription from '../Subscription';
import { colors } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    ChartDataLabels // Register the plugin
);

const ChartPage = ({ userId, token }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [apps, setApps] = useState([]);
    const [totalExpense, setTotalExpense] = useState(0);
    const [mostExpensiveApp, setMostExpensiveApp] = useState('');
    const [latestRenewalDate, setLatestRenewalDate] = useState('');
    const [latestRenewalAppName, setLatestRenewalAppName] = useState('');

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const fetchDashboardDetails = async () => {
            if (!storedUserId) {
                console.log('userId is undefined');
                return;
            }

            try {
                const data = await getDashboardDetails(storedUserId, token);
                console.log(data); // Log the entire response

                if (!data || !data.subscriptions || !data.apps || !data.totalExpense) {
                    console.error('Expected data is missing or empty:', data);
                    return;
                }

                setSubscriptions(data.subscriptions);
                setApps(data.apps);
                setTotalExpense(data.totalExpense);
                setMostExpensiveApp(data.mostExpensiveApp || 'N/A');
                setLatestRenewalDate(data.latestRenewalDate || 'N/A');
                setLatestRenewalAppName(data.latestRenewalAppName || 'N/A');
            } catch (error) {
                console.error("Error fetching dashboard details:", error);
            }
        };

        fetchDashboardDetails();
    }, [userId, token]);

    const chartData = {
        labels: apps.map(app => app.appName || app.appId), // Use app names or IDs
        datasets: [
            {
                label: '',
                data: apps.map(app => {
                    const subscription = subscriptions.find(sub => sub.appId === app.appId);
                    const cost = subscription ? (subscription.cost?.$numberDecimal ? parseFloat(subscription.cost.$numberDecimal) : 0) : 0;
                    console.log(`App: ${app.appName}, Cost: $${cost}`); // Log each app's cost
                    return cost;
                }),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'],
            },
        ],
    };

    console.log('Chart Data:', chartData); // Log the final chart data

    return (
        <div className="chart-page">
            <div className="dashboard-overview">
                <div className="widget">
                    <h3>Total Subscription Expense</h3>
                    <p>${totalExpense.toFixed(2)}</p>
                </div>
                <div className="widget">
                    <h3>Most Expensive Application</h3>
                    <p>{mostExpensiveApp || 'N/A'}</p>
                </div>
                <div className="widget">
                    <h3>Upcoming Renewal</h3>
                    <Link to="/subscriptions" className="upcoming-renewal-link">
                        <p>{latestRenewalAppName || 'N/A'}</p>
                        <p>{latestRenewalDate || 'N/A'}</p>
                    </Link>
                </div>
            </div>

            <div className="dashboard-charts">
                <div className="chart-container">
                    <h3 >Subscribed Applications</h3>
                    <Bar data={chartData} options={{ indexAxis: 'x', maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
};

export default ChartPage;
