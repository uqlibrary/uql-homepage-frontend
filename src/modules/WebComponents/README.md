# Web Components

This is to include Library Headers and Footers in foreign sites, eg search.library.uq.edu.au, just as the Polymer reusables do now.

## Method

A site eg search.library includes components.
Eg public/dummywebsite.html includes:
- a load.js file (that will tell it which components to grab)
- dist/webcomponentwrapper.js

Web pack creates eg webcomponents-0c019eb66528ca349a51.min.js which holds the /modules/Webcomponents/ entries, so they aren't included by the regular homepage
Webpack also generates dist/webcomponentwrapper.js, by knowing the hash (this is the webpack plugin Ive written)

Do an `npm run build` then run public/dummywebsite.html to preview the web components locally. 

2 appproaches currently in this folder:
- approach 1, as per https://medium.com/@gilfink/wrapping-react-components-inside-custom-elements-97431d1155bd
- approach 2, from https://www.npmjs.com/package/web-components-with-react

## Current Issues
While the UQ ITS simple-html components are importing well, the Library React components are not.
None of the styling comes in.
I think the styling for the WebComponents needs to be included in the component, not in a header block, either that or not minimise it.


## Hack for building components before deployment:

I havent yet spent time getting all the hashes into the filename calls. So, to get a build first time, do:
- `npm run build`
- inspect the file output at /dist/development and extract the hash from the filename, eg main-71b50b3fb04ce44ed5f2.min.css gives a hash of 71b50b3fb04ce44ed5f2 
- do a global search in the codebase (PHPStorm shift-Apple-F) for `homepage-react/dist/development`
- replace the hash found, eg cfe5320bb6afc419eba0 with the hash you got above
- IMPORTANT!!! now rerun `npm run build` (to burn in the hash - if you clear the dist folder you will need to repeat this process)

Plan to fix this with, maybe, https://www.npmjs.com/package/modify-source-webpack-plugin but unwilling to do that work before this approach is validated.

