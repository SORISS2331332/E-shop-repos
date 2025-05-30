'use client';
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import styles from '../../styles/styles.module.css';

const Banner = () => {

    return (
        <section className={styles.bannerContainer}>
            
            <Container fluid className="px-0">
                <Row className="g-0">
                <Col xs={12}>
                    <div className={styles.iphoneSection}>
                    <div className={styles.iphoneOverlay}>
                        <h1 className="text-white display-5 fw-bold mb-3">
                        Pro.Beyond.<br />iPhone 14 Pro
                        </h1>
                    </div>
                    </div>
                </Col>
                </Row>
            </Container>

            <Container fluid className="px-0">
                <Row className="g-0">
                    <Col xs={12} md={6}>
                        <Row className="g-0">
                            <Col xs={12}>
                                <div className={styles.ps5Block}>
                                    <div className={styles.overlayText}>
                                        <h2 className="text-white fw-bold  fs-4 mb-2">Playstation 5</h2>
                                    </div>
                                </div>
                            </Col>

                            <Col xs={6}>
                                <div className={styles.airpodsBlock}>
                                    <div className={styles.overlayText}>
                                        <h2 className="text-white fw-bolder fs-8 mb-2">AirPods Max</h2>
                                       
                                    </div>
                                </div>
                            </Col>
                            <Col xs={6}>
                                <div className={styles.visionBlock}>
                                <div className={styles.overlayText}>
                                    <h2 className="text-white fw-bolder fs-8 mb-2">Vision Pro</h2>
                                    
                                </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>

                    <Col xs={12} md={6}>
                        <div className={styles.macbookBlock}>
                        <div className={styles.overlayText}>
                            <h2 className="text-white fs-4 mb-2">MacBook Air</h2>
                            
                        </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Banner;
