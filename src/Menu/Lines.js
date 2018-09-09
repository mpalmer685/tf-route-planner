import React from 'react'
import { css } from 'react-emotion'
import compose from 'recompose/compose'
import fromRenderProps from 'recompose/fromRenderProps'
import withHandlers from 'recompose/withHandlers'
import MapContext from '../MapContext'
import { Header, Action } from './Type'

const line = css(tw`cursor-pointer text-blue hover:text-blue-dark active:text-blue-darkest`)
const Line = withHandlers({
    onClick: ({ id, onClick }) => () => {
        onClick(id)
    }
})(({ name, onClick }) => (
    <li>
        <a className={line} onClick={onClick}>
            {name}
        </a>
    </li>
))

const Lines = ({ lines, onAddLine, onLineClick }) => (
    <div>
        <Header>{'Lines'}</Header>
        <ul css={tw`mb-4 list-reset`}>
            {lines.map(line => (
                <Line key={line.id} id={line.id} name={line.name} onClick={onLineClick} />
            ))}
        </ul>
        <Action onClick={onAddLine}>{'Add line'}</Action>
    </div>
)

export default compose(
    fromRenderProps(MapContext.Consumer, ({ lines, onAddLine, onSetSelectedDetail }) => ({
        lines,
        onAddLine,
        onSetSelectedDetail
    })),
    withHandlers({
        onLineClick: ({ onSetSelectedDetail }) => lineId => {
            onSetSelectedDetail({ type: 'line', id: lineId })
        }
    })
)(Lines)
