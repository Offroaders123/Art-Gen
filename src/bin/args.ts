const COMMAND_PATTERN = /^--/;
const ARTWORK_ONLY_PATTERN = /^--artwork-only|-a$/;
const OVERWRITE_PATTERN = /^--overwrite|-w$/;

const args: string[] = process.argv.slice(2);
const commands: string[] = [];

process.on("uncaughtException",error => {
  console.error(`${error}`);
  process.exit(1);
});

export const inputs: string[] = [];

for (const arg of args){
  switch (true){
    case ARTWORK_ONLY_PATTERN.test(arg):
    case OVERWRITE_PATTERN.test(arg): commands.push(arg); break;
    case COMMAND_PATTERN.test(arg): throw new Error(`Unexpected command '${arg}'`);
    default: inputs.push(arg); break;
  }
}

if (inputs.length === 0){
  throw new Error("Must provide song file path inputs");
}

export const artworkOnly: boolean = commands.some(item => ARTWORK_ONLY_PATTERN.test(item));
export const overwrite: boolean = commands.some(item => OVERWRITE_PATTERN.test(item));