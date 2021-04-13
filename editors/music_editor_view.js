import { NeoHTMLElement } from '../_.js';

export class MusicEditorView extends NeoHTMLElement {
  //
}

window.customElements.define('nv-musiceditor', MusicEditorView);

//     { name: 'Open', action: () => {
//       function open() {
//         window.showOpenFilePicker({ types: { description: 'nullv01d music', accept: { 'application/x-nullv01d-music': ['.nvm'] } } }).then(([handle]) => {
//           // TODO
//         });
//       }
      
//       if (this.hasUnsavedWork) {
//         showDialog('You have unsaved work. Do you want to save before opening a new file?', [
//           { text: 'Don\'t Save', action: () => {
//             open();
//           } },
//           { text: 'Save', action: () => {
//             if (fileHandle === null) {
//               // TODO: open file dialog 
//               window.showSaveFilePicker({ types: { description: 'nullv01d music', accept: { 'application/x-nullv01d-music': ['.nvm'] } } }).then(([handle]) => {
//                 // TODO
//               });
//             }
//             open();
//           } }
//         ]);
//       } else { open(); }
//     } },
  //   { name: 'Open', action: function () {
  //       return new Promise((resolve, reject) => window.showOpenFilePicker({ types: { description: 'nullv01d music', accept: { 'application/x-nullv01d-music': ['.nvm'] } } }).then(([handle]) => {
  //         // TODO
  //         this.fileHandle = handle;
  //       }));
  //   } },
  //   { name: 'Save', type: FunctionType.of([], Undefined), action: async function () {
  //     if (this.fileHandle === null) { throw `no file is open; cannot save`; }
  //     const writable = await this.fileHandle.createWritable();
  //     await writable.write(contents);
  //     await writable.close();
  //   } },
  //   { name: 'Save As', action: function () {
  //       return new Promise((resolve, reject) => window.showSaveFilePicker({ types: { description: 'nullv01d music', accept: { 'application/x-nullv01d-music': ['.nvm'] } } }).then(([handle]) => {
  //         const writable = await handle.createWritable();
  //         await writable.write(this.toString);
  //         await writable.close();
  //         resolve();
  //       }));
  //   } },
  //   { name: 'Close', action: function () {
  //     this.fileHandle = null;
  //   } },
