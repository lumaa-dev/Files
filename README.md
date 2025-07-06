# Files
![Built with Nuxt.js](https://raw.githubusercontent.com/intergrav/devins-badges/refs/heads/v3/assets/compact/built-with/nuxtjs_vector.svg)\
A simple online file uploader and sharing service. Upload files, get a link, share it with anyone.

# Build
1. Clone the repository:
   ```bash
   git clone https://github.com/lumaa-dev/Files.git
   ```
2. Install the node.js modules:
   ```bash
   cd Files-main
   npm install
   ```
3. Set an admin password by creating a file named `admin.json` in the `server` directory with the following content:
   ```json
   {
     "password": "your_password_here"
   }
   ```
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

# License
This project is licensed under the Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) license. See the [LICENSE](./LICENSE) file for details.