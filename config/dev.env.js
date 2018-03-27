var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = {
    NODE_ENV: '"development"',
    API_ROOT: '"http://172.16.21.114:999"'
    //API_ROOT: '"http://ib.svsmarkets.com"'
    //API_ROOT: '"http://bo.crmsvs.com"'
    //API_ROOT: '"http://api.svsmarkets.com"'
}
