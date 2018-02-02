# Contributing
## Translations

### Setup
* Copy the file `src/translations/locales/en.json` and rename it to the two-character short of the new language
* Copy the file `src/translations/locales/en_whitelist.json` and rename it to the two-character short of the new language

OR (for the developers)

* Fork the project
* Clone the fork
* Install all npm depencendies with `npm install`.
* Then add the two-character short of the new language to `scripts/translationRunner.js` to the language array.
* Run `npm run trans:all`

### Translation
* Translate all texts in the [language].json file
  * {TEXT} should remain inside the text, it will be replaced by the code
* For texts that are the same in english -> your language please add the key on the left side to [language]_whitelist.json


### Submitting
* Add a new issue with both json files attached and a title saying `Translation: [...]`

OR (for the developers)

* Add the json file with the two-character short to `src/components/Wrapper.tsx` into the `localeData` object
* Add your language to `src/components/Pages/Settings.tsx` into the `Select` component below existing languages
  	* Follow this pattern: `<Option value="en">English</Option>`
   * Please use the last position, the dev team will decide to reorder the languages if it is neccessary
   * Commit the new language and create a pull request

## Development
### Setup
* Fork the project
* Clone the fork
* Install all npm depencendies with `npm install`
* Its helpful to keep the garlicoind(.exe) running while developing

### Building
#### Test build
* Pack all files with `npm run build` use `npm run dev` if you want to repackage after each change
* To start the app use `npm run start`
* Make sure that, while testing in `client/main.js` `const dev` is always set to true while developing
* If you want to see the loading screen set `const demo` in `client/main.js` to true

#### Production build
* set `const dev` in `client/main.js` to true and `const demo` to false
* Pack all files with `npm run build`
* Build the app with `npm run dist`

### Submitting
* Commit your changes
* Create a pull request discribing your changes, if the dev team decides those changes are good we will merge it
