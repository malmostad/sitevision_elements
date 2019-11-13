
# Video Playlist Element

This element replaces https://github.com/malmostad/sv-webbvideo

## Authorization

You need a Policy Key to authenticate: https://support.brightcove.com/policy-keys

Create a Policy Key using the API or the "Create Policy Key App":
https://support.brightcove.com/quick-start-policy-api

To create a Policy Key you will need Account ID, Client ID and Client Secret.


## Setup

### Element creation (first time only)

- Create a new element
- Add a script module to the element
- Add code from .js and .vm files to element
- Replace {POLICY_KEY} at bottom of JS-file with the Policy key you have created.
- Add variable to script module: playlistId (type single selection)
- Add options to variable (playlist name, playlist id) see video-playlist-options.txt
- Add variable to script module: videoLimit (type single selection)
- Add options to variable (4, 5 and 6)
- Export element

### Element modifications

- Change code in repo
- Change code in element
- Export element
- Import Add-on
- Set variable playlistId to first option, and select "Value must be overridden"
