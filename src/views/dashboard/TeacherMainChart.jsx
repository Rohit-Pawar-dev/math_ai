import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const MainChart = ({ data }) => {
  if (!data) return <div>Loading chart...</div>

  return (
    <div style={{ height: '400px' }}>
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Student Count Over Time' },
          },
        }}
      />
    </div>
  )
}

export default MainChart
