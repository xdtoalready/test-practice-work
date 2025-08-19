import {makeAutoObservable} from "mobx";

export const themes = {
    light:'light',
    dark:'dark'
}
export class ThemeStore {
    theme = themes.light
    constructor(root) {
        this.root = root
        makeAutoObservable(this)
    }

    getTheme(){
        return this.theme
    }

    setTheme(){
        if(themes[this.theme] === themes.light)
            this.theme = themes.dark
        else  this.theme = themes.light
    }

    isDark(){
        return this.theme === themes.dark
    }

    isLight(){
        return this.theme === themes.light
    }



}