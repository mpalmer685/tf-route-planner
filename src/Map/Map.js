import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import includes from 'lodash/includes'
import { css } from 'react-emotion'
import svgPanZoom from 'svg-pan-zoom'
import store from '../store'
import StationType from '../StationType'
import Label from './Label'
import Station from './Station'

const colors = {
    sky: '#B7DCE2',
    groundUs: '#A47F4B',
    groundEu: '#627C3F'
}

const mapRoot = css(tw`overflow-hidden`)

const getScale = (mapSize, windowSize, zoomFactor) =>
    Math.max(mapSize.width / windowSize.width, mapSize.height / windowSize.height) / zoomFactor

const initialState = (mapSize, window) => {
    const windowSize = { width: window.innerWidth, height: window.innerHeight }
    return {
        windowSize,
        displayedLabel: null,
        scale: getScale(mapSize, windowSize, 1)
    }
}

class Map extends React.Component {
    static propTypes = {
        size: PropTypes.shape({
            width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
        }).isRequired,
        stations: PropTypes.arrayOf(
            PropTypes.shape({
                stationType: PropTypes.oneOf(Object.keys(StationType)).isRequired
            })
        ).isRequired,
        selectedDetail: PropTypes.object,
        selectedFilters: PropTypes.array.isRequired,
        selectedGroundColor: PropTypes.oneOf(['us', 'eu']).isRequired,
        lines: PropTypes.array.isRequired,

        onAddStop: PropTypes.func.isRequired,
        onSetSelectedDetail: PropTypes.func.isRequired
    }

    svg = React.createRef()

    state = initialState(this.props.size, window)

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions)
        this.panZoomInstance = svgPanZoom(this.svg.current, {
            minZoom: 0.8,
            onZoom: zoomFactor =>
                this.setState({ scale: getScale(this.props.size, this.state.windowSize, zoomFactor) }),
            beforePan: this.handlePanLimits
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions)
    }

    updateDimensions = () => {
        this.setState({ windowSize: { width: window.innerWidth, height: window.innerHeight } })
    }

    getStations() {
        const { stations, selectedFilters } = this.props
        return stations.filter(isIncluded).map(s => ({ ...s, type: getType(s.stationType) }))

        function isIncluded(station) {
            switch (station.stationType) {
                case StationType.Industry:
                    return includes(selectedFilters, 'industries')
                case StationType.Town:
                    return includes(selectedFilters, 'towns')
                default:
                    throw new Error(`Unrecognized station type "${station.stationType}"`)
            }
        }

        function getType(type) {
            switch (type) {
                case StationType.Industry:
                    return Station.Industry
                case StationType.Town:
                    return Station.Town
                default:
                    throw new Error(`Unrecognized station type "${type}"`)
            }
        }
    }

    handlePanLimits = (p1, p2) => {
        const { size } = this.props
        const { windowSize, scale } = this.state

        const xMin = windowSize.width / 2 - size.width / scale
        const xMax = windowSize.width / 2

        const yMin = windowSize.height / 2 - size.height / scale
        const yMax = windowSize.height / 2

        return { x: xMin < p2.x && xMax > p2.x, y: yMin < p2.y && yMax > p2.y }
    }

    handleSetDisplayedLabel = label => {
        this.setState({ displayedLabel: label })
    }

    render() {
        const { size, lines } = this.props
        const { scale, windowSize } = this.state
        const onScreenFontSize = 10
        const stations = this.getStations()
        return (
            <div className={mapRoot}>
                <svg
                    ref={this.svg}
                    className="block"
                    width={windowSize.width}
                    height={windowSize.height}
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
                                key={station.id}
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
                        {stations.map(({ x, y, name }) => (
                            <Label
                                key={name}
                                x={x}
                                y={y}
                                fontSize={scale * onScreenFontSize}
                                displayedLabel={this.state.displayedLabel}>
                                {name}
                            </Label>
                        ))}
                    </g>
                </svg>
            </div>
        )
    }
}

const mapState = state => ({
    size: state.mapData.size,
    stations: store.select.mapData.stations(state),
    selectedDetail: state.display.detail,
    selectedFilters: state.settings.selectedFilters,
    selectedGroundColor: state.settings.selectedGroundColor,
    lines: store.select.lines.lines(state)
})

const mapDispatch = ({ display: { setDetail }, lines: { addStop } }) => ({
    onAddStop: addStop,
    onSetSelectedDetail: setDetail
})

export default connect(
    mapState,
    mapDispatch
)(Map)
