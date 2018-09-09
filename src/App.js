import React from 'react'
import { hot } from 'react-hot-loader'
import styled from 'react-emotion'
import MapContext from './MapContext'
import Detail from './Detail'
import GetStarted from './GetStarted'
import Map from './Map'
import Menu from './Menu'
import * as state from './state'

const SUPPORTED_FILE_TYPES = ['text/html', 'image/svg+xml']

const Root = styled.div(tw`h-full w-full bg-grey-lighter`)

class App extends React.Component {
    state = {
        mapData: null,
        displayedLabel: null,
        onSetDisplayedLabel: displayedLabel => this.setState({ displayedLabel }),
        selectedDetail: null,
        onSetSelectedDetail: selectedDetail => this.setState({ selectedDetail }),
        selectedFilters: ['towns', 'industries', 'lines'],
        onSetSelectedFilters: selectedFilters => this.setState({ selectedFilters }),
        selectedGroundColor: 'us',
        onSetGroundColor: selectedGroundColor => this.setState({ selectedGroundColor }),
        lines: [],
        onAddLine: state.createAddLine(this.setState.bind(this)),
        onRenameLine: state.createRenameLine(this.setState.bind(this)),
        onChangeLineColor: state.createChangeLineColor(this.setState.bind(this)),
        onAddStop: state.createAddStop(this.setState.bind(this)),
        onRemoveStop: state.createRemoveStop(this.setState.bind(this))
    }

    handleProcessFile = mapData => {
        this.setState({ mapData })
    }

    render() {
        return <Root>{this.state.mapData ? this.renderMap() : this.renderGetStarted()}</Root>
    }

    renderGetStarted() {
        return <GetStarted supportedFileTypes={SUPPORTED_FILE_TYPES} onSubmitFile={this.handleProcessFile} />
    }

    renderMap() {
        return (
            <MapContext.Provider value={this.state}>
                <Map />
                <Menu />
                <Detail />
            </MapContext.Provider>
        )
    }
}

export default hot(module)(App)
