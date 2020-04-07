const app = require('./src/app');
const config = require('./config/config');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`app is running on port ${ PORT }`);
});
