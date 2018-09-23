import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import { select } from '../store'

const Container = styled('div')(tw`pt-1 min-h-full`)
const StationName = styled('h4')(tw`mb-2 mr-4 pr-2 border-1 border-transparent cursor-pointer hover:bg-blue-lightest`)
const EditButton = styled('span')(tw`opacity-0 text-sm font-normal float-right`)
const NameInput = styled('input')(tw`mb-2`)

class StationDetail extends React.Component {
    static propTypes = {}

    state = {
        editingName: false,
        stationName: this.props.station.name
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

    handleSetEditing = () => {
        this.setState({ editingName: true })
    }

    handleStopEditing = event => {
        if (event && (!this.nameInput.current || this.nameInput.current.contains(event.target))) {
            return
        }
        this.setState({ editingName: false })
        this.props.onUpdateStation({ ...this.props.station, name: this.state.stationName })
    }

    handleNameChange = event => {
        this.setState({ stationName: event.target.value })
    }

    handleKeyDown = event => {
        if (event.key === 'Enter') {
            this.handleStopEditing()
        }
    }

    render() {
        console.log(this.props)
        return <Container>{this.state.editingName ? this.renderEditStationName() : this.renderStationName()}</Container>
    }

    renderStationName() {
        return (
            <StationName className="group" onClick={this.handleSetEditing}>
                {this.props.station.name}
                <EditButton className="group-hover:opacity-100">{'Edit'}</EditButton>
            </StationName>
        )
    }

    renderEditStationName() {
        return (
            <NameInput
                innerRef={this.nameInput}
                type="text"
                value={this.state.stationName}
                onChange={this.handleNameChange}
                onKeyDown={this.handleKeyDown}
            />
        )
    }
}

const mapState = select(models => ({ station: models.mapData.station }))

const mapDispatch = ({ mapData: { updateStation } }) => ({ onUpdateStation: updateStation })

export default connect(
    mapState,
    mapDispatch
)(StationDetail)
