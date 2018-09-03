import React from 'react'
import withLabel from './withLabel'

const Town = ({ x, y, size, onShowLabel, onHideLabel }) => (
    <circle cx={x} cy={y} r={size} fill="red" onMouseOver={onShowLabel} onMouseOut={onHideLabel} />
)

export default withLabel(Town)
