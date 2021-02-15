# Offsite Applications

Our headers and footers can be included in third party sites, such as search.library.uq.edu.au.

Each of the folders in this directory map to one installation set of .js and .css that can be called from another site.

For each install:
- Create a sub-folder in /src/applications/ with a name (no spaces) that makes logical sense for the third party site, eg 'primo' for the Ex-Libris product "Primo", hosted on search.library.uq.edu.au
- Within that sub-folder
    - create a custom-styles.scss file containing any sass needed for special styling on the site, ie anything that needs to be reset to make the site work with our header/footer (the general homepage css will be automatically loaded)
    - create a load.js based on `sample-site/load.js` 
      - you can include/not include each of mylibrary button, auth button, footer at all, and connect footer (specified at the bottom of the file)
      - (load.js also tells the site to insert the react rootpoint as well as which of header, footer, etc we want to appear on this site.)
    - (unfortunately the whole set of code has to be included, as I couldnt get it to include a reusable file :( Feel free to have a go!)
- Write a readme that explains
  - what site(s) it will appear on,
  - which site items (login button, footer, etc) are allowed,
  - instructions on how to access the site to change these lines in future

When webpack runs it will create: 
- an /offSiteApps-js/ folder that contains minimised .js and .css for each application, renamed for the application
- a file (eg primo.js - it matches the name of the application folder) to hold code generated by webpack that will import the above minimised code

## How to use the created files

Insert the following (example) js into the external site (the external site has to give us a way to do that - it should be documented in the subfolder README)
```
<script src="https://www.library.uq.edu.au/primo.js"></script>
```

## How this is built:
- Webpack looks at the subfolders within /applications/ and creates a .js file with a name matching the subfolder eg creating `/applications/primo/` will mean webpack creates `primo.js`. Lets call this primo.js file the Loader file for the Primo Application.
- For each application subfolder, 
  - Webpack checks for custom-styles.scss and load.js.
  - if they are present, they are minified and written to the dist folder, inside the /offSiteApps-js/ folder in the dist. 
  - they are named for the subfolder, with a hash, 
- Webpack will generate the Loader file for each Application to include links to the minified code like the following:
  - The primo-999.min.css file shown comes from the custom-styles.scss in the /applications/primo/ folder.
  - The primo-999.min.js file shown comes from the load.js in the /applications/primo/ folder.
  - (there is other code in the file too)
  - the `locator` variable holds the location of the /offSiteApps-js/ folder.
```
insertScript(locator + 'vendor-ff02418c43d0f9e91ff1.min.js');
insertScript(locator + 'main-ff02418c43d0f9e91ff1.min.js');
insertLink(locator + 'main-ff02418c43d0f9e91ff1.min.css');

insertScript(locator + 'primo-ff02418c43d0f9e91ff1.min.js');
insertLink(locator + 'primo-ff02418c43d0f9e91ff1.min.css');
```
In summary:
- `applications/subfolder/custom-styles.scss` becomes `/dist/offSiteApps-js/subfolder-[hash]-min.css`
- `applications/subfolder/load.js` becomes `/dist/offSiteApps-js/subfolder-[hash]-min.js`
- `/dist/subfolder.js` is generated from nothing to import the above 2 files, and the general react.js minimised files.

The build is done via `npm run build:offSiteApps`, a second build that creates the files for all these off-site applications in one run.