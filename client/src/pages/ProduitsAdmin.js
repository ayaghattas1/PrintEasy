import React, { useEffect, useState } from 'react'; 
import { 
  MDBCard, 
  MDBCardBody, 
  MDBCardTitle, 
  MDBCardText, 
  MDBCardImage, 
  MDBBtn 
} from 'mdb-react-ui-kit';
import { BsFillArchiveFill, BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import '../App.css';

function ProduitsAdmin() {
    const [produits, setProduits] = useState([]);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showUpdateProduct, setShowUpdateProduct] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false);  // Initialize this variable
    const [newProduit, setNewProduit] = useState({
        nom: '',
        description: '',
        prix: '',
        image: '',
        quantite: ''
    });
    const [selectedProduit, setSelectedProduit] = useState({});

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
    const handleCloseUpdateProduct = () => setShowUpdateProduct(false);
    const handleShowUpdateProduct = (produit) => {
        setSelectedProduit(produit);
        setNewProduit(produit);  // Pre-fill the form with the selected product data
        setShowUpdateProduct(true);
    };
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

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nom', newProduit.nom);
        formData.append('description', newProduit.description);
        formData.append('prix', newProduit.prix);
        formData.append('image', newProduit.image);  
        formData.append('quantite', newProduit.quantite);

        try {
            const token = localStorage.getItem('authToken');  
            const response = await axios.post('/produit/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,  
                }
            });
            setProduits([...produits, response.data.produit]);
            handleCloseAddProduct();
            alert('Produit ajouté avec succès !');
        } catch (error) {
            console.error('Erreur lors de l\'ajout du produit:', error);
            alert('Une erreur s\'est produite lors de l\'ajout du produit.');
        }
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nom', newProduit.nom);
        formData.append('description', newProduit.description);
        formData.append('prix', newProduit.prix);
        if (typeof newProduit.image === 'object') {
            formData.append('image', newProduit.image);  // Only append if it's a file object
        }
        formData.append('quantite', newProduit.quantite);

        try {
            const token = localStorage.getItem('authToken');  
            const response = await axios.patch(`/produit/updateProd/${selectedProduit._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,  
                }
            });
            setProduits(produits.map(p => p._id === selectedProduit._id ? response.data.produit : p));
            handleCloseUpdateProduct();
            alert('Produit modifié avec succès !');
        } catch (error) {
            console.error('Erreur lors de la modification du produit:', error);
            alert('Une erreur s\'est produite lors de la modification du produit.');
        }
    };

    const handleDeleteProduct = async (id) => {
        const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?');
        if (confirmDelete) {
            try {
                const token = localStorage.getItem('authToken');  
                await axios.delete(`/produit/deleteProd/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setProduits(produits.filter(produit => produit._id !== id));
                alert('Produit supprimé avec succès !');
            } catch (error) {
                console.error('Erreur lors de la suppression du produit:', error);
                alert('Une erreur s\'est produite lors de la suppression du produit.');
            }
        }
    };

    return (
        <main className='main-container'>
            <div className='main-title'>
                <h1>Les Produits</h1>
                <MDBBtn onClick={handleShowAddProduct}>Ajouter un Produit</MDBBtn>
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
                                <MDBBtn onClick={() => handleShowUpdateProduct(produit)}>
                                    <BsFillPencilFill className='card_icon'/> 
                                </MDBBtn>
                                <MDBBtn onClick={() => handleDeleteProduct(produit._id)}>
                                    <BsFillTrashFill className='card_icon'/> 
                                </MDBBtn>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                ))}
            </div>

            {/* Add Product Modal */}
            <Modal show={showAddProduct} onHide={handleCloseAddProduct}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un Produit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitAdd}>
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

            {/* Update Product Modal */}
            <Modal show={showUpdateProduct} onHide={handleCloseUpdateProduct}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier le Produit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitUpdate}>
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
                            <Form.Label>Image (laisser vide pour conserver l'image existante)</Form.Label>
                            <Form.Control
                                type="file"
                                name="image"
                                onChange={handleFileChange}
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
                            Modifier
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Product Details Modal */}
            <Modal show={showProductDetails} onHide={handleCloseProductDetails}>
                <Modal.Header closeButton>
                    <Modal.Title>Détails du Produit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Nom: </strong>{selectedProduit.nom}</p>
                    <p><strong>Description: </strong>{selectedProduit.description}</p>
                    <p><strong>Prix: </strong>{selectedProduit.prix} DT</p>
                    <p><strong>Quantité: </strong>{selectedProduit.quantite}</p>
                    <img src={`http://localhost:5000${selectedProduit.image}`} alt={selectedProduit.nom} style={{ width: '100%' }} />
                </Modal.Body>
            </Modal>
        </main>
    );
}

export default ProduitsAdmin;
