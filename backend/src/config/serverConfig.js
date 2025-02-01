export default {
   PORT: process.env.PORT || 3002,
   CORS_ORIGIN: "*",
   SOCKET_OPTIONS: {
      pingInterval: 2000,
      pingTimeout: 5000
   },
   SERVER_TICK: 1000,
};