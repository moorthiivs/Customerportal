import configData from './config.json';

/**
 * Smart Configuration Manager
 * Prioritizes environment variables (window.ENV_CONFIG) injected by the backend
 * Falls back to build-time environment variables or config.json
 */
const config = {
  ...configData,
  CustomerPortal: {
    ...configData.CustomerPortal,
    URL: window.ENV_CONFIG?.CUSTOMERPORTAL_URL || process.env.REACT_APP_CUSTOMERPORTAL_URL || configData.CustomerPortal.URL
  },
  CalibMaster: {
    URL: window.ENV_CONFIG?.CALIBMASTER_URL || process.env.REACT_APP_CALIBMASTER_URL || "http://localhost:5000"
  }
};

export default config;
