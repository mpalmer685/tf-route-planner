import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import clamp from 'lodash/clamp'
import includes from 'lodash/includes'
import { css } from 'react-emotion'
import svgPanZoom from 'svg-pan-zoom'
import store from '../store'
import Label from './Label'
import Station from './Station'

const colors = {
    sky: '#B7DCE2',
    groundUs: '#A47F4B',
    groundEu: '#627C3F'
}

const mapRoot = css(tw`overflow-hidden`)

class Map extends React.Component {
    svg = React.createRef()

    state = {
        width: window.innerWidth,
        height: window.innerHeight,
        displayedLabel: null,
        scale: 1
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions)
        this.panZoomInstance = svgPanZoom(this.svg.current, {
            minZoom: 0.8,
            onZoom: scale => this.setState({ scale }),
            beforePan: this.handlePanLimits
        })
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

    handlePanLimits = (p1, p2) => {
        const { size } = this.props
        const scale = Math.max(size.width / this.state.width, size.height / this.state.height) / this.state.scale

        const xMin = this.state.width / 2 - size.width / scale
        const xMax = this.state.width / 2
        const x = clamp(p2.x, xMin, xMax)

        const yMin = this.state.height / 2 - size.height / scale
        const yMax = this.state.height / 2
        const y = clamp(p2.y, yMin, yMax)

        return { x, y }
    }

    handleSetDisplayedLabel = label => {
        this.setState({ displayedLabel: label })
    }

    render() {
        const { size, lines } = this.props
        const { scale: zoomScale } = this.state
        const onScreenFontSize = 10
        const scale = Math.max(size.width / this.state.width, size.height / this.state.height) / zoomScale
        const stations = this.getStations()
        return (
            <div className={mapRoot}>
                <svg
                    ref={this.svg}
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
                                displayedLabel={this.state.displayedLabel}
                                selectedDetail={this.props.selectedDetail}
                                onSetDisplayedLabel={this.handleSetDisplayedLabel}
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
                                displayedLabel={this.state.displayedLabel}>
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
    industries: PropTypes.any
}

const mapState = state => ({
    ...state.mapData,
    selectedDetail: state.display.detail,
    selectedFilters: state.settings.selectedFilters,
    selectedGroundColor: state.settings.selectedGroundColor,
    lines: store.select.lines.lines(state)
})

const mapDispatch = ({ lines: { addStop } }) => ({ onAddStop: addStop })

export default connect(
    mapState,
    mapDispatch
)(Map)
