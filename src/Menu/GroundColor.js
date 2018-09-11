import React from 'react'
import map from 'lodash/map'
import withHandlers from 'recompose/withHandlers'
import { Header } from './Type'

const GroundColor = ({ options, selected, onChange }) => (
    <div>
        <Header>{'Ground color'}</Header>
        <div>
            <select value={selected} onChange={onChange}>
                {map(options, ({ value, label }) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    </div>
)

export default withHandlers({
    onChange: ({ onChange }) => event => {
        onChange(event.target.value)
    }
})(GroundColor)
