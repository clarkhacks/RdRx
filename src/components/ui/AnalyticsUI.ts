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
	const isArray = targetUrl.includes('[') && targetUrl.includes(']');
	const displayUrl = isArray ? `rdrx.co/${shortcode}` : targetUrl;
	const linkText = isArray ? `File Bin: ${shortcode}` : targetUrl;

	return `
<style>
  .gradient-text {
    background: linear-gradient(90deg, #FFC107, #FF8A00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
</style>

<h1 class="text-3xl font-medium mb-6 text-gray-800">Analytics for: <span class="gradient-text">${shortcode}</span></h1>
<div class="text-gray-600 mb-8">
  <p><span class="text-gray-700">Target URL:</span> <a href="${displayUrl}" class="text-amber-500 hover:text-amber-600 hover:underline transition" target="_blank">${linkText}</a></p>
</div>

<!-- Overview Stats -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <div class="notion-card bg-white p-6 rounded-2xl shadow-md border-2 border-white">
    <h3 class="text-sm font-medium text-gray-500 uppercase mb-2">Total Visits</h3>
    <p class="text-3xl font-medium text-gray-800">${analyticsData.visits}</p>
  </div>
  <div class="notion-card bg-white p-6 rounded-2xl shadow-md border-2 border-white">
    <h3 class="text-sm font-medium text-gray-500 uppercase mb-2">Avg. Daily Visits</h3>
    <p class="text-3xl font-medium text-gray-800">
      ${analyticsData.views_by_date.length > 0 ? Math.round(analyticsData.visits / analyticsData.views_by_date.length) : 0}
    </p>
  </div>
  <div class="notion-card bg-white p-6 rounded-2xl shadow-md border-2 border-white">
    <h3 class="text-sm font-medium text-gray-500 uppercase mb-2">Last Visit</h3>
    <p class="text-3xl font-medium text-gray-800">
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
  <div class="notion-card bg-white p-6 rounded-2xl shadow-md border-2 border-white">
    <h3 class="text-lg font-medium text-gray-800 mb-4">Visits Over Time</h3>
    <canvas id="visitsChart" width="400" height="300"></canvas>
  </div>
  <div class="notion-card bg-white p-6 rounded-2xl shadow-md border-2 border-white">
    <h3 class="text-lg font-medium text-gray-800 mb-4">Top Countries</h3>
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
// Initialize charts
function initCharts() {
  // Create gradient for charts
  const visitsChartCtx = document.getElementById('visitsChart').getContext('2d');
  const visitGradient = visitsChartCtx.createLinearGradient(0, 0, 0, 300);
  visitGradient.addColorStop(0, 'rgba(255, 193, 7, 0.2)');
  visitGradient.addColorStop(1, 'rgba(255, 138, 0, 0.05)');
  
  const visitBorderGradient = visitsChartCtx.createLinearGradient(0, 0, 0, 300);
  visitBorderGradient.addColorStop(0, 'rgba(255, 193, 7, 1)');
  visitBorderGradient.addColorStop(1, 'rgba(255, 138, 0, 1)');
  
  // Visits Over Time Chart
  new Chart(visitsChartCtx, {
    type: 'line',
    data: {
      labels: ${JSON.stringify(analyticsData.views_by_date.map((item) => item.date))},
      datasets: [{
        label: 'Visits',
        data: ${JSON.stringify(analyticsData.views_by_date.map((item) => item.count))},
        backgroundColor: visitGradient,
        borderColor: visitBorderGradient,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#FFC107',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#FF8A00',
        pointHoverBorderColor: '#fff',
        pointRadius: 3,
        pointHoverRadius: 5
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
          'rgba(255, 193, 7, 0.8)',
          'rgba(255, 138, 0, 0.8)',
          'rgba(255, 193, 7, 0.6)',
          'rgba(255, 138, 0, 0.6)',
          'rgba(255, 193, 7, 0.4)',
          'rgba(255, 138, 0, 0.4)',
          'rgba(255, 193, 7, 0.2)',
          'rgba(255, 138, 0, 0.2)',
          'rgba(0, 0, 0, 0.5)',
          'rgba(0, 0, 0, 0.3)',
        ],
        borderWidth: 1,
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
<div class="notion-card bg-white p-6 rounded-2xl shadow-md border-2 border-white mb-8">
  <h3 class="text-lg font-medium text-gray-800 mb-4">Recent Visits</h3>
  <style>
    .notion-table {
      border-collapse: separate;
      border-spacing: 0;
      width: 100%;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #f0f0f0;
    }
    
    .notion-table th {
      background-color: #f9f9f9;
      color: #333;
      font-weight: 600;
      text-align: left;
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .notion-table td {
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
      color: #333;
    }
    
    .notion-table tr:last-child td {
      border-bottom: none;
    }
    
    .notion-table tr:hover {
      background-color: rgba(255, 193, 7, 0.05);
    }
  </style>
  <div class="notion-table-responsive">
    <table class="notion-table min-w-full">
      <thead>
        <tr>
          <th>Time</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
        ${analyticsData.recent_visits
					.map(
						(visit, index) => `
          <tr>
            <td data-label="Time">${new Date(visit.timestamp).toLocaleString()}</td>
            <td data-label="Country">${visit.country ? `${visit.country}` : 'Unknown'}</td>
          </tr>
        `
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
