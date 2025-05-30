"use client";
import ContactInfo from '../components/contact/ContactInfo';
import ContactForm from '../components/contact/ContactForm';
import styles from '../styles/styles.module.css';

export default function Contact() {
    return (
        <div className={styles.contactPage}>
            <h1 className="text-center fw-bolder">Contactez-nous</h1>
            <div className="row mt-4">
                <div className="col-md-4">
                <ContactInfo />
                </div>
                <div className="col-md-8">
                <ContactForm />
                </div>
            </div>
        </div>
    );
}