// Define the analytics data interface
interface AnalyticsData {
	visits: number;
	views_by_date: { date: string; count: number }[];
	views_by_country: { country: string; count: number }[];
	recent_visits: {
		timestamp: string;
		country: string;
	}[];
}

// Props interfaces
interface AnalyticsOverviewProps {
	analyticsData: AnalyticsData;
	shortcode: string;
	targetUrl: string;
}

interface AnalyticsChartsProps {
	analyticsData: AnalyticsData;
}

interface AnalyticsRecentVisitsProps {
	analyticsData: AnalyticsData;
}

/**
 * Render the analytics overview section
 */
function renderAnalyticsOverview({ analyticsData, shortcode, targetUrl }: AnalyticsOverviewProps): string {
	return `
<h1 class="text-4xl font-bold mb-6 gradient-text">Analytics for: ${shortcode}</h1>
<div class="text-gray-600 mb-8">
  <p><strong>Target URL:</strong> <a href="${targetUrl}" class="text-primary-500 hover:text-primary-600 hover:underline transition" target="_blank">${targetUrl}</a></p>
</div>

<!-- Overview Stats -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 border-t-4 border-primary-500">
    <h3 class="text-lg font-medium text-gray-700 mb-2">Total Visits</h3>
    <p class="text-4xl font-bold gradient-text">${analyticsData.visits}</p>
  </div>
  <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 border-t-4 border-secondary-500">
    <h3 class="text-lg font-medium text-gray-700 mb-2">Avg. Daily Visits</h3>
    <p class="text-4xl font-bold gradient-text">
      ${analyticsData.views_by_date.length > 0 ? Math.round(analyticsData.visits / analyticsData.views_by_date.length) : 0}
    </p>
  </div>
  <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 border-t-4 border-primary-500">
    <h3 class="text-lg font-medium text-gray-700 mb-2">Last Visit</h3>
    <p class="text-2xl font-bold gradient-text">
      ${analyticsData.recent_visits.length > 0 ? new Date(analyticsData.recent_visits[0].timestamp).toLocaleDateString() : 'N/A'}
    </p>
  </div>
</div>
  `;
}

/**
 * Render the analytics charts section
 */
function renderAnalyticsCharts({ analyticsData }: AnalyticsChartsProps): string {
	return `
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
  <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100">
    <h3 class="text-xl font-semibold text-gray-700 mb-4 gradient-text">Visits Over Time</h3>
    <canvas id="visitsChart" width="400" height="300"></canvas>
  </div>
  <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100">
    <h3 class="text-xl font-semibold text-gray-700 mb-4 gradient-text">Top Countries</h3>
    <canvas id="countriesChart" width="400" height="300"></canvas>
  </div>
</div>
  `;
}

/**
 * Render the JavaScript for initializing the analytics charts
 */
function renderAnalyticsChartsScripts(analyticsData: AnalyticsData): string {
	return `
// Add gradient styles
document.head.insertAdjacentHTML('beforeend', \`
  <style>
    .gradient-text {
      background: linear-gradient(90deg, #0ea5e9, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .feature-card {
      transition: all 0.3s ease;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    
    tr:hover {
      background-color: rgba(14, 165, 233, 0.05);
    }
  </style>
\`);

// Initialize charts
function initCharts() {
  // Create gradient for charts
  const visitsChartCtx = document.getElementById('visitsChart').getContext('2d');
  const visitGradient = visitsChartCtx.createLinearGradient(0, 0, 0, 300);
  visitGradient.addColorStop(0, 'rgba(14, 165, 233, 0.8)');
  visitGradient.addColorStop(1, 'rgba(236, 72, 153, 0.8)');
  
  const visitBorderGradient = visitsChartCtx.createLinearGradient(0, 0, 0, 300);
  visitBorderGradient.addColorStop(0, 'rgba(14, 165, 233, 1)');
  visitBorderGradient.addColorStop(1, 'rgba(236, 72, 153, 1)');
  
  // Visits Over Time Chart
  new Chart(visitsChartCtx, {
    type: 'line',
    data: {
      labels: ${JSON.stringify(analyticsData.views_by_date.map((item) => item.date))},
      datasets: [{
        label: 'Visits',
        data: ${JSON.stringify(analyticsData.views_by_date.map((item) => item.count))},
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: visitBorderGradient,
        borderWidth: 3,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#0ea5e9',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#ec4899',
        pointHoverBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
  
  // Countries Chart
  const countriesChartCtx = document.getElementById('countriesChart').getContext('2d');
  new Chart(countriesChartCtx, {
    type: 'pie',
    data: {
      labels: ${JSON.stringify(analyticsData.views_by_country.map((item) => item.country || 'Unknown'))},
      datasets: [{
        data: ${JSON.stringify(analyticsData.views_by_country.map((item) => item.count))},
        backgroundColor: [
          'rgba(14, 165, 233, 0.8)',
          'rgba(125, 211, 252, 0.8)',
          'rgba(56, 189, 248, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(249, 168, 212, 0.8)',
          'rgba(244, 114, 182, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'right',
          labels: {
            font: {
              family: 'Inter, sans-serif'
            }
          }
        }
      }
    }
  });
}

// Call initCharts when the DOM is loaded
initCharts();
  `;
}

/**
 * Render the recent visits table
 */
function renderAnalyticsRecentVisits({ analyticsData }: AnalyticsRecentVisitsProps): string {
	return `
<div class="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
  <h3 class="text-xl font-semibold gradient-text mb-4">Recent Visits</h3>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white rounded-lg overflow-hidden">
      <thead class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <tr>
          <th class="py-3 px-4 text-left text-sm font-medium">Time</th>
          <th class="py-3 px-4 text-left text-sm font-medium">Country</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        ${analyticsData.recent_visits
					.map(
						(visit, index) => `
          <tr class="hover:bg-gray-50 transition duration-150">
            <td class="py-3 px-4 text-sm ${index % 2 === 0 ? 'text-primary-700' : 'text-secondary-700'}">${new Date(
							visit.timestamp,
						).toLocaleString()}</td>
            <td class="py-3 px-4 text-sm font-medium ${index % 2 === 0 ? 'text-primary-700' : 'text-secondary-700'}">
              ${visit.country ? `${visit.country}` : 'Unknown'}
            </td>
          </tr>
        `,
					)
					.join('')}
      </tbody>
    </table>
  </div>
</div>
  `;
}

// Export all components and types
export { renderAnalyticsOverview, renderAnalyticsCharts, renderAnalyticsChartsScripts, renderAnalyticsRecentVisits };
export type { AnalyticsData };
