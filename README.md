# 🌱 Plant Bloom Monitor

**Witness the pulse of life across our planet!** A dynamic visual tool that displays and detects plant blooming events around the globe using NASA Earth observations, just like pollinators do.

## 🚀 Features

### 🌍 **Interactive Global Monitoring**
- **Interactive Map**: Click anywhere on the world map to analyze vegetation
- **Real-time Data**: NASA Earth observations API integration
- **Multiple Vegetation Indices**: NDVI, EVI, and LAI support
- **Seasonal Analysis**: Track vegetation changes throughout the year

### 📊 **Advanced Analytics**
- **Vegetation Timeline Charts**: Visualize plant growth patterns over time
- **Seasonal Pattern Analysis**: Identify peak blooming periods
- **Trend Analysis**: Monitor vegetation changes and trends
- **Confidence Scoring**: Data quality assessment

### 🛰️ **NASA Integration**
- **EPIC Satellite Images**: View stunning Earth images from NASA's DSCOVR satellite
- **Earth Imagery API**: Access high-resolution satellite data
- **Vegetation Monitoring**: Track plant health and growth patterns
- **Real-time Updates**: Latest data from NASA's Earth observation systems

### 🎯 **User Experience**
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Location Search**: Search by city name or coordinates
- **Data Export**: Download analysis results in JSON format
- **Share Functionality**: Share your findings with others
- **Mobile Responsive**: Works seamlessly on all devices

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Maps**: Leaflet.js with OpenStreetMap and satellite imagery
- **Charts**: Chart.js for data visualization
- **APIs**: NASA Earth Observations API
- **Styling**: Modern CSS with gradients and animations

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- NASA API key (already configured in the app)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd plant-bloom-monitor
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Application
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### 4. Access the Application
Open your browser and navigate to: `http://localhost:3000`

## 🎮 How to Use

### **Getting Started**
1. **Select Location**: Click on the map or search for a specific location
2. **Set Date Range**: Choose start and end dates for analysis
3. **Choose Index**: Select vegetation index (NDVI, EVI, or LAI)
4. **Analyze**: Click "Analyze Vegetation" to start monitoring

### **Understanding the Data**
- **NDVI (Normalized Difference Vegetation Index)**: Measures vegetation health (0-1 scale)
- **EVI (Enhanced Vegetation Index)**: Improved vegetation monitoring with atmospheric correction
- **LAI (Leaf Area Index)**: Measures leaf density and canopy structure

### **Interpreting Results**
- **Green Values**: Higher vegetation activity
- **Red Values**: Lower vegetation activity
- **Trends**: Positive percentages indicate growth, negative indicate decline
- **Peak Bloom**: Estimated date of maximum vegetation activity

## 🌐 API Endpoints

The application provides several API endpoints for data access:

- `GET /api/earth-imagery` - Earth imagery data
- `GET /api/epic` - EPIC satellite data
- `GET /api/vegetation` - Vegetation indices data
- `GET /api/epic/dates` - Available EPIC image dates
- `GET /api/health` - Application health check

## 🔧 Configuration

The application is pre-configured with your NASA API key. Key configuration options in `config.js`:

```javascript
const config = {
  NASA_API_KEY: 'kT31ofTOWvObYeMdZvnVdeBqxqsUkkIqu0WpB9AS',
  NASA_BASE_URL: 'https://api.nasa.gov',
  PORT: 3000,
  CACHE_TTL: 3600 // 1 hour cache
};
```

## 📱 Supported Locations

The application includes built-in support for common locations:
- **Cities**: New York, London, Tokyo, Paris, Sydney
- **Regions**: Amazon Rainforest, Sahara Desert, Himalayas
- **Custom**: Enter any coordinates (latitude, longitude)

## 🎨 Customization

### **Styling**
- Modify `public/styles.css` to customize the appearance
- Update color schemes, fonts, and layout
- Add custom animations and transitions

### **Functionality**
- Extend `public/app.js` with additional features
- Add new vegetation indices
- Implement additional data sources

### **Data Sources**
- Integrate additional NASA APIs
- Add weather data integration
- Include historical climate data

## 🔍 Troubleshooting

### **Common Issues**

1. **Map Not Loading**
   - Check internet connection
   - Verify Leaflet.js is loading correctly
   - Clear browser cache

2. **API Errors**
   - Verify NASA API key is valid
   - Check server logs for error details
   - Ensure all dependencies are installed

3. **Charts Not Displaying**
   - Verify Chart.js is loaded
   - Check browser console for JavaScript errors
   - Ensure data is being fetched correctly

### **Performance Tips**
- Use appropriate date ranges for analysis
- Clear browser cache regularly
- Close unnecessary browser tabs

## 🌟 Future Enhancements

- **Machine Learning**: Predictive vegetation modeling
- **Weather Integration**: Climate data correlation
- **Mobile App**: Native iOS/Android applications
- **Real-time Alerts**: Vegetation change notifications
- **Community Features**: Share and compare findings
- **Advanced Analytics**: Statistical analysis tools

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **NASA**: For providing the Earth observations data and APIs
- **OpenStreetMap**: For map tile services
- **Chart.js**: For beautiful data visualization
- **Leaflet.js**: For interactive mapping capabilities

## 📞 Support

For questions, issues, or feature requests:

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check this README and inline code comments
- **Community**: Join our discussions and share your findings

---

**Happy monitoring! 🌱✨**

*Built with ❤️ for Earth observation and environmental monitoring*
