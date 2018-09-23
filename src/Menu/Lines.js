import React from 'react'
import { connect } from 'react-redux'
import { schemeCategory10 } from 'd3-scale-chromatic'
import sample from 'lodash/sample'
import sortBy from 'lodash/sortBy'
import { css } from 'react-emotion'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import store from '../store'
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
            {sortBy(lines, 'name').map(line => (
                <Line key={line.id} id={line.id} name={line.name} onClick={onLineClick} />
            ))}
        </ul>
        <Action onClick={onAddLine}>{'Add line'}</Action>
    </div>
)

const mapState = store.select(models => ({
    lines: models.lines.lines
}))

const mapDispatch = ({ display: { setDetail }, lines: { addLine } }) => ({ setDetail, addLine })

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
        }
    })
)(Lines)
