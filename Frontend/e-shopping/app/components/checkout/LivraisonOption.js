'use client'
import styles from '../../styles/styles.module.css'

const LivraisonOption = ({ option, selected, setSelected }) => {
    const isActive = selected === option.id

    return (
        <div
            className={`${styles.option} ${isActive ? styles.active : ''}`}
            onClick={() => setSelected(option.id)}
        >
        <input type="radio" name="livraison" checked={isActive} readOnly />
        <div className="ms-2">
            <span className="fw-bold">{option.label}</span> <span className="text-muted">{option.description}</span>
        </div>
            <div className="ms-auto text-end">{option.date}</div>
        </div>
    )
}

export default LivraisonOption
