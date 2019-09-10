interface Arguments {
  /** Non-option arguments */
  _: string[];

  /** The script name or node command */
  $0: string;

  /** All remaining options */
  [argName: string]: unknown;
}

declare const argv: Arguments;
export = argv;
