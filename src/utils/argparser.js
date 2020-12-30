const yargs = require('yargs');
const Themes = require("../const/theme");
const { hideBin } = require('yargs/helpers')

class Argparser {
  constructor () {
    this.yargs = yargs
      .scriptName('github-profile-summary-cards')
      .usage('$0 <cmd> [args]')
      .command('run <user>', 'Generate github profile summary cards for our <user>', (args) => {
        args.positional('user', {
          description: 'user where retrieve data',
          demandOption: true,
          type: 'string'
        })
      })
      .option('token', {
        description: 'if provided, the github token to get the data',
        type: 'string'
      })
      .option('theme', {
        description: 'theme folder to generate',
        choices: Object.keys(Themes)
      })
      .help()
      .alias('h', 'help')
      .demandCommand(1);
  }

  parse (args) {
    const p = this.yargs.parse(hideBin(args))
    return {
      username: p._[0] || null,
      theme: p._[1] || null
    }
  }
}

module.exports = Argparser;
