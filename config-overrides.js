const path = require('path')
const { compose, injectBabelPlugin } = require('react-app-rewired')
const { createEmotionRewire } = require('react-app-rewire-emotion')
const rewireReactHotLoader = require('react-app-rewire-hot-loader')
const rewirePostCss = require('react-app-rewire-postcss')
const autoprefixer = require('autoprefixer')
const tailwind = require('tailwindcss')

const loaderNameMatches = function loaderNameMatches(rule, loaderName) {
    return (
        rule &&
        rule.loader &&
        typeof rule.loader === 'string' &&
        (rule.loader.indexOf(`${path.sep}${loaderName}${path.sep}`) !== -1 ||
            rule.loader.indexOf(`@${loaderName}${path.sep}`) !== -1)
    )
}

const eslintLoaderMatcher = function eslintLoaderMatcher(rule) {
    return loaderNameMatches(rule, 'eslint-loader')
}

const getLoader = function getLoader(rules, matcher) {
    let loader

    rules.some(rule => {
        return (loader = matcher(rule)
            ? rule
            : getLoader(rule.use || rule.oneOf || (Array.isArray(rule.loader) && rule.loader) || [], matcher))
    })

    return loader
}

function rewireEslint(config) {
    const loader = getLoader(config.module.rules, eslintLoaderMatcher)
    if (!loader) {
        console.log('eslint-loader not found')
        return config
    }
    const options = loader.options || loader.query
    options.useEslintrc = true
    return config
}

function rewireWorkerLoader(config, env) {
    config.module.rules.push({
        test: /\.worker\.js$/,
        use: [{ loader: 'worker-loader' }]
    })
    return config
}

function createTailwindRewire(options) {
    return function(config, env) {
        rewirePostCss(config, options)
        return config
    }
}

function createBabelRewire(plugin) {
    return function(config, env) {
        return injectBabelPlugin(plugin, config)
    }
}

module.exports = compose(
    rewireEslint,
    rewireWorkerLoader,
    rewireReactHotLoader,
    createEmotionRewire({ inline: true }),
    createTailwindRewire({
        plugins: () => [tailwind('./src/config/tailwind.js'), autoprefixer]
    }),
    createBabelRewire(['tailwind-components', { config: './src/config/tailwind.js' }])
)
