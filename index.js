#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
// const cac = require('cac')
import DB from './db.js';
import programs from './programs/index.js'
const db = new DB();

const cli = new Command();
cli.name('pox').description('CLI to proxy easier').version('0.0.1');

console.log('hello');

/**
 * if we use zx to execute export..., will it run in current terminal or childprocess?
 * if it run in child process, will current terminal be affected?
 */

/**
 * what
 */

cli
  .command('create')
  .description('create a proxy profile to save proxy modes and urls')
  .action(async (profile_name, ...args) => {
    console.log('create action');
    console.log(profile_name);
    console.log(args);
    // create profile and save
    const { name } = await inquirer.prompt({
      name: 'name',
      type: 'input',
    });
    const { modes } = await inquirer.prompt({
      name: 'modes',
      type: 'checkbox',
      choices: ['http', 'https', 'sock4', 'sock5'],
      default: ['http', 'https'],
    });

    function autoCompleteUrl(mode) {
      return (userInput) => {
        return userInput;
      };
    }

    function validateUrl(mode) {
      return (url) => {
        return true;
      };
    }

    const urls = {};
    async function requestUrl(mode) {
      if (modes.includes(mode)) {
        const ans = await inquirer.prompt({
          name: `${mode}_url`,
          type: 'input',
          message: `${mode} url`,
          validate: validateUrl(mode),
          filter: autoCompleteUrl(mode),
        });
        urls[mode] = ans[`${mode}_url`];
      }
    }
    console.log(modes);
    for (let mode of modes) {
      await requestUrl(mode);
    }
    console.log(urls);

    // todo: save modes and urls to json file
    db.saveProfile(name, urls);
  });

cli
  .command('ls <target>')
  .description('list')
  .action(async (target) => {
    switch (target) {
      case 'program':
        // TODO: ls supported program
        break;
      case 'profiles':
        let profiles = await db.getProfiles();
        // TODO: ls
        console.log(profiles);
        break;
    }
  });

cli
  .command('start')
  .argument('<program>')
  .argument('[mode]')
  .description('start proxing a program')
  .action(async (program, mode) => {
    console.log(`start `, program, mode)
    const Prog = programs[program]
    if(!Prog){
      console.error(`does not support program ${program}, supported programs: ${supportedPrograms}`)
      return
    }
    const prog = new Prog(db)
    const supportedPrograms = Object.keys(programs)
    if(!mode){
      await prog.startAll()
    }else{
      if(!prog.getConfig().supportedModes.includes(mode)){
        throw new Error(`program ${program} does not support mode ${mode}`)
      }
      await prog.start(mode)
    }
  });

  cli
  .command('stop')
  .argument('<program>')
  .argument('[mode]')
  .description('stop proxing a program')
  .action(async (program, mode) => {
    console.log(`stop `, program, mode)
    const Prog = programs[program]
    if(!Prog){
      console.error(`does not support program ${program}, supported programs: ${supportedPrograms}`)
      return
    }
    const prog = new Prog(db)
    const supportedPrograms = Object.keys(programs)
    if(!mode){
      await prog.stopAll()
    }else{
      if(!prog.getConfig().supportedModes.includes(mode)){
        throw new Error(`program ${program} does not support mode ${mode}`)
      }
      await prog.stop(mode)
    }
  });

cli.command('use <profile>')
.description('switch to profile')
.action((profile)=>{
  db.switchProfile(profile)
})

// cli.help()
cli.parse();

// cli.command('proxy');
