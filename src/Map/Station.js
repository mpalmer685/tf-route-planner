import React from 'react'
import compose from 'recompose/compose'
import setDisplayName from 'recompose/setDisplayName'
import withHandlers from 'recompose/withHandlers'

const Size = {
    Town: 6,
    Industry: 10
}

const Town = {
    name: 'town',
    Component: 'circle',
    props: ({ x, y, scale }) => ({ cx: x, cy: y, r: scale * Size.Town, fill: 'red' })
}
const Industry = {
    name: 'industry',
    Component: 'rect',
    props: ({ x, y, scale }) => {
        const size = scale * Size.Industry
        return { x: x - size / 2, y: y - size / 2, width: size, height: size, fill: 'orange' }
    }
}

const StationInternal = ({ type, onMouseOver, onMouseOut, onClick, ...props }) => {
    const { Component, props: getProps } = type
    return <Component {...getProps(props)} onMouseOver={onMouseOver} onMouseOut={onMouseOut} onClick={onClick} />
}

const Station = compose(
    withHandlers({
        onMouseOver: ({ displayedLabel, name, onSetDisplayedLabel }) => () => {
            if (!displayedLabel) {
                onSetDisplayedLabel(name)
            }
        },
        onMouseOut: ({ displayedLabel, name, onSetDisplayedLabel }) => () => {
            if (displayedLabel === name) {
                onSetDisplayedLabel(null)
            }
        },
        onClick: ({ id, type, name, x, y, selectedDetail, onSetSelectedDetail, onAddStop }) => () => {
            if (selectedDetail && selectedDetail.type === 'line') {
                onAddStop({ lineId: selectedDetail.id, station: { name, x, y, type: type.name } })
                return
            }
            if (!selectedDetail || selectedDetail.type === 'industry' || selectedDetail.type === 'town') {
                onSetSelectedDetail({ type: type.name, id })
                return
            }
            console.log(selectedDetail)
        }
    }),
    setDisplayName('station')
)(StationInternal)

Station.Town = Town
Station.Industry = Industry

export default Station
