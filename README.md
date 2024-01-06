## Page Time Tracker
<!---
[![npx version](https://img.shields.io/npm/v/npx.svg)](https://npm.im/npx)
![Chrome Web Store](https://img.shields.io/chrome-web-store/rating/lmmmdnmgmgnimgcfbnomdgeldehlfafn)
![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/lmmmdnmgmgnimgcfbnomdgeldehlfafn)
--->
[![GitHub Discussions](https://img.shields.io/github/discussions/mimieam/TimeTab)](https://npm.im/npx)
![GitHub repo size](https://img.shields.io/github/repo-size/mimieam/TimeTab)


> How long has this page been opened for?
> This tiny Chrome extension allows a user to see how long a tab has been open.

## Screenshots
<img width="232" alt="image" src="https://github.com/Mimieam/TimeTab/assets/834291/5588a97b-5251-486d-83f7-bfeb8fb2bf54">
<img width="345" alt="image" src="https://github.com/Mimieam/TimeTab/assets/834291/119a140a-518e-4d96-a06c-7a53ea26e433">


## Getting Started 
```
1. Clone this repository
2. Open `chrome://extensions` in your browser
3. Enable Developer mode if needed
4. Click "Load unpacked" and select the project folder
5. The extension will now be installed
```
or
```
npm -g npx && npm start  
```



## Using the Extension
When installed, a small T icon will appear on the browser toolbar to indicate that the extension is live.

The extension UI will appear at the bottom right corner of a page when a tab is opened or reloaded


## Technical Overview
The extension uses the Browser API to get access to open tabs and windows. 
- `tracking.mjs`  - setup and handle events to be tracked within a page (user events, mouse move, clicks, ...etc) 
- `background.mjs` -  setup and handle events to be tracked on the Tab itself (when a Tab is created/loaded) 
- `content.ui.mjs` contains the logic to update the ui.
<br> 
Note: this extension has no bundlers & no dependencies besides npx which is installed globally.

## Roadmap
Some potential future features include:

- Notifications after certain periods
- Exporting data for reports
- Tracking across browser sessions
- Customizable view

## Known limitations
- The extension can be minimized but not dismissed from a page.
- the content when expended is too verbose

## Contributing
Pull requests are welcome! Please open an issue first to discuss any changes.

## License
The Unlicense

Please let me know if you need any part of the README expanded on or have additional questions! 
