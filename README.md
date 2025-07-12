# Files
![Built with Nuxt.js](https://github.com/intergrav/devins-badges/blob/v3/assets/compact/built-with/nuxtjs_vector.svg?raw=true)
![Built with Vue.js](https://github.com/intergrav/devins-badges/blob/v3/assets/compact/built-with/vuejs_vector.svg?raw=true)\
![GitHub Actions](https://github.com/lumaa-dev/Files/actions/workflows/nuxtjs-build.yml/badge.svg)\
A simple online file uploader and sharing service. Upload files, get a link, share it with anyone.

# Build
*Assuming you already have node.js with version >=20*

1. Clone the repository:
   ```bash
   git clone https://github.com/lumaa-dev/Files.git
   ```
2. Install the npm modules:
   ```bash
   cd Files-main
   npm install # or use any other package manager
   ```
3. Setup your Files' configuration using the table below, in the [*Config*](#config) section, with all the necessary keys and values.
4. Build & start:
   - For development:
     ```bash
     # Dev environment
     npm run dev

     # Production environment
     npm run build && npm run preview
     ```
   - For production:
     ```bash
     npm run build && node .output/server/index.mjs
     ```

# Config
The config file can be located in the `server` directory as `config.json`, in there, you can find all sorts of configuration to make your Files instance uniquely yours. All configuration keys are necessary for Files to run, unless specified.

| **Key** | **Type** | **Description** |
|---------|----------|-----------------|
| `password` | string  | The admin password for your Files instance
| `obfuscateName` | boolean  | If set to true, new files uploaded will get an obfuscated name

* * *

For example, here is a valid `config.json` file:
```json
{
   "password": "lumaa-dev/Files",
   "obfuscateName": false
}
```

# License
This project is licensed under the Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) license. See the [LICENSE](./LICENSE) file for details.