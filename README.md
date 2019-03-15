# inv-tech-location-weather

## Installation

1. Clone this repo locally and then `cd` into the cloned project directory.
2. Install dependencies
3. Build the files

```sh
npm install
npm run build
```

## Configuration

The list of locations is stored in `locations.json` – edit this file to get additonal results.

## Running

After following the installation instructions, from the command line, in the root project directory, run

```sh
node dist/index.js
```

> Alternately you can run the .ts files directly (without building first) by running `ts-node src/index.ts`

The ouput will be printed to the terminal. The output is meant to be comma seperated values, so you can pipe the output to a new .csv file and open as a spreadsheet.

## Note

The API Key from Accuweather is on a very limited trial. You may use up all the API calls quickly. That's one reason for caching location codes to disk.

---

This is a coding exercise.
