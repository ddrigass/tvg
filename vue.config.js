const path = require('path');
module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                '@common': path.join(__dirname, 'tvg-server/common/')
            }
        }
    }
}