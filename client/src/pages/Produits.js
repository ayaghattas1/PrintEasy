import React, { useEffect, useState } from 'react';
import { 
  MDBCard, 
  MDBCardBody, 
  MDBCardTitle, 
  MDBCardText, 
  MDBCardImage, 
  MDBBtn 
} from 'mdb-react-ui-kit';
import { BsFillArchiveFill } from 'react-icons/bs';
import axios from 'axios';  // Pour faire les requêtes HTTP
import '../App.css';

function Produits() {
    const [produits, setProduits] = useState([]);

    // Fonction pour récupérer les produits du backend
    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const response = await axios.get('/produit/getProd');  // Assurez-vous que ce chemin est correct
                setProduits(response.data.produits);  // Met à jour l'état avec les produits récupérés
            } catch (error) {
                console.error("Erreur lors de la récupération des produits :", error);
            }
        };

        fetchProduits();
    }, []);  // Ce tableau vide fait que l'effet se déclenche une seule fois à la montée du composant

    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>DASHBOARD</h3>
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
                            <MDBCardText>{produit.description}</MDBCardText>
                            <MDBCardText>Prix: {produit.prix} €</MDBCardText>
                            <MDBBtn href='#'><BsFillArchiveFill className='card_icon'/> Détails du produit</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                ))}
            </div>

            {/* Vous pouvez conserver vos graphiques ici */}
        </main>
    );
}

export default Produits;