import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Reports() {
  const [stats, setStats] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/impression/reports/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setStats(response.data.stats);
        setTotalRevenue(response.data.totalRevenue);
      } catch (error) {
        console.error('Error fetching impression stats:', error);
        setError('Erreur lors de la récupération des statistiques.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const barChartData = {
    labels: stats.map(stat => stat._id),
    datasets: [
      {
        label: 'Nombre d\'impressions',
        data: stats.map(stat => stat.count),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Revenu Total pour les Impressions Délivrées'],
    datasets: [
      {
        data: [totalRevenue],
        backgroundColor: ['rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <main className='reports-container'>
      <h2>Statistiques des Impressions</h2>
      {loading && <p>Chargement...</p>}
      {error && <p>{error}</p>}
      <div className='charts-container'>
        <div className='chart'>
          <h3>Nombre d'Impressions par État</h3>
          <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
        <div className='chart'>
          <h3>Revenu Total</h3>
          <Pie data={pieChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>

      <div className='total-revenue'>
        <h3>Revenu Total pour les Impressions Délivrées</h3>
        <p>{totalRevenue.toFixed(2)} €</p>
      </div>
      </div>
      
    </main>
  );
}

export default Reports;
