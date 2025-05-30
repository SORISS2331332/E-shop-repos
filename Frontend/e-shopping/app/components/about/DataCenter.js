import styles from '../../styles/styles.module.css';
import {FaShoppingBag, FaUsers, FaDollarSign } from 'react-icons/fa'

const stats = [
    {
        icon: <FaDollarSign />,
        value: '33k',
        label: 'Ventes mensuelles'
    },
    {
        icon: <FaUsers />,
        value: '45.5k',
        label: 'Clients actifs',
        highlight: true
    },
    {
        icon: <FaShoppingBag />,
        value: '25k',
        label: 'Produits vendus par mois',
    }
]

export default function DataCenter() {
    return (
        <section className={`container py-5 ${styles.dataCenter}`}>
        <div className="row text-center justify-content-center">
            {stats.map((stat, idx) => (
            <div className="col-6 col-md-4 mb-4" key={idx}>
                <div className={`${styles.statCard} ${stat.highlight ? styles.highlight : ''}`}>
                <div className={styles.icon}>{stat.icon}</div>
                <h4 className="fw-bold">{stat.value}</h4>
                <p>{stat.label}</p>
                </div>
            </div>
            ))}
        </div>
        </section>
    )
}
