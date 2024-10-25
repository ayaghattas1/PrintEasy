import React, { useEffect, useState } from 'react';
import { 
  MDBCard, 
  MDBCardBody, 
  MDBCardTitle, 
  MDBCardText, 
  MDBCardImage, 
  MDBBtn 
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { BsFillArchiveFill } from 'react-icons/bs';
import axios from 'axios'; 
import { Modal, Button } from 'react-bootstrap';
import Slider from 'react-slick'; 
import '../App.css';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

function Dashboard() {
    const [produits, setProduits] = useState([]);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const [selectedProduit, setSelectedProduit] = useState({});

    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const { data } = await axios.get('/produit/getProd'); 
                setProduits(data.produits); 
            } catch (error) {
                console.error("Erreur lors de la récupération des produits :", error);
            }
        };

        fetchProduits();
    }, []);  

    const handleCloseProductDetails = () => setShowProductDetails(false);
    const handleShowProductDetails = (produit) => {
        setSelectedProduit(produit);
        setShowProductDetails(true);
    };

    const handleAddToCart = async (produitId) => {
        try {
            await axios.post(`/addToPanier/${produitId}`);
            alert('Produit ajouté au panier avec succès !');
        } catch (error) {
            console.error("Erreur lors de l'ajout au panier :", error);
        }
    };

    const sliderSettings = {
        dots: true, // Affiche les points en dessous
        infinite: true, // Boucle infinie
        speed: 500, // Vitesse de défilement
        slidesToShow: 1, // Nombre de cartes à afficher par slide
        slidesToScroll: 1, // Nombre de cartes à défiler par clic
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
        ],
    };

    return (
        <main className='main-container'>
            <div className='main-title'>
                <h1>Dashboard</h1>
            </div>

            {/* Section for Custom Design */}
            <section className='section-container'>
                <h4>Design personnalisé</h4>
                <p>Créez vos propres designs pour cartes de visite, flyers, T-shirts, et plus encore.</p>
                <Link to="/DesignPerso">
                    <MDBBtn color="primary">Créer un Design</MDBBtn>
                </Link>
            </section>

            {/* Section for Digital Printing (Tirage numérique) */}
            <section className='section-container'>
                <h4>Tirage numérique</h4>
                <p>Effectuez des impressions numériques de qualité professionnelle.</p>
                <Link to="/impressions">
                    <MDBBtn color="warning">Voir les impressions</MDBBtn>
                </Link>
            </section>

            {/* Section for Products */}
            <section className='section-container'>
                <h4>Produits</h4>
                <p>Explorez notre catalogue de produits disponibles.</p>
                <Link to="/produits">
                    <MDBBtn color="success">Voir les produits</MDBBtn>
                </Link>

                {/* Slider to display featured products */}
                <div className='main-cards'>
                    <Slider {...sliderSettings}>
                        {produits.map((produit) => (
                            <div key={produit._id} style={{ padding: '0 10px' }}>
                                <MDBCard className='card' style={{ width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
                                    <MDBCardImage 
                                        src={`http://localhost:5000${produit.image}`} 
                                        position='top' 
                                        alt={produit.nom} 
                                        style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }} // Ajustement des images
                                    />
                                    <MDBCardBody>
                                        <MDBCardTitle>{produit.nom}</MDBCardTitle>
                                        <MDBCardText className='description-text'>
                                            {produit.description}
                                        </MDBCardText>
                                        <MDBCardText>
                                            <strong>Prix: </strong>{produit.prix} DT
                                        </MDBCardText>
                                        <div className="card-actions">
                                            <MDBBtn onClick={() => handleShowProductDetails(produit)}>
                                                <BsFillArchiveFill className='card_icon'/> Détails
                                            </MDBBtn>
                                            {/* Bouton pour ajouter au panier */}
                                            <MDBBtn className="mt-2" color="success" onClick={() => handleAddToCart(produit._id)}>
                                                Ajouter au panier
                                            </MDBBtn>
                                        </div>
                                    </MDBCardBody>
                                </MDBCard>
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>

            {/* Modal for displaying product details */}
            <Modal show={showProductDetails} onHide={handleCloseProductDetails}>
                <Modal.Header closeButton>
                    <Modal.Title>Détails</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Nom: {selectedProduit.nom}</h5>
                    <p>Description: {selectedProduit.description}</p>
                    <p>Prix: {selectedProduit.prix} DT</p>
                    <p>Quantité: {selectedProduit.quantite}</p>
                    <img 
                        src={`http://localhost:5000${selectedProduit.image}`} 
                        alt={selectedProduit.nom}
                        style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseProductDetails}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </main>
    );
}

export default Dashboard;
