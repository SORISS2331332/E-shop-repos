import styles from '../../styles/styles.module.css';
import Image from 'next/image'

export default function Story() {
    return (
        <section className={`container mt-5 py-5 ${styles.story}`}>
        <div className="row align-items-center mt-4">
            <div className="col-md-6">
            <h2 className="mb-4">Notre histoire</h2>
            <p>
                Lancée en 2025, E-Shop est une entreprise de vente en ligne de 
                produits électroniques de haute qualité. Notre mission est de fournir une 
                plateforme en ligne fiable et facile d'utilisation pour les 
                amateurs de produits de haute technologie.
            </p>
            <p>
                E-Shop est fondee par  un groupe de passionnés de technologie et de 
                produits de haute qualite. Avec leur expertise et leur savoir-faire, 
                ils ont fait de E-Shop un lieu de choix pour plus d'un milliard de 
                amateurs de produits de haute technologie.
            </p>
            </div>
            <div className="col-md-6 text-center">
            <Image
                src="/images/about/logo.jpg"
                alt="Notre histoire"
                width={400}
                height={500}
            />
            </div>
        </div>
        </section>
    )
}
