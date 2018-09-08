import withHandlers from 'recompose/withHandlers'

export default withHandlers({
    onShowDetail: ({ label, onSetSelectedDetail }) => () => {
        onSetSelectedDetail(label)
    }
})
