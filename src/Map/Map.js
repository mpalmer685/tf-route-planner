import React from 'react'
import Industry from './Industry'
import Label from './Label'
import Town from './Town'

const Map = ({ size, towns, industries, displayedLabel, onSetDisplayedLabel }) => {
    const onScreenFontSize = 10
    const scale = size.width / 500
    const onScreenTownSize = 6
    const onScreenIndustrySize = 10
    return (
        <svg width="500" height="500" viewBox={`0 0 ${size.width} ${size.height}`}>
            <rect x={0} y={0} height={size.height} width={size.width} fill="none" stroke="#666" strokeWidth="2" />
            <g>
                {towns.map(({ x, y, label }) => (
                    <Town
                        key={label}
                        x={x}
                        y={y}
                        size={scale * onScreenTownSize}
                        label={label}
                        displayedLabel={displayedLabel}
                        onSetDisplayedLabel={onSetDisplayedLabel}
                    />
                ))}
            </g>
            <g>
                {industries.map(({ x, y, label }) => (
                    <Industry
                        key={label}
                        x={x}
                        y={y}
                        size={scale * onScreenIndustrySize}
                        label={label}
                        displayedLabel={displayedLabel}
                        onSetDisplayedLabel={onSetDisplayedLabel}
                    />
                ))}
            </g>
            <g>
                {towns.map(({ x, y, label }) => (
                    <Label key={label} x={x} y={y} fontSize={scale * onScreenFontSize} displayedLabel={displayedLabel}>
                        {label}
                    </Label>
                ))}
                {industries.map(({ x, y, label }) => (
                    <Label key={label} x={x} y={y} fontSize={scale * onScreenFontSize} displayedLabel={displayedLabel}>
                        {label}
                    </Label>
                ))}
            </g>
        </svg>
    )
}

export default Map
