import React from 'react'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { GithubPicker } from 'react-color'
import styled from 'react-emotion'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withStateHandlers from 'recompose/withStateHandlers'
import Colors from '../config/colors'

const ColorPreview = styled('div')`
    ${tw`h-4 border-1 border-black cursor-pointer`};
    background-color: ${props => props.color};
`
const PickerContainer = styled('div')`
    ${tw`absolute`};
    transform: translate(-101%, -1.125rem);

    .github-picker {
        background-color: ${Colors['grey-lightest']} !important;
        border-radius: 0 !important;
    }
`

const ColorPicker = ({ color, open, onToggle, onSelectColor }) => (
    <div>
        <ColorPreview color={color} onClick={onToggle} />
        {open && (
            <PickerContainer>
                <GithubPicker
                    color={color}
                    colors={schemeCategory10}
                    triangle="hide"
                    width="137.5px"
                    onChangeComplete={onSelectColor}
                />
            </PickerContainer>
        )}
    </div>
)

export default compose(
    withStateHandlers(
        { open: false },
        {
            onToggle: ({ open }) => () => ({ open: !open })
        }
    ),
    withHandlers({
        onSelectColor: ({ onToggle, onSelectColor }) => (...args) => {
            onToggle()
            onSelectColor(...args)
        }
    })
)(ColorPicker)
