const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(
        '/github',
        createProxyMiddleware({
            target: 'https://github.com',
            changeOrigin: true,
            pathRewrite: {
                '^/github': ''
            }
        })
    );
};
