import React from 'react'
import includes from 'lodash/includes'
import map from 'lodash/map'
import styled from 'react-emotion'
import withHandlers from 'recompose/withHandlers'
import withProps from 'recompose/withProps'
import { Header } from './Type'

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

const Filters = ({ availableFilters, selectedFilters, onUpdateFilter }) => (
    <div>
        <Header>{'Filter'}</Header>
        <div>
            {map(availableFilters, type => (
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
    onUpdateFilter: ({ onAddFilter, onRemoveFilter }) => event => {
        if (event.target.checked) {
            onAddFilter(event.target.name)
        } else {
            onRemoveFilter(event.target.name)
        }
    }
})(Filters)
