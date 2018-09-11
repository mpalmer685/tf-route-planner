import React from 'react'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import { select } from '../store'
import ColorPicker from './ColorPicker'

const Container = styled('div')(tw`pt-1 min-h-full`)

const LineName = styled('h4')(tw`mb-2 mr-4 pr-2 border-1 border-transparent cursor-pointer hover:bg-blue-lightest`)
const EditButton = styled('span')(tw`opacity-0 text-sm font-normal float-right`)
const NameInput = styled('input')(tw`mb-2`)

const StopList = styled('ul')(tw`list-reset my-2`)
const Stop = styled('li')(tw`px-1 mb-1 rounded hover:bg-blue-lightest`)
const StopType = styled('div')`
    ${tw`inline-block w-3 h-3 mr-1`};
    ${props => (props.type === 'town' ? tw`rounded-full` : '')};
    background-color: ${props => (props.type === 'town' ? 'red' : 'orange')};
`
const RemoveStop = styled('button')`
    ${tw`relative float-right align-middle text-lg p-1 w-4 h-4 opacity-0 focus:outline-none active:text-grey-dark`};
    top: -0.3rem;
`

class LineDetail extends React.Component {
    state = {
        editingName: false,
        lineName: this.props.line.name
    }

    nameInput = React.createRef()

    componentDidMount() {
        document.addEventListener('mousedown', this.handleStopEditing, false)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleStopEditing, false)
    }

    componentDidUpdate() {
        if (this.state.editingName) {
            this.nameInput.current.focus()
        }
    }

    handleSetLineColor = color => {
        this.props.onUpdateLine({ ...this.props.line, color: color.hex })
    }

    handleSetEditing = () => {
        this.setState({ editingName: true })
    }

    handleStopEditing = event => {
        if (event && (!this.nameInput.current || this.nameInput.current.contains(event.target))) {
            return
        }
        this.setState({ editingName: false })
        this.props.onUpdateLine({ ...this.props.line, name: this.state.lineName })
    }

    handleNameChange = event => {
        this.setState({ lineName: event.target.value })
    }

    handleKeyDown = event => {
        if (event.key === 'Enter') {
            this.handleStopEditing()
        }
    }

    render() {
        const { line } = this.props
        return (
            <Container>
                {this.state.editingName ? this.renderEditLineName() : this.renderLineName()}
                <ColorPicker color={line.color} onSelectColor={this.handleSetLineColor} />
                <StopList>
                    {line.stops.map(({ name, type }) => (
                        <Stop key={name} className="group">
                            <StopType type={type} />
                            {name}
                            <RemoveStop
                                className="group-hover:opacity-100"
                                onClick={() => this.props.onRemoveStop({ lineId: line.id, stationName: name })}>
                                {'\u00d7'}
                            </RemoveStop>
                        </Stop>
                    ))}
                </StopList>
            </Container>
        )
    }

    renderLineName() {
        return (
            <LineName className="group" onClick={this.handleSetEditing}>
                {this.props.line.name}
                <EditButton className="group-hover:opacity-100">{'Edit'}</EditButton>
            </LineName>
        )
    }

    renderEditLineName() {
        return (
            <NameInput
                innerRef={this.nameInput}
                type="text"
                value={this.state.lineName}
                onChange={this.handleNameChange}
                onKeyDown={this.handleKeyDown}
            />
        )
    }
}

const mapState = select(models => ({ line: models.lines.line }))

const mapDispatch = ({ lines: { updateLine, removeStop } }) => ({ onUpdateLine: updateLine, onRemoveStop: removeStop })

export default connect(
    mapState,
    mapDispatch
)(LineDetail)
