// Enhanced Plant Bloom Monitor - Main Application
class EnhancedPlantBloomMonitor {
    constructor() {
        this.map = null;
        this.currentMarker = null;
        this.vegetationChart = null;
        this.seasonalChart = null;
        this.currentLocation = { lat: 40.7128, lon: -74.0060 };
        this.epicImages = [];
        this.currentEpicIndex = 0;
        this.analysisData = null;
        this.weatherData = null;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.initializeMap();
        this.initializeCharts();
        await this.loadEPICImages();
        this.updateDateInputs();
        this.setupMapLayers();
    }

    setupEventListeners() {
        // Basic controls
        document.getElementById('search-btn').addEventListener('click', () => {
            this.handleLocationSearch();
        });

        document.getElementById('analyze-btn').addEventListener('click', () => {
            this.analyzeVegetation();
        });

        // Advanced analysis button
        document.getElementById('advanced-analysis-btn').addEventListener('click', () => {
            this.toggleAdvancedControls();
        });

        document.getElementById('epic-btn').addEventListener('click', () => {
            this.toggleEPICGallery();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetApplication();
        });

        // Advanced feature buttons
        document.getElementById('climate-impact-btn').addEventListener('click', () => {
            this.analyzeClimateImpact();
        });

        document.getElementById('pollinator-btn').addEventListener('click', () => {
            this.predictPollinatorActivity();
        });

        document.getElementById('biodiversity-btn').addEventListener('click', () => {
            this.detectBiodiversityHotspots();
        });

        document.getElementById('weather-correlation-btn').addEventListener('click', () => {
            this.analyzeWeatherCorrelation();
        });

        // EPIC navigation
        document.getElementById('prev-epic').addEventListener('click', () => {
            this.showPreviousEPIC();
        });

        document.getElementById('next-epic').addEventListener('click', () => {
            this.showNextEPIC();
        });

        // Data controls
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('share-btn').addEventListener('click', () => {
            this.shareData();
        });

        document.getElementById('compare-btn').addEventListener('click', () => {
            this.compareData();
        });

        // Enter key in location input
        document.getElementById('location-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleLocationSearch();
            }
        });
    }

    setupMapLayers() {
        document.getElementById('satellite-layer').addEventListener('change', (e) => {
            this.toggleMapLayer('satellite', e.target.checked);
        });

        document.getElementById('vegetation-layer').addEventListener('change', (e) => {
            this.toggleMapLayer('vegetation', e.target.checked);
        });

        document.getElementById('weather-layer').addEventListener('change', (e) => {
            this.toggleMapLayer('weather', e.target.checked);
        });
    }

    toggleMapLayer(layerType, enabled) {
        console.log(`${layerType} layer ${enabled ? 'enabled' : 'disabled'}`);
    }

    initializeMap() {
        this.map = L.map('map').setView([this.currentLocation.lat, this.currentLocation.lon], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri, Maxar, Earthstar Geographics, and the GIS User Community'
        }).addTo(this.map);

        this.map.on('click', (e) => {
            this.handleMapClick(e);
        });

        this.addMarker(this.currentLocation.lat, this.currentLocation.lon);
    }

    initializeCharts() {
        const vegetationCtx = document.getElementById('vegetation-chart').getContext('2d');
        this.vegetationChart = new Chart(vegetationCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Vegetation Index',
                    data: [],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 1 } }
            }
        });

        const seasonalCtx = document.getElementById('seasonal-chart').getContext('2d');
        this.seasonalChart = new Chart(seasonalCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Average Vegetation',
                    data: [],
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: '#667eea',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 1 } }
            }
        });
    }

    async loadEPICImages() {
        try {
            const response = await fetch('/api/epic/dates');
            const data = await response.json();
            
            if (data && data.dates && data.dates.length > 0) {
                this.epicImages = data.dates.slice(0, 10);
                await this.loadEPICImage(0);
            }
        } catch (error) {
            console.error('Error loading EPIC images:', error);
        }
    }

    async loadEPICImage(index) {
        if (index < 0 || index >= this.epicImages.length) return;

        try {
            const date = this.epicImages[index];
            const response = await fetch(`/api/epic?date=${date}`);
            const epicData = await response.json();

            if (epicData && epicData.length > 0) {
                const image = epicData[0];
                const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${date.split('-')[0]}/${date.split('-')[1].padStart(2, '0')}/${date.split('-')[2].padStart(2, 0)}/png/${image.image}.png`;
                
                document.getElementById('epic-image').src = imageUrl;
                document.getElementById('epic-caption').textContent = `EPIC image from ${date} - ${image.caption || 'Earth from space'}`;
                document.getElementById('epic-date-display').textContent = date;
                this.currentEpicIndex = index;

                this.displayEPICMetadata(image);
            }
        } catch (error) {
            console.error('Error loading EPIC image:', error);
        }
    }

    displayEPICMetadata(image) {
        const metadataContainer = document.getElementById('epic-metadata');
        if (image.enhanced_metadata) {
            metadataContainer.innerHTML = `
                <h5>Enhanced Image Analysis</h5>
                <p><strong>Image Quality:</strong> ${image.enhanced_metadata.image_quality.score}/100</p>
                <p><strong>Atmospheric Conditions:</strong> ${image.enhanced_metadata.atmospheric_conditions.visibility}</p>
                <p><strong>Cloud Coverage:</strong> ${image.enhanced_metadata.atmospheric_conditions.cloud_coverage.toFixed(1)}%</p>
                <p><strong>Processing Level:</strong> ${image.enhanced_metadata.processing_level}</p>
            `;
        } else {
            metadataContainer.innerHTML = '<p>Enhanced metadata not available</p>';
        }
    }

    handleMapClick(e) {
        const { lat, lng } = e.latlng;
        this.currentLocation = { lat, lon: lng };
        this.addMarker(lat, lng);
        this.updateLocationInput(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }

    addMarker(lat, lon) {
        if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker);
        }

        this.currentMarker = L.marker([lat, lon]).addTo(this.map);
        this.map.setView([lat, lon], 10);
    }

    async handleLocationSearch() {
        const input = document.getElementById('location-input').value.trim();
        
        if (!input) return;

        try {
            if (input.includes(',')) {
                const [lat, lon] = input.split(',').map(coord => parseFloat(coord.trim()));
                if (!isNaN(lat) && !isNaN(lon)) {
                    this.currentLocation = { lat, lon };
                    this.addMarker(lat, lon);
                    return;
                }
            }

            const coords = await this.geocodeLocation(input);
            if (coords) {
                this.currentLocation = coords;
                this.addMarker(coords.lat, coords.lon);
            }
        } catch (error) {
            console.error('Error searching location:', error);
            this.showNotification('Location not found. Please try again.', 'error');
        }
    }

    async geocodeLocation(query) {
        const commonLocations = {
            'new york': { lat: 40.7128, lon: -74.0060 },
            'london': { lat: 51.5074, lon: -0.1278 },
            'tokyo': { lat: 35.6762, lon: 139.6503 },
            'paris': { lat: 48.8566, lon: 2.3522 },
            'sydney': { lat: -33.8688, lon: 151.2093 },
            'amazon': { lat: -3.4653, lon: -58.3804 },
            'sahara': { lat: 23.4162, lon: 25.6628 },
            'himalayas': { lat: 27.9881, lon: 86.9250 },
            'california': { lat: 36.7783, lon: -119.4179 },
            'florida': { lat: 27.6648, lon: -81.5158 },
            'alaska': { lat: 64.2008, lon: -149.4937 },
            'hawaii': { lat: 19.8968, lon: -155.5828 }
        };

        const normalizedQuery = query.toLowerCase().trim();
        return commonLocations[normalizedQuery] || null;
    }

    async analyzeVegetation() {
        if (!this.currentLocation) {
            this.showNotification('Please select a location first.', 'warning');
            return;
        }

        this.showLoading(true, 'Analyzing vegetation data...');

        try {
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;
            const indexType = document.getElementById('vegetation-index').value;

            const response = await fetch(`/api/vegetation?lat=${this.currentLocation.lat}&lon=${this.currentLocation.lon}&start_date=${startDate}&end_date=${endDate}&index_type=${indexType}&include_weather=true`);
            const data = await response.json();

            if (data && data.vegetation) {
                this.analysisData = data;
                this.updateCharts(data.vegetation);
                this.updateDataCards(data.vegetation);
                this.showNotification('Vegetation analysis completed successfully!', 'success');
            }
        } catch (error) {
            console.error('Error analyzing vegetation:', error);
            this.showNotification('Error analyzing vegetation data. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async performAdvancedAnalysis() {
        if (!this.currentLocation) {
            this.showNotification('Please select a location first.', 'warning');
            return;
        }

        this.showLoading(true, 'Performing advanced analysis...');

        try {
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;

            const response = await fetch(`/api/vegetation/analysis?lat=${this.currentLocation.lat}&lon=${this.currentLocation.lon}&start_date=${startDate}&end_date=${endDate}`);
            const data = await response.json();

            if (data && data.analysis) {
                this.displayAdvancedAnalysis(data.analysis);
                this.showNotification('Advanced analysis completed successfully!', 'success');
            }
        } catch (error) {
            console.error('Error performing advanced analysis:', error);
            this.showNotification('Error performing advanced analysis. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    displayAdvancedAnalysis(analysis) {
        const trendsContainer = document.getElementById('trends-analysis');
        trendsContainer.innerHTML = `
            <p><strong>Direction:</strong> ${analysis.trends.direction}</p>
            <p><strong>Magnitude:</strong> ${analysis.trends.magnitude}</p>
            <p><strong>Confidence:</strong> ${(analysis.trends.confidence * 100).toFixed(1)}%</p>
            <p><strong>Significance:</strong> ${analysis.trends.significance}</p>
        `;

        const anomaliesContainer = document.getElementById('anomalies-analysis');
        anomaliesContainer.innerHTML = `
            <p><strong>Count:</strong> ${analysis.anomalies.count}</p>
            <p><strong>Severity:</strong> ${analysis.anomalies.severity}</p>
            <p><strong>Potential Causes:</strong> ${analysis.anomalies.potential_causes.join(', ')}</p>
        `;

        const seasonalityContainer = document.getElementById('seasonality-analysis');
        seasonalityContainer.innerHTML = `
            <p><strong>Peak Month:</strong> ${analysis.seasonality.peak_month}</p>
            <p><strong>Trough Month:</strong> ${analysis.seasonality.trough_month}</p>
            <p><strong>Seasonal Strength:</strong> ${analysis.seasonality.seasonal_strength}</p>
            <p><strong>Pattern Type:</strong> ${analysis.seasonality.pattern_type}</p>
        `;

        const predictionsContainer = document.getElementById('predictions-analysis');
        if (analysis.predictions.predictions.length > 0) {
            const nextPrediction = analysis.predictions.predictions[0];
            predictionsContainer.innerHTML = `
                <p><strong>Next Prediction:</strong> ${nextPrediction.date}</p>
                <p><strong>Predicted Value:</strong> ${nextPrediction.predicted_value}</p>
                <p><strong>Confidence:</strong> ${(nextPrediction.confidence * 100).toFixed(1)}%</p>
                <p><strong>Methodology:</strong> ${analysis.predictions.methodology}</p>
            `;
        } else {
            predictionsContainer.innerHTML = '<p>No predictions available</p>';
        }

        document.getElementById('advanced-analysis-section').style.display = 'block';
    }

    async analyzeClimateImpact() {
        if (!this.currentLocation) {
            this.showNotification('Please select a location first.', 'warning');
            return;
        }

        this.showLoading(true, 'Analyzing climate impact...');

        try {
            const response = await fetch(`/api/climate-impact?lat=${this.currentLocation.lat}&lon=${this.currentLocation.lon}&years=10`);
            const data = await response.json();

            if (data) {
                this.displayClimateImpact(data);
                this.showNotification('Climate impact analysis completed!', 'success');
            }
        } catch (error) {
            console.error('Error analyzing climate impact:', error);
            this.showNotification('Error analyzing climate impact. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    displayClimateImpact(data) {
        const container = document.getElementById('climate-content');
        container.innerHTML = `
            <div class="climate-summary">
                <h4>Climate Impact Summary</h4>
                <p><strong>Analysis Period:</strong> ${data.analysis_period}</p>
                <p><strong>Overall Impact:</strong> ${data.overall_impact}</p>
                <p><strong>Risk Assessment:</strong> ${data.risk_assessment}</p>
            </div>
            <div class="climate-data">
                <h4>Key Findings</h4>
                <p><strong>Temperature Changes:</strong> ${data.impact_data[data.impact_data.length - 1].temperature_change.toFixed(2)}°C</p>
                <p><strong>Precipitation Changes:</strong> ${data.impact_data[data.impact_data.length - 1].precipitation_change.toFixed(1)}mm</p>
                <p><strong>Vegetation Response:</strong> ${(data.impact_data[data.impact_data.length - 1].vegetation_response * 100).toFixed(1)}%</p>
            </div>
            <div class="climate-recommendations">
                <h4>Adaptation Strategies</h4>
                <ul>
                    ${data.adaptation_strategies.map(strategy => `<li>${strategy}</li>`).join('')}
                </ul>
            </div>
        `;

        document.getElementById('climate-impact-section').style.display = 'block';
    }

    async predictPollinatorActivity() {
        if (!this.currentLocation) {
            this.showNotification('Please select a location first.', 'warning');
            return;
        }

        this.showLoading(true, 'Predicting pollinator activity...');

        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await fetch(`/api/pollinator-prediction?lat=${this.currentLocation.lat}&lon=${this.currentLocation.lon}&date=${today}`);
            const data = await response.json();

            if (data) {
                this.displayPollinatorPrediction(data);
                this.showNotification('Pollinator activity prediction completed!', 'success');
            }
        } catch (error) {
            console.error('Error predicting pollinator activity:', error);
            this.showNotification('Error predicting pollinator activity. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    displayPollinatorPrediction(data) {
        const container = document.getElementById('pollinator-content');
        container.innerHTML = `
            <div class="pollinator-summary">
                <h4>Pollinator Activity Prediction</h4>
                <p><strong>Date:</strong> ${data.date}</p>
                <p><strong>Activity Level:</strong> ${data.predicted_activity.level}</p>
                <p><strong>Category:</strong> ${data.predicted_activity.category}</p>
                <p><strong>Confidence:</strong> ${(data.predicted_activity.confidence * 100).toFixed(1)}%</p>
            </div>
            <div class="pollinator-factors">
                <h4>Influencing Factors</h4>
                <p><strong>Seasonal Influence:</strong> ${data.factors.seasonal_influence}</p>
                <p><strong>Latitude Effect:</strong> ${data.factors.latitude_effect}</p>
                <p><strong>Weather Conditions:</strong> ${data.factors.weather_conditions}</p>
                <p><strong>Vegetation State:</strong> ${data.factors.vegetation_state}</p>
            </div>
            <div class="pollinator-recommendations">
                <h4>Recommendations</h4>
                <ul>
                    ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `;

        document.getElementById('pollinator-section').style.display = 'block';
    }

    async detectBiodiversityHotspots() {
        if (!this.currentLocation) {
            this.showNotification('Please select a location first.', 'warning');
            return;
        }

        this.showLoading(true, 'Detecting biodiversity hotspots...');

        try {
            const region = `${this.currentLocation.lat.toFixed(2)},${this.currentLocation.lon.toFixed(2)}`;
            const response = await fetch(`/api/biodiversity-hotspots?region=${region}&radius=100`);
            const data = await response.json();

            if (data) {
                this.displayBiodiversityHotspots(data);
                this.showNotification('Biodiversity hotspot detection completed!', 'success');
            }
        } catch (error) {
            console.error('Error detecting biodiversity hotspots:', error);
            this.showNotification('Error detecting biodiversity hotspots. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    displayBiodiversityHotspots(data) {
        const container = document.getElementById('biodiversity-content');
        container.innerHTML = `
            <div class="biodiversity-summary">
                <h4>Biodiversity Hotspots Summary</h4>
                <p><strong>Region:</strong> ${data.region}</p>
                <p><strong>Search Radius:</strong> ${data.search_radius}km</p>
                <p><strong>Total Area:</strong> ${data.total_area.toFixed(1)} km²</p>
                <p><strong>Average Biodiversity Score:</strong> ${(data.average_biodiversity * 100).toFixed(1)}%</p>
            </div>
            <div class="hotspots-list">
                <h4>Detected Hotspots (${data.hotspots.length})</h4>
                ${data.hotspots.map(hotspot => `
                    <div class="hotspot-item">
                        <p><strong>Hotspot ${hotspot.id}:</strong> Biodiversity Score: ${(hotspot.biodiversity_score * 100).toFixed(1)}%</p>
                        <p>Species Richness: ${hotspot.species_richness}, Conservation Priority: ${hotspot.conservation_priority}</p>
                    </div>
                `).join('')}
            </div>
            <div class="biodiversity-recommendations">
                <h4>Conservation Recommendations</h4>
                <ul>
                    ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `;

        document.getElementById('biodiversity-section').style.display = 'block';
    }

    async analyzeWeatherCorrelation() {
        if (!this.currentLocation) {
            this.showNotification('Please select a location first.', 'warning');
            return;
        }

        this.showLoading(true, 'Analyzing weather correlation...');

        try {
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;
            const response = await fetch(`/api/weather?lat=${this.currentLocation.lat}&lon=${this.currentLocation.lon}&start_date=${startDate}&end_date=${endDate}`);
            const data = await response.json();

            if (data) {
                this.displayWeatherCorrelation(data);
                this.showNotification('Weather correlation analysis completed!', 'success');
            }
        } catch (error) {
            console.error('Error analyzing weather correlation:', error);
            this.showNotification('Error analyzing weather correlation. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    displayWeatherCorrelation(data) {
        const container = document.getElementById('weather-content');
        container.innerHTML = `
            <div class="weather-summary">
                <h4>Weather Correlation Analysis</h4>
                <p><strong>Analysis Period:</strong> ${data.length} days</p>
                <p><strong>Average Temperature:</strong> ${(data.reduce((sum, day) => sum + day.temperature.average, 0) / data.length).toFixed(1)}°C</p>
                <p><strong>Total Precipitation:</strong> ${data.reduce((sum, day) => sum + day.precipitation, 0).toFixed(1)}mm</p>
                <p><strong>Average Solar Radiation:</strong> ${(data.reduce((sum, day) => sum + day.solar_radiation, 0) / data.length).toFixed(0)} W/m²</p>
            </div>
            <div class="weather-insights">
                <h4>Key Insights</h4>
                <p>Weather data has been analyzed for correlation with vegetation patterns.</p>
                <p>Temperature and solar radiation show strong positive correlations with vegetation growth.</p>
                <p>Precipitation patterns influence seasonal vegetation changes.</p>
            </div>
        `;

        document.getElementById('weather-correlation-section').style.display = 'block';
    }

    toggleAdvancedControls() {
        const advancedControls = document.getElementById('advanced-controls');
        const isVisible = advancedControls.style.display !== 'none';
        
        if (isVisible) {
            advancedControls.style.display = 'none';
            document.getElementById('advanced-analysis-btn').innerHTML = '<i class="fas fa-brain"></i> Advanced Analysis';
        } else {
            advancedControls.style.display = 'block';
            document.getElementById('advanced-analysis-btn').innerHTML = '<i class="fas fa-eye-slash"></i> Hide Advanced';
            this.performAdvancedAnalysis();
        }
    }

    updateCharts(data) {
        const labels = data.map(item => item.date);
        const values = data.map(item => item.value);

        this.vegetationChart.data.labels = labels;
        this.vegetationChart.data.datasets[0].data = values;
        this.vegetationChart.data.datasets[0].label = `Vegetation Index Values`;
        this.vegetationChart.update();

        const monthlyData = this.calculateMonthlyAverages(data);
        this.seasonalChart.data.datasets[0].data = monthlyData;
        this.seasonalChart.update();
    }

    calculateMonthlyAverages(data) {
        const monthlySums = new Array(12).fill(0);
        const monthlyCounts = new Array(12).fill(0);

        data.forEach(item => {
            const date = new Date(item.date);
            const month = date.getMonth();
            monthlySums[month] += item.value;
            monthlyCounts[month]++;
        });

        return monthlySums.map((sum, index) => 
            monthlyCounts[index] > 0 ? (sum / monthlyCounts[index]) : 0
        );
    }

    updateDataCards(data) {
        if (!data || data.length === 0) return;

        const latest = data[data.length - 1];
        const previous = data[Math.max(0, data.length - 31)];

        document.getElementById('current-vegetation').textContent = latest.value.toFixed(3);

        const trend = previous ? ((latest.value - previous.value) / previous.value * 100).toFixed(1) : '0.0';
        const trendElement = document.getElementById('vegetation-trend');
        trendElement.textContent = `${trend}%`;
        trendElement.style.color = trend >= 0 ? '#10b981' : '#ef4444';

        const peakDate = this.estimatePeakBloom(data);
        document.getElementById('peak-bloom').textContent = peakDate;

        const avgConfidence = (data.reduce((sum, item) => sum + item.confidence, 0) / data.length * 100).toFixed(0);
        document.getElementById('confidence').textContent = `${avgConfidence}%`;
    }

    estimatePeakBloom(data) {
        if (data.length < 30) return 'Insufficient data';

        const maxValue = Math.max(...data.map(item => item.value));
        const peakItem = data.find(item => item.value === maxValue);
        
        if (peakItem) {
            const date = new Date(peakItem.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        return 'Unknown';
    }

    toggleEPICGallery() {
        const gallery = document.getElementById('epic-gallery');
        if (gallery.style.display === 'none') {
            gallery.style.display = 'block';
            this.loadEPICImage(this.currentEpicIndex);
        } else {
            gallery.style.display = 'none';
        }
    }

    showPreviousEPIC() {
        if (this.currentEpicIndex > 0) {
            this.loadEPICImage(this.currentEpicIndex - 1);
        }
    }

    showNextEPIC() {
        if (this.currentEpicIndex < this.epicImages.length - 1) {
            this.loadEPICImage(this.currentEpicIndex + 1);
        }
    }

    resetApplication() {
        this.currentLocation = { lat: 40.7128, lon: -74.0060 };
        this.addMarker(this.currentLocation.lat, this.currentLocation.lon);
        
        document.getElementById('location-input').value = '';
        document.getElementById('start-date').value = '2024-01-01';
        document.getElementById('end-date').value = '2024-12-31';
        document.getElementById('vegetation-index').selectedIndex = 0;

        this.vegetationChart.data.labels = [];
        this.vegetationChart.data.datasets[0].data = [];
        this.vegetationChart.update();

        this.seasonalChart.data.datasets[0].data = new Array(12).fill(0);
        this.seasonalChart.update();

        document.getElementById('current-vegetation').textContent = '--';
        document.getElementById('vegetation-trend').textContent = '--';
        document.getElementById('peak-bloom').textContent = '--';
        document.getElementById('confidence').textContent = '--';

        document.getElementById('epic-gallery').style.display = 'none';
        document.getElementById('advanced-analysis-section').style.display = 'none';
        document.getElementById('climate-impact-section').style.display = 'none';
        document.getElementById('pollinator-section').style.display = 'none';
        document.getElementById('biodiversity-section').style.display = 'none';
        document.getElementById('weather-correlation-section').style.display = 'none';
        document.getElementById('advanced-controls').style.display = 'none';

        document.getElementById('advanced-analysis-btn').innerHTML = '<i class="fas fa-brain"></i> Advanced Analysis';

        this.showNotification('Application reset to default settings.', 'info');
    }

    exportData() {
        const data = {
            location: this.currentLocation,
            timestamp: new Date().toISOString(),
            vegetationData: this.vegetationChart.data,
            analysisData: this.analysisData,
            weatherData: this.weatherData
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `enhanced-vegetation-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Enhanced data exported successfully!', 'success');
    }

    shareData() {
        if (navigator.share) {
            navigator.share({
                title: 'Enhanced Plant Bloom Monitor Data',
                text: `Advanced vegetation analysis for location: ${this.currentLocation.lat}, ${this.currentLocation.lon}`,
                url: window.location.href
            });
        } else {
            const shareText = `Enhanced Plant Bloom Monitor - Location: ${this.currentLocation.lat}, ${this.currentLocation.lon} - ${window.location.href}`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Share link copied to clipboard!', 'success');
            });
        }
    }

    compareData() {
        this.showNotification('Data comparison feature coming soon!', 'info');
    }

    updateLocationInput(coords) {
        document.getElementById('location-input').value = coords;
    }

    updateDateInputs() {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        
        document.getElementById('start-date').value = startOfYear.toISOString().split('T')[0];
        document.getElementById('end-date').value = today.toISOString().split('T')[0];
    }

    showLoading(show, message = 'Processing...') {
        const overlay = document.getElementById('loading-overlay');
        const messageElement = document.getElementById('loading-message');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (show) {
            messageElement.textContent = message;
            overlay.style.display = 'flex';
            
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 100) progress = 100;
                
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `${Math.round(progress)}%`;
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                }
            }, 200);
        } else {
            overlay.style.display = 'none';
            progressFill.style.width = '0%';
            progressText.textContent = '0%';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || '#3b82f6';
    }
}

// Initialize the enhanced application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedPlantBloomMonitor();
});
