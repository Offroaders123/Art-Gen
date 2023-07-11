import { access } from "node:fs/promises";

const COMMAND_PATTERN = /^--|-/;
const ARTWORK_ONLY_PATTERN = /^--artwork-only|-a$/;

const args = process.argv.slice(2);
const commands: string[] = [];

export const inputs: string[] = [];

for (const item of args){
  switch (true){
    case ARTWORK_ONLY_PATTERN.test(item): {
      commands.push(item);
      break;
    }
    case COMMAND_PATTERN.test(item): {
      throw new Error(`Unexpected command '${item}'`);
    }
    default: {
      await access(item);
      inputs.push(item);
    }
  }
}

if (inputs.length === 0){
  throw new Error("Must provide song file path inputs");
}

export const artworkOnly = commands.some(item => ARTWORK_ONLY_PATTERN.test(item));