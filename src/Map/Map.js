import React from 'react'
import PropTypes from 'prop-types'
import includes from 'lodash/includes'
import { css } from 'react-emotion'
import fromRenderProps from 'recompose/fromRenderProps'
import MapContext from '../MapContext'
import Label from './Label'
import Station from './Station'

const colors = {
    sky: '#B7DCE2',
    groundUs: '#A47F4B',
    groundEu: '#627C3F'
}

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

    getStations() {
        const { towns, industries, selectedFilters } = this.props
        const stations = []
        if (includes(selectedFilters, 'industries')) {
            stations.push(...industries.map(i => ({ ...i, type: Station.Industry })))
        }
        if (includes(selectedFilters, 'towns')) {
            stations.push(...towns.map(t => ({ ...t, type: Station.Town })))
        }
        return stations
    }

    render() {
        const { size, lines } = this.props
        const onScreenFontSize = 10
        const scale = Math.max(size.width / this.state.width, size.height / this.state.height)
        const stations = this.getStations()
        return (
            <div className={mapRoot}>
                <svg
                    className="block"
                    width={this.state.width}
                    height={this.state.height}
                    viewBox={`0 0 ${size.width} ${size.height}`}>
                    <rect
                        x={-size.width}
                        y={-size.height}
                        width={3 * size.width}
                        height={3 * size.height}
                        fill={colors.sky}
                    />
                    <rect
                        x={0}
                        y={0}
                        height={size.height}
                        width={size.width}
                        fill={this.props.selectedGroundColor === 'us' ? colors.groundUs : colors.groundEu}
                    />
                    {includes(this.props.selectedFilters, 'lines') && (
                        <g>
                            {lines.map(line => (
                                <polyline
                                    key={line.id}
                                    points={line.stops.map(({ x, y }) => [x, y].join(',')).join(' ')}
                                    stroke={line.color}
                                    strokeWidth={scale * 2}
                                    fill="none"
                                />
                            ))}
                        </g>
                    )}
                    <g>
                        {stations.map(station => (
                            <Station
                                key={station.label}
                                scale={scale}
                                {...station}
                                displayedLabel={this.props.displayedLabel}
                                selectedDetail={this.props.selectedDetail}
                                onSetDisplayedLabel={this.props.onSetDisplayedLabel}
                                onSetSelectedDetail={this.props.onSetSelectedDetail}
                                onAddStop={this.props.onAddStop}
                            />
                        ))}
                    </g>
                    <g>
                        {stations.map(({ x, y, label }) => (
                            <Label
                                key={label}
                                x={x}
                                y={y}
                                fontSize={scale * onScreenFontSize}
                                displayedLabel={this.props.displayedLabel}>
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

export default fromRenderProps(MapContext.Consumer, ({ mapData, ...props }) => ({ ...mapData, ...props }))(Map)
