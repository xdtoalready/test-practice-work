import {loadAvatar} from "../../utils/create.utils";

const createMembers = () => [
    {
        id: 0,
        image: loadAvatar(),
        name:
            'Александр',
        surname:
            'Александр1',
        role:
            'Директор'

    },
    {
        id: 1,
        image: loadAvatar(),
        name:
            'Александр',
        surname:
            'Александр2',
        role:
            'Директор'
    },
    {
        id: 2,
        image: loadAvatar(),
        name:
            'Александр',
        surname:
            'Александр3',
        role:
            'Директор'
    },
]

export default {createMembers}