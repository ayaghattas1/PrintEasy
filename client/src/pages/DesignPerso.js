import React from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';
import '../Css/DesignPerso.css' ;


function DesignPerso() {
    return (
        <MDBContainer fluid className='custom-design'>
            <h1 className='text-center my-4'>Design Personnalisé</h1>
            <MDBRow className='mb-5'>
                <MDBCol md='6'>
                    <MDBCard>
                        <MDBCardBody>
                            <MDBCardTitle>Cartes de Visite</MDBCardTitle>
                            <MDBCardText>
                                Créez des cartes de visite uniques pour représenter votre marque.
                            </MDBCardText>
                            <MDBBtn color='primary'>Commencer</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md='6'>
                    <MDBCard>
                        <MDBCardBody>
                            <MDBCardTitle>Flyers</MDBCardTitle>
                            <MDBCardText>
                                Concevez des flyers accrocheurs pour promouvoir vos événements.
                            </MDBCardText>
                            <MDBBtn color='primary'>Commencer</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
            <MDBRow className='mb-5'>
                <MDBCol md='6'>
                    <MDBCard>
                        <MDBCardBody>
                            <MDBCardTitle>T-shirts</MDBCardTitle>
                            <MDBCardText>
                                Imprimez vos designs sur des T-shirts de qualité.
                            </MDBCardText>
                            <MDBBtn color='primary'>Commencer</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md='6'>
                    <MDBCard>
                        <MDBCardBody>
                            <MDBCardTitle>Mugs</MDBCardTitle>
                            <MDBCardText>
                                Personnalisez des mugs pour un cadeau parfait.
                            </MDBCardText>
                            <MDBBtn color='primary'>Commencer</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
            <div className='gallery-section'>
    <h2 className='text-center'>Inspiration de Design</h2>
    <MDBRow className='image-row'>
        <MDBCol md='2'>
            <img src='https://i0.wp.com/www.teewinek.com/wp-content/uploads/2021/01/Mug-MAGIQUE-personnalise-en-tunisietass-personnalise-2021.jpg?fit=601%2C601&ssl=1' alt='Inspiration 1' className='gallery-image' />
        </MDBCol>
        <MDBCol md='2'>
            <img src='https://i0.wp.com/www.teewinek.com/wp-content/uploads/2021/01/t-shirt-personnalise-en-tunisie-impression-flexserigraphie.jpg?fit=601%2C601&ssl=1' alt='Inspiration 2' className='gallery-image' />
        </MDBCol>
        <MDBCol md='2'>
            <img src='https://i0.wp.com/www.teewinek.com/wp-content/uploads/2022/03/Achetez-en-ligne-votre-Tote-Bags-personnalises-en-tunisie-tote-bag-imprime-avec-teewinek.png?fit=700%2C700&ssl=1' alt='Inspiration 3' className='gallery-image' />
        </MDBCol>
        <MDBCol md='2'>
            <img src='https://i0.wp.com/www.teewinek.com/wp-content/uploads/2022/03/Achetez-en-ligne-votre-Tote-Bags-personnalises-en-tunisie-tote-bag-imprime-avec-teewinek.png?fit=700%2C700&ssl=1' alt='Inspiration 4' className='gallery-image' />
        </MDBCol>
        <MDBCol md='2'>
            <img src='https://png.pngtree.com/templates/sm/20180313/sm_5aa747931805c.jpg' alt='Inspiration 5' className='gallery-image' />
        </MDBCol>
    </MDBRow>
</div>

                
            
            <div className='contact-form'>
                <h2 className='text-center my-4'>Nous Contacter</h2>
                <form>
                    <MDBRow className='my-3'>
                        <MDBCol md='12'>
                            <textarea placeholder='Votre message' className='form-control' rows='4' required></textarea>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md='12'>
                            <MDBBtn type='submit' color='primary'>Envoyer</MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </form>
            </div>
        </MDBContainer>
    );
}

export default DesignPerso;
