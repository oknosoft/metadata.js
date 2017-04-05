# Dialog

## Description
- Dialog automatically create portal for rendering outside main react tree.
- If dialog focused then he is rendering on top others dialogs.

#### Свойства

|      свойство     |  тип   |                                                          описание                                                          |
|-------------------|--------|----------------------------------------------------------------------------------------------------------------------------|
| title             | string | Title displayed in top right corner of dialog.                                                                             |
| tabs              | object | Object contains key-value pairs, where key is title of tab but value is tab content.                                       |
| visible           | bool   | If true then dialog is visible.                                                                                            |
| fullscreen        | bool   | If true then dialog rendering in fullscreen mode.                                                                          |
| resizable         | bool   | Property determing can dialog change own size. If changes of size is allowed then in bottom right corner displayed handle. |
| width             | number | Initial width of dialog.                                                                                                   |
| height            | number | Initial height of dialog.                                                                                                  |
| left              | number | Offset of dialog relative left border of browser. If passed `null` then dialog will be horizontally centered.              |
| top               | number | Offset of dialog relative top border of browser. If passed `null` then dialog will be vertically centered.                 |
| onCloseClick      | func   | Occurs if click on "Close" button.                                                                                         |
| onFullScreenClick | func   | Occurs if click on "Minimize/Maximize" buttton.                                                                            |
| actions           | array  | List of object displayed in bottom of dialog. Buttons for example.                                                         |
