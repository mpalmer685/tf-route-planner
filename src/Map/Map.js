import React, { Component } from 'react'
import { css } from 'react-emotion'
import Industry from './Industry'
import Label from './Label'
import Town from './Town'
import * as PropTypes from 'prop-types'

const mapRoot = css(tw`overflow-hidden`)

class Map extends Component {
    state = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions)
    }

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight })
    }

    render() {
        let { size, towns, industries, displayedLabel, onSetDisplayedLabel } = this.props
        const onScreenFontSize = 10
        const scale = Math.max(size.width / this.state.width, size.height / this.state.height)
        const onScreenTownSize = 6
        const onScreenIndustrySize = 10
        return (
            <div className={mapRoot}>
                <svg
                    className="block"
                    width={this.state.width}
                    height={this.state.height}
                    viewBox={`0 0 ${size.width} ${size.height}`}>
                    <rect
                        x={0}
                        y={0}
                        height={size.height}
                        width={size.width}
                        fill="none"
                        stroke="#666"
                        strokeWidth="2"
                    />
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
                            <Label
                                key={label}
                                x={x}
                                y={y}
                                fontSize={scale * onScreenFontSize}
                                displayedLabel={displayedLabel}>
                                {label}
                            </Label>
                        ))}
                        {industries.map(({ x, y, label }) => (
                            <Label
                                key={label}
                                x={x}
                                y={y}
                                fontSize={scale * onScreenFontSize}
                                displayedLabel={displayedLabel}>
                                {label}
                            </Label>
                        ))}
                    </g>
                </svg>
            </div>
        )
    }
}

Map.propTypes = {
    size: PropTypes.any,
    towns: PropTypes.any,
    industries: PropTypes.any,
    displayedLabel: PropTypes.any,
    onSetDisplayedLabel: PropTypes.any
}

export default Map
