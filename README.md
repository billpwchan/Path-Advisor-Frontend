# HKUST PathAdvisor frontend

To develop a plugin for this app, please fork this repository and create a merge request to upstream repository's develop branch when the plugin is implemented.

You can check out this [documentation](https://pathadvisor.ust.hk/docs) to understand how to develop a plugin.

To run the app locally, you will need node 8.x and npm 5.x installed. Please clone this repository and run
`npx bolt` then `npm start` in the root directory of the app. You should able to access the app locally at http://localhost:3000


The default REACT_APP_API_ENDPOINT_URI is set to https://pathadvisor.ust.hk/api. If you wish to use another API endpoint, you can override this environment variable when starting the app (i.e. `REACT_APP_API_ENDPOINT_URI=https://example.com npm start`) or create a .env.local file in the root directory of this project and in the .env.local file put `REACT_APP_API_ENDPOINT_URI=https://example.com`.
