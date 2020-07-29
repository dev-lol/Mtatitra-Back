require('dotenv').config()
export const environment = {
  production: true,
  SOCKET_ENDPOINT: `http://${process.env.URL}/client`,
  API_ENDPOINT: `http://${process.env.URL}/api/client`,
};
