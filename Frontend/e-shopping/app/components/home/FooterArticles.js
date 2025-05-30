import styles from '../../styles/styles.module.css';
import FooterArticleCard from './FooterArticleCard';
import Image from 'next/image';


export default function FooterArticles({footerArticles}) {
    return (
        <div className={styles.banner}>
            <div className="container-fluid row m-0">
                {footerArticles.map((p, i) => (
                <div key={i} className="col-md-3 col-sm-6 p-0">
                    <FooterArticleCard product={p} />
                </div>
                ))}
            </div>
            <div className={`${styles.showcase}`}>
                <Image src="/images/BannerFooter.jpg" alt="Banner" fill style={{ objectFit: 'cover' }} />
            </div>
        </div>
    );
}
