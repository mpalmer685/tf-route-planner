import React from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import styled from 'react-emotion'
import compose from 'recompose/compose'
import Detail from './Detail'
import GetStarted from './GetStarted'
import Map from './Map'
import Menu from './Menu'

const Root = styled.div(tw`h-full w-full bg-grey-lighter`)

const App = ({ hasMapData }) => (
    <Root>
        {hasMapData ? (
            <React.Fragment>
                <Map />
                <Menu />
                <Detail />
            </React.Fragment>
        ) : (
            <GetStarted />
        )}
    </Root>
)

const mapState = state => ({ hasMapData: !!state.mapData })

export default compose(
    hot(module),
    connect(mapState)
)(App)
