export const generateComplexToken = (length = 64) => {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?';
   let token = '';
   for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
   }
   return token;
};

export const getDeviceId = (req) => {
   const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

   const userAgent = req.headers['user-agent'];

   const deviceId = `${ip}_${userAgent}`;

   return deviceId;
}