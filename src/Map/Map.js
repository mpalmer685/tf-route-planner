import React from 'react'
import PropTypes from 'prop-types'
import includes from 'lodash/includes'
import { css } from 'react-emotion'
import fromRenderProps from 'recompose/fromRenderProps'
import MapContext from '../MapContext'
import Industry from './Industry'
import Label from './Label'
import Town from './Town'

const mapRoot = css(tw`overflow-hidden`)

class Map extends React.Component {
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
        let { size, towns, industries, displayedLabel, onSetDisplayedLabel, onSetSelectedDetail } = this.props
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
                    {includes(this.props.selectedFilters, 'towns') && (
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
                                    onSetSelectedDetail={onSetSelectedDetail}
                                />
                            ))}
                        </g>
                    )}
                    {includes(this.props.selectedFilters, 'industries') && (
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
                    )}
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

export default fromRenderProps(
    MapContext.Consumer,
    ({ mapData, displayedLabel, selectedFilters, onSetDisplayedLabel, onSetSelectedDetail }) => ({
        ...mapData,
        displayedLabel,
        selectedFilters,
        onSetDisplayedLabel,
        onSetSelectedDetail
    })
)(Map)
