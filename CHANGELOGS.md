# 1.0.3

## Added
- Open Graph for video files (mp4, webm, mov...)
- API nows has a `isVideo` boolean for files' information
- Adding `raw=true` to a file's URL query will redirect you to the file call in the Files API

## Fixed
- Obfuscation works even with multiple dots in file names

**Full Changelog**: https://github.com/lumaa-dev/Files/compare/1.0.2...1.0.3

# 1.0.2

## Changed
- Calling files now use `encodeURIComponent` to prevent issues with space characters (`%20` for example)

# 1.0.1

## Added
- Name obfuscation
- Privacy Policy using `@nuxt/content`

## Changed
- Better file reading using `<iframe>` instead of throwing error messages
- `admin.json` to `config.json`
- `README.md` file is clearer and talks about the new `config.json`

**Full Changelog**: https://github.com/lumaa-dev/Files/compare/1.0.0...1.0.1

# 1.0.0

## Initial Release