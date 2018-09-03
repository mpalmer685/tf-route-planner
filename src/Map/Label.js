import React from 'react'

const Label = ({ x, y, children, fontSize, displayedLabel }) => (
    <text x={x} y={y} style={{ fontSize, opacity: children === displayedLabel ? 1 : 0, pointerEvents: 'none' }}>
        {children}
    </text>
)

export default Label
