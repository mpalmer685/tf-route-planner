import React from 'react'
import compose from 'recompose/compose'
import withDetail from './withDetail'
import withLabel from './withLabel'

const Town = ({ x, y, size, onShowLabel, onHideLabel, onShowDetail }) => (
    <circle
        cx={x}
        cy={y}
        r={size}
        fill="red"
        onMouseOver={onShowLabel}
        onMouseOut={onHideLabel}
        onClick={onShowDetail}
    />
)

export default compose(
    withDetail,
    withLabel
)(Town)
