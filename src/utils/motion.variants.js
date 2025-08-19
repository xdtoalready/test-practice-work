export const opacityTransition = {
    hidden: { opacity: 0,  },
    show: {
        opacity: 1,
        transition: {
            duration:0.2,
            delayChildren: 0.5,
            when:'beforeChildren'
        }
    }
}

export const opacityForSelectTranstion = {
    hidden: { opacity: 0, y:3  },
    show: {
        opacity: 1,
        y:0,
        transition: {
            duration:0.2,
            delayChildren: 0.2,
            when:'beforeChildren'
        }
    }

}

export const hoverTransition = {
    hover:{
        background:'red'
    }
}

export const hoverTable = {
    // initial:{
    //     background:'initial'
    // },
    // hover:{
    //     backgroundColor: '#F4F4F4',
    //     borderRadius:'8px',
    //     transition:{duration:0.3, ease}
    // }
}

export const TranslateYTransition = {
    hidden:{
        display:'none',
        y:'-25px',
        opacity:0,
        transition: {
            duration:0.2,
            ease: [0.17, 0.67, 0.83, 0.97]
        }
    },
    show: {
        opacity:1,
        y:'0',
        display:'block',
        transition: {
            duration:0.4,
            delayChildren: 0.5
        }
    }

}