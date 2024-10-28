import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Css/Reports.css'; 
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Reports() {
  const [stats, setStats] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/impression/reports/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        setStats(response.data.stats || []);
        setTotalRevenue(response.data.totalRevenue || 0);
        setMonthlyRevenue(response.data.monthlyRevenue || []);
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
    labels: stats.map((stat) => stat._id),
    datasets: [
      {
        label: "Nombre d'Impressions",
        data: stats.map((stat) => stat.count),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Revenu Total'],
    datasets: [
      {
        data: [totalRevenue],
        backgroundColor: ['rgba(255, 99, 132, 0.5)'],
        borderColor: ['rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: monthlyRevenue.map((entry) => entry.month),
    datasets: [
      {
        label: 'Revenu Mensuel',
        data: monthlyRevenue.map((entry) => entry.total),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16, // Augmenter la taille du texte de la légende
          },
        },
      },
      tooltip: {
        bodyFont: {
          size: 14, // Taille du texte dans les infobulles
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14, // Taille du texte pour l'axe des X
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 14, // Taille du texte pour l'axe des Y
          },
        },
      },
    },
  };

  return (
    <main className='reports-container'>
      <h1>Statistiques des Impressions</h1>
      {loading && <p>Chargement...</p>}
      {error && <p>{error}</p>}
      <div className='charts-container'>
        <div className='chart'>
          <h3>Nombre d'Impressions par État</h3>
          <Bar data={barChartData} options={chartOptions} />
        </div>
        <div className='chart'>
          <h3>Revenu Total</h3>
          <Pie data={pieChartData} options={chartOptions} />
        </div>
        <div className='chart'>
          <h3>Tendance du Revenu Mensuel</h3>
          <Line data={lineChartData} options={chartOptions} />
        </div>
        <div className='total-revenue'>
          <h3>Revenu Total pour les Impressions Délivrées</h3>
          <p className='revenue-amount'>{totalRevenue.toFixed(2)} DT</p>
        </div>
      </div>
    </main>
  );
}

export default Reports;
