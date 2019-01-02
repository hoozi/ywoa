const proxy = require('http-proxy-middleware');

const proxyUrl = 'http://www.honke.club/api';
const localPath = '/';

const serviceList = [
  `${localPath}api`,
  `${localPath}auth`,
  `${localPath}admin`,
  `${localPath}code`,
  `${localPath}gen`,
  `${localPath}daemon`
]

let proxys = {};

serviceList.forEach(service => {
  proxys[service] = {
    target: proxyUrl,
    //changeOrigin: true,
    pathRewrite: {
      [`^${service}`] : ''
    }
  }
});

module.exports = function(app) {
  for(let key in proxys) {
    app.use(proxy(key, proxys[key]));
  }
};