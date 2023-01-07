## input value

```
let inputValue = document.getElementById(elementId).value;
The property 'value' does not exist on value of type 'HTMLElement'

let inputValue = e.target.value
The property 'value' does not exist on type 'EventTarget'

// 解决方法1
let inputValue = (<HTMLInputElement>document.getElementById(elementId)).value;

// 解决方法2
let inputValue = (document.getElementById(elementId) as HTMLInputElement).value
```