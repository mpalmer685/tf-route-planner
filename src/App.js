import React from 'react'
import { hot } from 'react-hot-loader'
import includes from 'lodash/includes'
import ParseMapWorker from './parse-map.worker'
import Map from './Map'
import './App.css'

const SUPPORTED_FILE_TYPES = ['text/html', 'image/svg+xml']

class App extends React.Component {
    state = {
        count: 0,
        selectedFile: null,
        mapData: null,
        displayedLabel: null
    }

    componentDidMount() {
        this.worker = new ParseMapWorker()
        this.worker.addEventListener('message', event => this.setState({ mapData: event.data }))
    }

    fileTypeIsSupported() {
        return includes(SUPPORTED_FILE_TYPES, this.state.selectedFile.type)
    }

    handleFileChange = event => {
        this.setState({ selectedFile: event.target.files[0] })
    }

    handleProcessFile = () => {
        if (!this.state.selectedFile) {
            return
        }

        if (!this.fileTypeIsSupported()) {
            this.setState({ error: `Unsupported file type "${this.state.selectedFile.type}"` })
        }

        const reader = new FileReader()
        reader.onload = event => {
            this.worker.postMessage(event.target.result)
        }
        reader.readAsText(this.state.selectedFile)
    }

    handleSetDisplayedLabel = label => {
        this.setState({ displayedLabel: label })
    }

    render() {
        console.log(window.innerWidth, window.innerHeight)
        return (
            <div>
                <input type="file" accept={SUPPORTED_FILE_TYPES.join(',')} onChange={this.handleFileChange} />
                <button disabled={!this.state.selectedFile} onClick={this.handleProcessFile}>
                    Process file
                </button>
                {this.state.mapData && (
                    <Map
                        {...this.state.mapData}
                        displayedLabel={this.state.displayedLabel}
                        onSetDisplayedLabel={this.handleSetDisplayedLabel}
                    />
                )}
            </div>
        )
    }
}

export default hot(module)(App)
