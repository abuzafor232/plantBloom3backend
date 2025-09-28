// Configuration file for NASA API and application settings
const config = {
  NASA_API_KEY: 'kT31ofTOWvObYeMdZvnVdeBqxqsUkkIqu0WpB9AS',
  NASA_BASE_URL: 'https://api.nasa.gov',
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CACHE_TTL: 3600, // 1 hour cache for API responses
  EDL_TOKEN: process.env.EDL_TOKEN || '',
  VEGETATION_INDICES: {
    NDVI: 'NDVI', // Normalized Difference Vegetation Index
    EVI: 'EVI',   // Enhanced Vegetation Index
    LAI: 'LAI',   // Leaf Area Index
    NDRE: 'NDRE', // Normalized Difference Red Edge
    GNDVI: 'GNDVI', // Green Normalized Difference Vegetation Index
    SAVI: 'SAVI'  // Soil Adjusted Vegetation Index
  }
};

module.exports = config;
