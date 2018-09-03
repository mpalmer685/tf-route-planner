import React from 'react'
import withLabel from './withLabel'

const Industry = ({ x, y, size, onShowLabel, onHideLabel }) => (
    <rect
        x={x - size / 2}
        y={y - size / 2}
        width={size}
        height={size}
        fill="orange"
        onMouseOver={onShowLabel}
        onMouseOut={onHideLabel}
    />
)

export default withLabel(Industry)
