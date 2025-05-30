'use client';

import { useState, useEffect } from 'react';
import styles from './dashboard.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
} from 'chart.js';
import {
    FaUsers,
    FaShoppingBag,
    FaChartLine
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
);

// Données et options du graphique
const chartData = {
    labels: ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aout", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
        label: 'Ventes (en $)',
        data: [70,25,30,45,85],
        fill: true,
        tension: 0.4,
        backgroundColor: 'rgba(94,114,228,0.1)',
        borderColor: 'rgba(94,114,228,1)',
        pointBackgroundColor: '#5E72E4',
        pointRadius: 4
    }]
};

const chartOptions = {
    scales: {
        y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: v => v + 'K $CA' },
        grid: { color: '#E9ECEF' }
        },
        x: {
        grid: { color: '#E9ECEF' }
        }
    },
    plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${ctx.parsed.y}%` } }
    },
    responsive: true,
    maintainAspectRatio: false
};

export default function DashboardPage() {

    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [sales, setSales] = useState(0);

    const { user } = useAuth();


    const getUsers = async () => {
        try {
            const res = await fetch('https://eshop-api-web.up.railway.app/api/Users',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    }
                }
            );
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
        }
    }

    const getOrders = async () => {
        try {
            const res = await fetch('https://eshop-api-web.up.railway.app/api/Commandes',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
        }
    }

    const getSales =  () => {
        let ventes = 0;
        if(orders.length > 0) {
            orders.forEach(order => {
                ventes += order.montant;
            });
        }
        setSales(ventes);
    }

    useEffect(() => {
        getUsers();
        getOrders();
        if(orders.length > 0) {
            getSales();
        }
    }, [orders, users]);

    const total = +(sales.toFixed(2));

    const totalAffiche = total.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'CAD',
    });
    return (
        <>
        {
            (users  && orders  ) ? (
                <div className={`container-fluid `}>
                    <div className="row">
                        {/* Main */}
                        <main className={`col-12 col-md-10 p-4 ${styles.main}`}>
                        {/* Stat cards */}
                        <div className="row g-4 mb-4">
                            <div className="col-12 col-sm-4">
                            <div className={styles.card}>
                                <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <small className="text-muted fw-bold">Utilisateurs</small>
                                    <h4 className="mt-1">{users.length > 0 ? users.length : 0}</h4>
                                </div>
                                <div className={styles.iconWrapper}>
                                    <FaUsers size={24} />
                                </div>
                                </div>
                            </div>
                            </div>
                            <div className="col-12 col-sm-4">
                            <div className={styles.card}>
                                <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <small className="text-muted fw-bold">Commandes</small>
                                    <h4 className="mt-1">{orders.length > 0 ? orders.length : 0}</h4>
                                </div>
                                <div className={styles.iconWrapperWarn}>
                                    <FaShoppingBag size={24} />
                                </div>
                                </div>
                            </div>
                            </div>
                            <div className="col-12 col-sm-4">
                            <div className={styles.card}>
                                <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <small className="text-muted fw-bold">Ventes</small>
                                    <h4 className="mt-1">{orders.length > 0 ? totalAffiche : 0}</h4>
                                </div>
                                <div className={styles.iconWrapperSuccess}>
                                    <FaChartLine size={24} />
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className={styles.chartCard}>
                            <h2 className="mb-3 fw-bold text-center">Ventes Mensuelles</h2>
                            <div className="d-flex justify-content-end mb-3">
                                <select className="form-select form-select-sm w-auto">
                                    <option>2025</option>
                                    <option>2024</option>
                                    <option>2023</option>
                                </select>
                            </div>
                            <div className={styles.chartContainer}>
                                <Line data={chartData} options={chartOptions} />
                            </div>
                        </div>
                        </main>
                    </div>
                </div>
            ) : (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )
                
        }
        </>
    );
}
