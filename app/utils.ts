export const loadTemplate = (type: string, code: { html: string, css: string }) => {
  if (type === 'button') {
    code.html = `<button class="botton">
  Button
</button>`
    code.css = `.botton {
  /* * Make your button styling here! 
   * Try changing color or background.
   */
  padding: 12px 24px;
  background-color: #212121;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.botton:hover {
  background-color: #333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}`
  }
  else if (type === 'toggle') {
    code.html = `<label class="switch">
  <input type="checkbox">
  <span class="slider"></span>
</label>`
    code.css = `.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}`
  }
  else if (type === 'input') {
    code.html = `<input type="text" class="input">
  Input
</input>`
    code.css = `.input {
  padding: 12px 24px;
  background-color: #212121;
  color: white;
}`
  }
  else if (type === 'card') {
    code.html = `<div class="card">
  Card
</div>`
    code.css = `.card {
  padding: 12px 24px;
  background-color: #212121;
  color: white;
}`
  }
  else if (type === 'loader') {
    code.html = `<div class="loader">
  Loader
</div>`
    code.css = `.loader {
  padding: 12px 24px;
  background-color: #212121;
  color: white;
}`
  }
  else if (type === 'checkbox') {
    code.html = `<input type="checkbox" class="checkbox">
  Checkbox
</input>`
    code.css = `.checkbox {
  padding: 12px 24px;
  background-color: #212121;
  color: white;
}`
  }
  else if (type === 'radio') {
    code.html = `<input type="radio" class="radio">
  Radio
</input>`
    code.css = `.radio {
  padding: 12px 24px;
  background-color: #212121;
  color: white;
}`
  }
  else if (type === 'select') {
    code.html = `<select class="select">
  Select
</select>`
    code.css = `.select {
  padding: 12px 24px;
  background-color: #212121;
  color: white;
}`
  }
  else if (type === 'textarea') {
    code.html = `<textarea class="textarea">
  Textarea
</textarea>`
    code.css = `.textarea {
  padding: 12px 24px;
  background-color: #212121;
  color: white;
}`
  }
  else if (type === 'dropdown') {
    code.html = `<div class="dropdown">
  Dropdown
</div>`
    code.css = `.dropdown {
  padding: 12px 24px;
  background-color: #212121;
  color: white;
}`
  }
  else if (type === 'modal') {
    code.html = `<div class="modal">
  Modal
</div>`
    code.css = `.modal {
  padding: 12px 24px;
  background-color: #212121;
  color: white;
}`
  }
  else if (type === 'tooltip') {
    code.html = `<div class="tooltip">
  Tooltip
</div>`
    code.css = `.tooltip {
  padding: 12px 24px;
  background-color: #212121;
  color: white;
}`
  }
  return code
}
