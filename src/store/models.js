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
        updateStation: (state, station) => ({
            ...state,
            stationsById: { ...state.stationsById, [station.id]: station }
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
        'lines/addLine': (state, line) => ({ ...state, detail: { type: 'line', id: line.id } })
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
        addFilter: (state, filter) => ({ ...state, selectedFilters: [...state.selectedFilters, filter] }),
        removeFilter: (state, filter) => ({ ...state, selectedFilters: without(state.selectedFilters, filter) }),
        setGroundColor: (state, colorCode) => ({ ...state, selectedGroundColor: colorCode })
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
        addLine: (state, line) => ({
            ...state,
            lines: [...state.lines, line.id],
            linesById: { ...state.linesById, [line.id]: line },
            stopsByLine: { ...state.stopsByLine, [line.id]: [] }
        }),
        updateLine: (state, line) => ({ ...state, linesById: { ...state.linesById, [line.id]: line } }),
        addStop: (state, { lineId, station }) => {
            const stops = state.stopsByLine[lineId]
            return {
                ...state,
                stopsByLine: { ...state.stopsByLine, [lineId]: [...stops, station.name] },
                stations: { ...state.stations, [station.name]: station }
            }
        },
        removeStop: (state, { lineId, stationName }) => {
            const stops = state.stopsByLine[lineId]
            return {
                ...state,
                stopsByLine: { ...state.stopsByLine, [lineId]: without(stops, stationName) }
            }
        }
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
