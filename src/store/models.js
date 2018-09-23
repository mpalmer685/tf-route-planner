import produce from 'immer'
import map from 'lodash/map'
import reduce from 'lodash/reduce'
import without from 'lodash/without'

const mapData = {
    state: null,
    reducers: {
        setData: (state, { size, towns, industries }) => {
            const stations = [...towns, ...industries]
            const stationsById = reduce(
                stations,
                (all, station) => {
                    all[station.id] = station
                    return all
                },
                {}
            )
            return { size, stationsById, stations: map(stations, 'id') }
        },
        updateStation: produce((state, station) => {
            state.stationsById[station.id] = station
        })
    },
    selectors: (slice, createSelector) => ({
        stations() {
            return slice(state => {
                const { stations, stationsById } = state
                return map(stations, id => stationsById[id])
            })
        },
        station() {
            return createSelector(
                slice,
                (state, props) => props.stationId,
                (state, stationId) => state.stationsById[stationId]
            )
        }
    })
}

const display = {
    state: {
        detail: null
    },
    reducers: {
        setDetail: (state, detail) => ({ ...state, detail }),
        'lines/addLine': produce((state, line) => {
            state.detail = { type: 'line', id: line.id }
        }),
        'lines/removeLine': produce((state, lineId) => {
            if (state.detail && state.detail.id === lineId) {
                state.detail = null
            }
        })
    }
}

const FILTERS = ['towns', 'industries', 'lines']

const settings = {
    state: {
        selectedFilters: FILTERS,
        availableFilters: FILTERS,
        availableGroundColors: [{ value: 'us', label: 'America' }, { value: 'eu', label: 'Europe' }],
        selectedGroundColor: 'us'
    },
    reducers: {
        addFilter: produce((state, filter) => {
            state.selectedFilters.push(filter)
        }),
        removeFilter: produce((state, filter) => {
            state.selectedFilters = without(state.selectedFilters, filter)
        }),
        setGroundColor: produce((state, colorCode) => {
            state.selectedGroundColor = colorCode
        })
    }
}

const lines = {
    state: {
        lines: [],
        linesById: {},
        stopsByLine: {},
        stations: {}
    },
    reducers: {
        addLine: produce((state, line) => {
            state.lines.push(line.id)
            state.linesById[line.id] = line
            state.stopsByLine[line.id] = []
        }),
        updateLine: produce((state, line) => {
            state.linesById[line.id] = line
        }),
        removeLine: produce((state, lineId) => {
            state.lines = without(state.lines, lineId)
            delete state.linesById[lineId]
            delete state.stopsByLine[lineId]
        }),
        addStop: produce((state, { lineId, station }) => {
            state.stopsByLine[lineId].push(station.name)
            state.stations[station.name] = station
        }),
        removeStop: produce((state, { lineId, stationName }) => {
            state.stopsByLine[lineId] = without(state.stopsByLine[lineId], stationName)
        })
    },
    selectors: (slice, createSelector) => ({
        lines() {
            return slice(state => {
                const { lines, linesById, stopsByLine, stations } = state
                return lines.map(lineId => ({
                    ...linesById[lineId],
                    stops: stopsByLine[lineId].map(name => stations[name])
                }))
            })
        },
        line() {
            return createSelector(
                slice,
                (state, props) => props.lineId,
                (state, lineId) => ({
                    ...state.linesById[lineId],
                    stops: state.stopsByLine[lineId].map(name => state.stations[name])
                })
            )
        }
    })
}

export { mapData, display, settings, lines }
