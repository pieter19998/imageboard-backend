const app = require('./src/app');
const config = require('./config/config');

app.listen(config.local.port, () => {
    console.log(`Running on port ${config.local.port}`);
});
