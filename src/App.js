import React from 'react'
import { hot } from 'react-hot-loader'
import styled from 'react-emotion'
import GetStarted from './GetStarted'
import Map from './Map'
import Menu from './Menu'

const SUPPORTED_FILE_TYPES = ['text/html', 'image/svg+xml']

const Root = styled.div(tw`h-full w-full bg-grey-lighter`)

class App extends React.Component {
    state = {
        mapData: null,
        displayedLabel: null
    }

    handleProcessFile = mapData => {
        this.setState({ mapData })
    }

    handleSetDisplayedLabel = label => {
        this.setState({ displayedLabel: label })
    }

    render() {
        return <Root>{this.state.mapData ? this.renderMap() : this.renderGetStarted()}</Root>
    }

    renderGetStarted() {
        return <GetStarted supportedFileTypes={SUPPORTED_FILE_TYPES} onSubmitFile={this.handleProcessFile} />
    }

    renderMap() {
        return (
            <React.Fragment>
                <Map
                    {...this.state.mapData}
                    displayedLabel={this.state.displayedLabel}
                    onSetDisplayedLabel={this.handleSetDisplayedLabel}
                />
                <Menu />
            </React.Fragment>
        )
    }
}

export default hot(module)(App)
