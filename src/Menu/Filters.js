import React from 'react'
import includes from 'lodash/includes'
import map from 'lodash/map'
import without from 'lodash/without'
import styled from 'react-emotion'
import withHandlers from 'recompose/withHandlers'
import withProps from 'recompose/withProps'
import { Header } from './Type'

const FILTER_TYPES = ['towns', 'industries']

const CheckboxInput = withProps({ type: 'checkbox' })(styled('input')`
    ${tw`relative mr-2`};
    top: 1px;
`)
const Checkbox = ({ children, ...props }) => (
    <label>
        <CheckboxInput {...props} />
        {children}
    </label>
)

const Filters = ({ selectedFilters, onUpdateFilter }) => (
    <div>
        <Header>{'Filter'}</Header>
        <div>
            {map(FILTER_TYPES, type => (
                <div key={type}>
                    <Checkbox name={type} checked={includes(selectedFilters, type)} onChange={onUpdateFilter}>
                        {`Show ${type}`}
                    </Checkbox>
                </div>
            ))}
        </div>
    </div>
)

export default withHandlers({
    onUpdateFilter: ({ selectedFilters: lastSelectedFilters, onSetSelectedFilters }) => event => {
        const selectedFilters = event.target.checked
            ? [...lastSelectedFilters, event.target.name]
            : without(lastSelectedFilters, event.target.name)
        onSetSelectedFilters(selectedFilters)
    }
})(Filters)
