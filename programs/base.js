import $ from 'shelljs'

class Base {

    constructor(db){
        this.db = db
    }

    getConfig(){
        return {
            name: 'base',
            start: {},
            stop: {},
            supportedModes: [],
            ls: `echo "default ls"`
        }
    }

    isSupport(mode){
        return this.getConfig().supportedModes.includes(mode)
    }

    async start(mode){
        if(!this.isSupport(mode)){
            throw new Error(`Program ${this.getConfig().name} does not support ${mode} proxy`)
        }
        const url = await this.getUrl(mode)
        const cmd = this.getConfig().start[mode](url)
        console.log(`cmd: ${cmd}, url:${url}`)
        return await $.exec(cmd)
    }

    async stop(mode){
        if(!this.isSupport(mode)){
            throw new Error(`Program ${this.getConfig().name} does not support ${mode} proxy`)
        }
        return await $.exec(this.getConfig().stop[mode])
    }

    async startAll(){
        for (const [mode, cmd] of Object.entries(this.getConfig().start)) {
            console.log(`start proxy ${mode} by ${cmd}`)
            await this.start(mode)
        }
    }

    async stopAll(){
        for (const [mode, cmd] of Object.entries(this.getConfig().stop)) {
            console.log(`stop proxy ${mode} by ${cmd}`)
            await this.stop(mode)
        }
    }

    async ls(){
        await $this.getConfig().ls
    }

    async getUrl(mode){
        return await this.db.getCurrentProfileUrl(mode)
    }

}

export default Base