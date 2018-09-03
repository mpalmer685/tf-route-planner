import withHandlers from 'recompose/withHandlers'

export default withHandlers({
    onShowLabel: ({ displayedLabel, label, onSetDisplayedLabel }) => () => {
        if (!displayedLabel) {
            onSetDisplayedLabel(label)
        }
    },
    onHideLabel: ({ displayedLabel, label, onSetDisplayedLabel }) => () => {
        if (displayedLabel === label) {
            onSetDisplayedLabel(null)
        }
    }
})
