import React from 'react'
import styled from 'react-emotion'
import { connect } from 'react-redux'
import { schemeCategory10 } from 'd3-scale-chromatic'
import sample from 'lodash/sample'
import sortBy from 'lodash/sortBy'
import { css } from 'react-emotion'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import store from '../store'
import { Header, Action } from './Type'

const RemoveButton = styled('button')`
    ${tw`relative float-right align-middle text-lg p-1 w-4 h-4 opacity-0 focus:outline-none active:text-grey-dark`};
    top: -0.3rem;
`
const line = css(tw`cursor-pointer text-blue hover:text-blue-dark active:text-blue-darkest`)
const Line = withHandlers({
    onClick: ({ id, onClick }) => () => {
        onClick(id)
    },
    onRemove: ({ id, onRemove }) => () => {
        onRemove(id)
    }
})(({ name, onClick, onRemove }) => (
    <li className="group hover:bg-blue-lightest">
        <a className={line} onClick={onClick}>
            {name}
        </a>
        <RemoveButton className="group-hover:opacity-100" onClick={onRemove}>
            {'\u00d7'}
        </RemoveButton>
    </li>
))

const Lines = ({ lines, onAddLine, onLineClick, onRemoveLine }) => (
    <div>
        <Header>{'Lines'}</Header>
        <ul css={tw`mb-4 list-reset`}>
            {sortBy(lines, 'name').map(line => (
                <Line key={line.id} id={line.id} name={line.name} onClick={onLineClick} onRemove={onRemoveLine} />
            ))}
        </ul>
        <Action onClick={onAddLine}>{'Add line'}</Action>
    </div>
)

const mapState = store.select(models => ({
    lines: models.lines.lines
}))

const mapDispatch = ({ display: { setDetail }, lines: { addLine, removeLine } }) => ({ setDetail, addLine, removeLine })

export default compose(
    connect(
        mapState,
        mapDispatch
    ),
    withHandlers({
        onAddLine: ({ addLine }) => () => {
            const line = { name: 'New line', id: Date.now(), stops: [], color: sample(schemeCategory10) }
            addLine(line)
        },
        onLineClick: ({ setDetail }) => lineId => {
            setDetail({ type: 'line', id: lineId })
        },
        onRemoveLine: ({ removeLine }) => lineId => {
            removeLine(lineId)
        }
    })
)(Lines)
