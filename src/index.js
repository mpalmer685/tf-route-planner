import React from 'react'
import ReactDOM from 'react-dom'
import { getPersistor } from '@rematch/persist'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'
import { unregister } from './registerServiceWorker'
import './index.css'

const persistor = getPersistor()

ReactDOM.render(
    <PersistGate persistor={persistor}>
        <Provider store={store}>
            <App />
        </Provider>
    </PersistGate>,
    document.getElementById('root')
)
unregister()
