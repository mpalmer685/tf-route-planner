import React from 'react'
import { connect } from 'react-redux'
import styled, { cx } from 'react-emotion'
import posed from 'react-pose'
import compose from 'recompose/compose'
import withStateHandlers from 'recompose/withStateHandlers'
import Filters from './Filters'
import GroundColor from './GroundColor'
import Lines from './Lines'

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
const MenuSection = styled('div')(tw`mb-6`)

const Menu = ({
    open,
    availableFilters,
    selectedFilters,
    availableGroundColors,
    selectedGroundColor,
    onToggle,
    onAddFilter,
    onRemoveFilter,
    onSetGroundColor
}) => (
    <React.Fragment>
        <MenuContainer pose={open ? 'open' : 'closed'}>
            <MenuSection>
                <Lines />
            </MenuSection>
            <MenuSection>
                <Filters
                    availableFilters={availableFilters}
                    selectedFilters={selectedFilters}
                    onAddFilter={onAddFilter}
                    onRemoveFilter={onRemoveFilter}
                />
            </MenuSection>
            <MenuSection>
                <GroundColor
                    options={availableGroundColors}
                    selected={selectedGroundColor}
                    onChange={onSetGroundColor}
                />
            </MenuSection>
        </MenuContainer>
        <MenuButton pose={open ? 'open' : 'closed'} className={cx({ open })} onClick={onToggle}>
            <MenuButtonIcon />
        </MenuButton>
    </React.Fragment>
)

const mapState = state => ({
    availableFilters: state.settings.availableFilters,
    selectedFilters: state.settings.selectedFilters,
    availableGroundColors: state.settings.availableGroundColors,
    selectedGroundColor: state.settings.selectedGroundColor
})

const mapDispatch = ({ settings: { addFilter, removeFilter, setGroundColor } }) => ({
    onAddFilter: addFilter,
    onRemoveFilter: removeFilter,
    onSetGroundColor: setGroundColor
})

export default compose(
    withStateHandlers(
        { open: false },
        {
            onToggle: ({ open }) => () => ({ open: !open })
        }
    ),
    connect(
        mapState,
        mapDispatch
    )
)(Menu)
