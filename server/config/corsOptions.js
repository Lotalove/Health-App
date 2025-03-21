const whitelist = [
    //'https://www.yoursite.com',
    //'http://127.0.0.1:5500',
    'http://localhost:3000',
    'http://192.168.1.156:3000'
];

const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            console.log("request deneied in cors i=options")
            callback(null, true)
        } else {
           
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;