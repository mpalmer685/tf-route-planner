import { schemeCategory10 } from 'd3-scale-chromatic'
import findIndex from 'lodash/findIndex'
import sample from 'lodash/sample'
import sortBy from 'lodash/sortBy'

function createAddLine(setState) {
    return function addLine() {
        const line = { name: 'New line', id: Date.now(), stops: [], color: sample(schemeCategory10) }
        setState(state => ({
            selectedDetail: { type: 'line', id: line.id },
            lines: sortBy([...state.lines, line], 'name')
        }))
    }
}

function createRenameLine(setState) {
    return function renameLine(lineId, name) {
        setState(state => {
            const lineIndex = findIndex(state.lines, ['id', lineId])
            return {
                lines: state.lines.map((line, index) => {
                    if (index !== lineIndex) {
                        return line
                    }
                    return { ...line, name }
                })
            }
        })
    }
}

function createChangeLineColor(setState) {
    return function changeLineColor(lineId, color) {
        setState(state => {
            const lineIndex = findIndex(state.lines, ['id', lineId])
            return {
                lines: state.lines.map((line, index) => {
                    if (index !== lineIndex) {
                        return line
                    }
                    return { ...line, color }
                })
            }
        })
    }
}

function createAddStop(setState) {
    return function addStop(lineId, station) {
        setState(state => {
            const lineIndex = findIndex(state.lines, ['id', lineId])
            return {
                lines: state.lines.map((line, index) => {
                    if (index !== lineIndex) {
                        return line
                    }
                    return { ...line, stops: [...line.stops, station] }
                })
            }
        })
    }
}

function createRemoveStop(setState) {
    return function removeStop(lineId, stationName) {
        setState(state => {
            const lineIndex = findIndex(state.lines, ['id', lineId])
            return {
                lines: state.lines.map((line, index) => {
                    if (index !== lineIndex) {
                        return line
                    }
                    return { ...line, stops: line.stops.filter(stop => stop.name !== stationName) }
                })
            }
        })
    }
}

export { createAddLine, createAddStop, createRenameLine, createRemoveStop, createChangeLineColor }
