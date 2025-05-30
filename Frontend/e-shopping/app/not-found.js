import React from 'react';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
const ErrorPage = () => {
    return (
        <div className="container" style={{ flexGrow: 1, marginTop: '120px' }}>
            <img src="/images/autres/not-found.gif" alt="404" className='d-block mx-auto w-25' />
            <h1 className='text-center'>OUPS ! PAGE INTROUVABLE</h1>
            <p className='text-center' >La page que vous recherchez n'existe pas.</p>
            <Button as={Link} href="/" variant="dark" className='d-block mx-auto w-25'>
                Accueil
            </Button>
        </div>
    );
};

export default ErrorPage;