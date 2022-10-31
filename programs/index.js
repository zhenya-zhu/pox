import NpmHandler from './npm.js'

const programs = {}

const registerProgram = (name, cls) => {
    if(programs[name]){
        throw new Error(`The program with the name ${name} already exist, please use another name`);
    }
    programs[name] = cls
    return programs[name]
}

registerProgram('npm', NpmHandler)

export default programs