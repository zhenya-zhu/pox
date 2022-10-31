import path from 'path'
import fse from 'fs-extra'
import fs from 'fs'
import os from 'os'

const initDbJson = {
    use: '',
    profiles:{},
}

class DB {
    constructor(){
        this.homedir = os.homedir()
        this.dbDir = path.join(this.homedir, '.pox')
        if (!fs.existsSync(this.dbDir)){
            this.initDb()
        }
    }

    initDb(){
        console.log('no local db file, init...')
        fse.writeJsonSync(this.dbDir, initDbJson)
    }

    async readDb(){
        return (await fse.readJSON(this.dbDir))
    }

    async writeDb(content){
        console.log(`write to file`, content)
        return (await fse.writeJson(this.dbDir, content))
    }

    async saveProfile(name, profile){
        if(!name || !profile){
            throw new Error(`invalid profile ${name} ${profile}`)
        }
        const db = await this.readDb()
        db.profiles[name] = profile
        await this.writeDb(db)
    }

    async getProfile(name){
        if(!name){
            throw new Error(`Please provide profile name`)
        }
        const db = await this.readDb()
        if(!db.profiles[name]){
            throw new Error('No such profile in pox')
        }
        return db.profiles[name]
    }

    async getProfiles(){
        return await this.readDb()['profiles']
    }

    async getCurrentProfile(){
        const db = await this.readDb()
        const currentProfileName = db['use']
        const currentProfile = db['profiles'][currentProfileName]
        if(!currentProfile){
            throw new Error(`currnet profile is empty`)
        }
        return currentProfile
    }

    async getCurrentProfileUrl(mode){
        const url = (await this.getCurrentProfile())[mode]
        if(!url){
            throw new Error(`No such url in such profile and ${mode} mode, ${url}`)
        }
        return url
    }

    async getCurrentProfileName(){
        const db = await this.readDb()
        const currentProfileName = db['use']
        return currentProfileName
    }

    async switchProfile(name){
        const db = await this.readDb()
        if(!db['profiles'][name]){
            // TODO: show error
            console.error(`There is no profile named ${name}, please use a existed profile`)
            return
        }
        db['use'] = name
        await this.writeDb(db)
    }
}

export default DB