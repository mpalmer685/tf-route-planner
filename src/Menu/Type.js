import styled from 'react-emotion'

const Header = styled('h2')(tw`mb-3`)
const Action = styled('a')`
    ${tw`bg-blue-lightest border-1 border-blue-light text-blue-light hover:border-blue hover:text-blue`};
    ${tw`cursor-pointer rounded px-1`};
`

export { Header, Action }
