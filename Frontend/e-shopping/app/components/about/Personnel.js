import Image from 'next/image'
import styles from '../../styles/styles.module.css';
import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

const people = [
    {
        name: 'Emma Velaryon',
        title: 'Directrice de la communication',
        image: '/images/about/emma.jpg',
    },
    {
        name: 'Warou',
        title: 'Directeur des Ventes',
        image: '/images/about/tom.jpg',
    },
    {
        name: 'Issouf',
        title: 'Directeur Technique',
        image: '/images/about/will.jpg',
    },
]

export default function Personnel() {
    return (
        <section className={`container py-5 ${styles.personnel}`}>
        <div className="row text-center">
            {people.map((person, idx) => (
            <div className="col-12 col-md-4 mb-4" key={idx}>
                <Image
                src={person.image}
                alt={person.name}
                width={250}
                height={300}
                className="mb-3"
                />
                <h5>{person.name}</h5>
                <p className="text-muted">{person.title}</p>
                <div className="d-flex justify-content-center gap-3">
                <FaTwitter />
                <FaInstagram />
                <FaLinkedin />
                </div>
            </div>
            ))}
        </div>
        </section>
    )
}
