# CTD metadata previewer for SeaBird .hdr files

SeaBird CTD data often includes `.hdr` files with useful metadata. This example desktop application allows the user to upload the `.hdr` file, view metadata, and make corrections (currently the corrections don't get written anywhere).

## Installation

This is an [Electron](https://www.electronjs.org/)/[React](https://react.dev/) app and requires [Node](https://nodejs.org/en). After cloning this repository, follow these steps:

Install dependencies

```
npm install
```

Build the Javascript

```
npm run build
```

Launch the app

```
npm start
```

## Usage

You'll need a SeaBird `.hdr` file. Drag it onto the drop zone. To edit a timestap or latitude / longitude value, simply click on it and it will become editable.