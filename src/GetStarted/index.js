import React from 'react'
import styled, { css } from 'react-emotion'
import Dropzone from 'react-dropzone'

const Container = styled.div(tw`max-w-sm m-auto py-16`)
const Card = styled.div(tw`border rounded shadow-md text-center p-8`)
const Title = styled.h2(tw`font-light`)

const dropzone = css`
    ${tw`text-center cursor-pointer`};

    .status {
        ${tw`h-32 w-32 border border-1 rounded-full inline-block mb-4`};
    }
`

class GetStarted extends React.Component {
    state = {
        selectedFile: null
    }

    handleDrop = files => {
        this.setState({ selectedFile: files[0] })
    }

    render() {
        return (
            <Container>
                <Dropzone className={dropzone} disablePreview accept={this.props.supportedFileTypes}>
                    <Card>
                        <div className="status" />
                        <Title>{'Drop your file or click to browse'}</Title>
                    </Card>
                </Dropzone>
            </Container>
        )
    }
}

export default GetStarted
