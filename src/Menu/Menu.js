import React from 'react'
import styled, { cx } from 'react-emotion'
import posed from 'react-pose'
import compose from 'recompose/compose'
import fromRenderProps from 'recompose/fromRenderProps'
import withStateHandlers from 'recompose/withStateHandlers'
import MapContext from '../MapContext'
import Filters from './Filters'

const transition = {
    type: 'spring',
    stiffness: 100,
    damping: 13
}

const menuButtonPoses = {
    open: { x: '11.5rem', transition },
    closed: { x: '0%', transition }
}
const MenuButton = styled(posed.button(menuButtonPoses))`
    ${tw`fixed w-10 h-10 rounded-full shadow-md hover:shadow-lg focus:outline-none`};
    ${tw`bg-white opacity-50 hover:opacity-75`};
    top: 1rem;
    left: 1rem;
    transition: box-shadow 200ms, opacity 200ms;
`
const MenuButtonIcon = styled.div`
    ${tw`relative w-6 h-1 bg-grey mx-2 rounded-full opacity-100`};
    transition: background-color 200ms;

    &:before,
    &:after {
        ${tw`absolute w-6 h-1 bg-grey rounded-full pin-l`};
        content: '';
        transition: transform 200ms;
    }

    &:before {
        top: -0.5rem;
    }

    &:after {
        top: 0.5rem;
    }

    .open & {
        ${tw`bg-transparent`};

        &:before {
            transform: translate(0, 0.5rem) rotate(45deg);
        }

        &:after {
            transform: translate(0, -0.5rem) rotate(-45deg);
        }
    }
`

const menuPoses = {
    open: { x: '-2rem', transition },
    closed: { x: '-100%', transition }
}
const MenuContainer = styled(posed.div(menuPoses))`
    ${tw`fixed pin-y pin-l pl-10 pt-10 pr-2 bg-grey-lightest shadow-md`};
    width: 18rem;
`

const Menu = ({ open, selectedFilters, onToggle, onSetSelectedFilters }) => (
    <React.Fragment>
        <MenuContainer pose={open ? 'open' : 'closed'}>
            <Filters selectedFilters={selectedFilters} onSetSelectedFilters={onSetSelectedFilters} />
        </MenuContainer>
        <MenuButton pose={open ? 'open' : 'closed'} className={cx({ open })} onClick={onToggle}>
            <MenuButtonIcon />
        </MenuButton>
    </React.Fragment>
)

export default compose(
    withStateHandlers(
        { open: false },
        {
            onToggle: ({ open }) => () => ({ open: !open })
        }
    ),
    fromRenderProps(MapContext.Consumer, ({ selectedFilters, onSetSelectedFilters }) => ({
        selectedFilters,
        onSetSelectedFilters
    }))
)(Menu)
