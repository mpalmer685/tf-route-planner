import React from 'react'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import posed from 'react-pose'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import LineDetail from './LineDetail'
import StationDetail from './StationDetail'

const transition = {
    type: 'tween'
}
const cardPose = {
    open: { opacity: 1, x: '0%', transition },
    closed: { opacity: 0, x: '100%', transition }
}
const DetailContainer = styled(posed.div(cardPose))`
    ${tw`fixed w-64 min-h-64 p-3 bg-grey-lightest shadow rounded`};
    top: 1rem;
    right: 1rem;
`
const CloseButton = styled('button')`
    ${tw`relative float-right align-middle text-xl p-1 w-4 h-4 focus:outline-none active:text-grey-dark`};
    top: -0.5rem;
`

const Detail = ({ selectedDetail, onClose }) => (
    <DetailContainer pose={selectedDetail ? 'open' : 'closed'}>
        <CloseButton onClick={onClose}>{'\u00d7'}</CloseButton>
        {selectedDetail && <div>{renderDetail(selectedDetail)}</div>}
    </DetailContainer>
)

function renderDetail(selectedDetail) {
    switch (selectedDetail.type) {
        case 'line':
            return <LineDetail lineId={selectedDetail.id} />
        case 'town':
        case 'industry':
            return <StationDetail stationId={selectedDetail.id}/>
        default:
            return null
    }
}

const mapState = state => ({ selectedDetail: state.display.detail })

const mapDispatch = ({ display: { setDetail } }) => ({ onSetSelectedDetail: setDetail })

export default compose(
    connect(
        mapState,
        mapDispatch
    ),
    withHandlers({
        onClose: ({ onSetSelectedDetail }) => () => onSetSelectedDetail(null)
    })
)(Detail)
