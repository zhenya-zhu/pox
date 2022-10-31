import Base from './base.js'

class NPM extends Base{
    getConfig(){
        return {
            name: 'npm',
            start:{
                'http': (url) => `npm config --global set proxy ${url}`,
                'https': (url) => `npm config --global set https-proxy ${url}`,
            },
            stop: {
                'http': 'npm config delete proxy',
                'https': 'npm config delete https-proxy'
            },
            ls: 'npm config ls',
            supportedModes: ['http', 'https']
        }
    }
}

export default NPM