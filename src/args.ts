const COMMAND_PATTERN = /^--|-/;
const ARTWORK_ONLY_PATTERN = /^--artwork-only|-a$/;
const OVERWRITE_PATTERN = /^--overwrite|-w$/;
const DEBUG_PATTERN = /^--debug|-d$/;
const THREADED_PATTERN = /^--thread|t$/;
const RECURSIVE_PATTERN = /^--recursive|r$/;

const args = process.argv.slice(2);
const commands: string[] = [];

export const inputs: string[] = [];

for (const item of args) {
  switch (true) {
    case ARTWORK_ONLY_PATTERN.test(item):
    case OVERWRITE_PATTERN.test(item): {
      commands.push(item);
      break;
    }
    case DEBUG_PATTERN.test(item): {
      commands.push(item);
      break;
    }
    case THREADED_PATTERN.test(item): {
      commands.push(item);
      break;
    }
    case RECURSIVE_PATTERN.test(item): {
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

if (inputs.length === 0) {
  throw new Error("Must provide song file path inputs");
}

export const artworkOnly: boolean = commands.some(item => ARTWORK_ONLY_PATTERN.test(item));
export const overwrite: boolean = commands.some(item => OVERWRITE_PATTERN.test(item));
export const debugMode: boolean = commands.some(item => DEBUG_PATTERN.test(item));
export const threaded: boolean = commands.some(item => THREADED_PATTERN.test(item));
export const recursive: boolean = commands.some(item => RECURSIVE_PATTERN.test(item));