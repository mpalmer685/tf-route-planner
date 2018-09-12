import { init } from '@rematch/core'
import selectPlugin from '@rematch/select'
import createPersistPlugin from '@rematch/persist'
import localForage from 'localforage'
import * as models from './models'

const persistPlugin = createPersistPlugin({
    storage: localForage,
    version: 1,
    whitelist: ['mapData', 'settings', 'lines']
})

export const store = init({
    models,
    plugins: [selectPlugin(), persistPlugin]
})

export const { select } = store

export default store
