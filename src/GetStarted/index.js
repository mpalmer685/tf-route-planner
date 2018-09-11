import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled, { css, cx, keyframes } from 'react-emotion'
import Dropzone from 'react-dropzone'
import Colors from '../config/colors'
import ParseMapWorker from '../parse-map.worker'
import FileIcon from './FileIcon'

const Container = styled.div(tw`py-16`)
const Card = styled.div(tw`w-128 mx-auto border rounded-lg shadow-lg text-center bg-white`)
const Title = styled.h2(tw`font-light text-4xl mb-2 mt-4`)
const Subtitle = styled.span(tw`font-light text-lg`)
const Hidden = styled.div(props => (props.if ? tw`hidden` : {}))
const Error = styled.div`
    ${props => (props.active ? null : tw`hidden`)};
    ${tw`p-4 leading-normal text-lg`};
`

const dropzone = css(tw`text-center cursor-pointer p-16`)

const loadingAnimation = keyframes`
    from {
        transform: scale(1);
    }
    to {
        transform: scale(0.6);
    }
`

// prettier-ignore
const statusIndicator = css`
    ${tw`h-64 w-64 relative rounded-full inline-block mb-4 inline-flex items-center justify-center`};
    box-shadow: 0 0 0 4px ${Colors['grey-light']};
    transition: box-shadow 400ms;
    
    svg {
        transition: opacity 400ms;
    }
`
const statusIndicatorActive = css`
    box-shadow: 0 0 0 4px ${Colors['green-light']}, inset 0 0 64px ${Colors['green-light']};

    svg {
        opacity: 0.25;
    }
`
const statusIndicatorLoading = css`
    box-shadow: none;

    &:after {
        ${tw`absolute pin rounded-full`};
        content: '';
        box-shadow: 0 0 48px 2px ${Colors['green-light']}, inset 0 0 48px 2px ${Colors['green-light']};
        animation: ${loadingAnimation} 1s ease-in-out infinite alternate;
    }

    svg {
        opacity: 0;
    }
`
const statusIndicatorError = css`
    box-shadow: 0 0 0 4px ${Colors['red-light']};
`

const SUPPORTED_FILE_TYPES = ['text/html', 'image/svg+xml']

class GetStarted extends React.Component {
    static propTypes = {
        onSubmitFile: PropTypes.func.isRequired
    }

    state = {
        loading: false,
        error: null
    }

    componentDidMount() {
        this.worker = new ParseMapWorker()
        this.worker.addEventListener('message', event => this.props.onSubmitFile(event.data))
        this.worker.onerror = event => {
            this.setState({ loading: false, error: true })
            console.warn(event.message)
            event.preventDefault()
        }
    }

    handleResetError = () => {
        this.setState({ error: false })
    }

    handleDrop = files => {
        if (files.length === 0) {
            return
        }

        this.setState({ loading: true })
        const reader = new FileReader()
        reader.onload = event => {
            this.worker.postMessage(event.target.result)
        }
        reader.readAsText(files[0])
    }

    render() {
        return (
            <Container>
                <Card>
                    <Dropzone
                        className={dropzone}
                        disablePreview
                        accept={SUPPORTED_FILE_TYPES}
                        onDragEnter={this.handleResetError}
                        onDrop={this.handleDrop}>
                        {({ isDragAccept }) => (
                            <React.Fragment>
                                <div
                                    className={cx(statusIndicator, {
                                        [statusIndicatorActive]: isDragAccept,
                                        [statusIndicatorLoading]: this.state.loading,
                                        [statusIndicatorError]: this.state.error
                                    })}>
                                    <Error active={this.state.error}>
                                        {`There was an error processing the file.
                                        That file type may not be supported yet.`}
                                    </Error>
                                    <Hidden if={this.state.error}>
                                        <FileIcon />
                                    </Hidden>
                                </div>
                                <Hidden if={this.state.loading}>
                                    <Title>{'Drag your file here'}</Title>
                                    <Subtitle>{'or click to browse'}</Subtitle>
                                </Hidden>
                                <Hidden if={!this.state.loading}>
                                    <Title>{'Generating map...'}</Title>
                                    <Subtitle>{'This could take a moment'}</Subtitle>
                                </Hidden>
                            </React.Fragment>
                        )}
                    </Dropzone>
                </Card>
            </Container>
        )
    }
}

const mapDispatch = ({ mapData: { setData } }) => ({ onSubmitFile: setData })

export default connect(
    null,
    mapDispatch
)(GetStarted)
