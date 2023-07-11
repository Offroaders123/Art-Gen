const COMMAND_PATTERN = /^--|-/;
const ARTWORK_ONLY_PATTERN = /^--artwork-only|-a$/;
const OVERWRITE_PATTERN = /^-y|-n$/;

const args = process.argv.slice(2);
const commands: string[] = [];

export const inputs: string[] = [];

for (const item of args){
  switch (true){
    case ARTWORK_ONLY_PATTERN.test(item):
    case OVERWRITE_PATTERN.test(item): {
      commands.push(item);
      break;
    }
    case COMMAND_PATTERN.test(item): {
      throw new Error(`Unexpected command '${item}'`);
    }
    default: {
      inputs.push(item);
    }
  }
}

if (inputs.length === 0){
  throw new Error("Must provide song file path inputs");
}

export const artworkOnly: boolean = commands.some(item => ARTWORK_ONLY_PATTERN.test(item));
export const overwrite: boolean = (commands.find((item): item is "-y" | "-n" => OVERWRITE_PATTERN.test(item)) ?? "-n") === "-y";