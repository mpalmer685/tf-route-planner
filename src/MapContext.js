import React from 'react'
import noOp from 'lodash/noop'

export default React.createContext({
    mapData: null,
    displayedLabel: null,
    onSetDisplayedLabel: noOp,
    selectedDetail: null,
    onSetSelectedDetail: noOp
})
