import React, { useEffect, useState, useContext  } from 'react'; 
import { 
  MDBCard, 
  MDBCardBody, 
  MDBCardTitle, 
  MDBCardText, 
  MDBCardImage, 
  MDBBtn 
} from 'mdb-react-ui-kit';
import { BsFillArchiveFill } from 'react-icons/bs';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import '../App.css';
import { CartContext } from '../components/CartContext';

function Produits() {
    const [produits, setProduits] = useState([]);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const [newProduit, setNewProduit] = useState({
        nom: '',
        description: '',
        prix: '',
        image: '',
        quantite: ''
    });
    const [selectedProduit, setSelectedProduit] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/user/current', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.status === 200) {
                        const currentUser = response.data;
                        console.log("Current User:", currentUser); // Log pour vérifier l'utilisateur
                        setIsAdmin(currentUser.role === 'admin');
                    }
                } catch (error) {
                    console.error('Error fetching user info:', error);
                }
            }
        };
    
        fetchUserRole();
    }, []);

    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const response = await axios.get('/produit/getProd'); 
                setProduits(response.data.produits); 
            } catch (error) {
                console.error("Erreur lors de la récupération des produits :", error);
            }
        };

        fetchProduits();
    }, []);

    const handleCloseAddProduct = () => setShowAddProduct(false);
    const handleShowAddProduct = () => setShowAddProduct(true);
    const handleCloseProductDetails = () => setShowProductDetails(false);
    const handleShowProductDetails = (produit) => {
        setSelectedProduit(produit);
        setShowProductDetails(true);
    };

    const handleChange = (e) => {
        setNewProduit({ ...newProduit, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setNewProduit({ ...newProduit, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nom', newProduit.nom);
        formData.append('description', newProduit.description);
        formData.append('prix', newProduit.prix);
        formData.append('image', newProduit.image);
        formData.append('quantite', newProduit.quantite);

        try {
            const response = await axios.post('/produit/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProduits([...produits, response.data.produit]);
            handleCloseAddProduct();
            alert('Produit ajouté avec succès !');
        } catch (error) {
            console.error('Erreur lors de l\'ajout du produit:', error);
            alert('Une erreur s\'est produite lors de l\'ajout du produit.');
        }
    };

    const handleAddToCart = async (produit) => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.post(`/panier/addToPanier/${produit._id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            addToCart(produit); // Ajoute localement après succès de l'API
            alert('Produit ajouté au panier');
          }
        } catch (error) {
          console.error('Erreur lors de l\'ajout au panier', error);
        }
      };

    return (
        <main className='main-container'>
            <div className='main-title'>
                <h1>Les Produits</h1>
                {isAdmin && (
                    <MDBBtn onClick={handleShowAddProduct}>Ajouter un Produit</MDBBtn>
                )}
            </div>

            <div className='main-cards'>
                {produits.map((produit) => (
                    <MDBCard className='card' key={produit._id}>
                        <MDBCardImage 
                            src={`http://localhost:5000${produit.image}`} 
                            position='top' 
                            alt={produit.nom} 
                        />
                        <MDBCardBody>
                            <MDBCardTitle>{produit.nom}</MDBCardTitle>
                            <MDBCardText className='description-text'>{produit.description}</MDBCardText>
                            <MDBCardText>Prix: {produit.prix} DT</MDBCardText>
                            <div className="card-actions">
                                <MDBBtn onClick={() => handleShowProductDetails(produit)}>
                                    <BsFillArchiveFill className='card_icon'/> Détails
                                </MDBBtn>
                                <MDBBtn className="mt-2" color="success" onClick={() => handleAddToCart(produit)}>
                                    Ajouter au panier
                                </MDBBtn>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                ))}
            </div>

            <Modal show={showAddProduct} onHide={handleCloseAddProduct}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un Produit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNom">
                            <Form.Label>Nom du Produit</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le nom"
                                name="nom"
                                value={newProduit.nom}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Entrez la description"
                                name="description"
                                value={newProduit.description}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPrix">
                            <Form.Label>Prix</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le prix"
                                name="prix"
                                value={newProduit.prix}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formImage">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                name="image"
                                onChange={handleFileChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formQuantite">
                            <Form.Label>Quantité</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Entrez la quantité"
                                name="quantite"
                                value={newProduit.quantite}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            Ajouter
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

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

export default Produits;
