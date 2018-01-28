## Contributing
### Translations

#### Setup
* Copy the file `src/translations/locales/en.json` and rename it to the two-character short of the new language
* Copy the file `src/translations/locales/en_whitelist.json` and rename it to the two-character short of the new language

OR (for the developers)

* Install all npm depencendies with `npm install`.
* Then add the two-character short of the new language to `scripts/translationRunner.js` to the language array.
* Run `npm run trans:all`

#### Translation
* Translate all texts in the [language].json file
  * {TEXT} should remain inside the text, it will be replaced by the code
* For texts that are the same in english -> your language please add the key on the left side to [language]_whitelist.json


#### Submitting
Add a new issue with both json files attached and a title saying `Translation: [...]`

OR (for the developers)

* Add the json file with the two-character short to `src/components/Wrapper.tsx` into the `localeData` object
* Add your language to `src/components/Pages/Settings.tsx` into the `Select` component below existing languages
  	* Follow this pattern: `<Option value="en">English</Option>`
    * Please use the last position, the dev team will decide to reorder the languages if it is neccessary
