# Calculator

| property |          type         |                               description                                |
|----------|-----------------------|--------------------------------------------------------------------------|
| visible  | * bool                | If true then calculator will be visible.                                 |
| value    | * string/number       | Value of calculator.                                                     |
| onChange | * func                | Occurs when calculator changed value.                                    |
| onClose  | * func                | Occurs if user click outside calculator or "OK" button has been pressed. |
| position | top/bottom/left/right | Position of calculator, relative parent element.                         |

## Calculator button

| property |   type  |              description               |
|----------|---------|----------------------------------------|
| text     | string  | Text of button.                        |
| icon     | object  | Icon, displayed before text.           |
| style    | object  | Inline style for root element.         |
| onClick  | func    | Occurs when user click on button.      |
| red      | bool    | If true then button will be red color. |
| menu     | element | Menu element attached to button.       |
| disabled | bool    | If true then button will be disabled.  |

## Calculator input field

|       property      |       type      |                               description                                |
|---------------------|-----------------|--------------------------------------------------------------------------|
| value               | * string/number | Value of input field.                                                    |
| onChange            | * func          | Occurs when input field change own value.                                |
| isExpression        | bool            | If true then calculator work in expression mode.                         |
| onOperationKeyPress | func            | Occurs when operation key pressed.                                       |
| onRemoveKeyPress    | func            | Occurs when "Backspace" key pressed.                                     |
| onPercentsKeyPress  | func            | Occurs when percents key pressed.                                        |
| onInputCleared      | func            | Occurs if required cleaning of calculator input and he has been cleared. |
| onMenuToggleClick   | func            | Occurs if user click on right button.                                    |
| clearInputRequired  | bool            | Occurs if input clearing is required.                                    |
| menu                | element         | React element whitch passing down to button.                             |
