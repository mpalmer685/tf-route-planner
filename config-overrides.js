const { compose } = require('react-app-rewired')
const rewireReactHotLoader = require('react-app-rewire-hot-loader')

function rewireWorkerLoader(config, env) {
    config.module.rules.push({
        test: /\.worker\.js$/,
        use: [{ loader: 'worker-loader' }]
    })
    return config
}

module.exports = compose(
    rewireWorkerLoader,
    rewireReactHotLoader
)
