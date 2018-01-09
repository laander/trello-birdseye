/**
 * Adds a button to the toolbar and when activated, applies .birdseye class to body
 */

// Initializes on first page load +
// uggggllly hax to continiously check whether user has switched page/board
document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    shouldInit()
    setInterval(shouldInit, 3000)
  }
}

// Checks whether the button element is present - if not (user switched page/board), then init
function shouldInit(event) {
  let buttonTarget = document.getElementsByClassName('board-header-btns mod-right')
  let buttonContainer = document.getElementsByClassName('birdseye-button')
  if (buttonTarget.length !== 0 && buttonContainer.length === 0) {
    initApplication()
  }
}

// Create the button and inject into to toolbar
function initApplication() {

  let buttonContainer = document.createElement('a')
  buttonContainer.className = 'birdseye-button board-header-btn'
  buttonContainer.setAttribute('href', '#')
  buttonContainer.setAttribute('id', 'BirdseyeToggle')
  buttonContainer.addEventListener('click', clickButton)

  let iconContainer = document.createElement('span')
  iconContainer.className = 'icon-sm icon-subscribe board-header-btn-icon'

  let textContainer = document.createElement('span')
  textContainer.className = 'board-header-btn-text u-text-underline'

  let text = document.createTextNode('Birds Eye')
  textContainer.appendChild(text)
  buttonContainer.appendChild(iconContainer)
  buttonContainer.appendChild(textContainer)

  let buttonTarget = document.getElementsByClassName('board-header-btns mod-right')[0]
  buttonTarget.insertBefore(buttonContainer, buttonTarget.firstChild)

  // When switching pages/boards, the button loses its enabled class, so re-add it
  let body = document.getElementsByTagName('body')[0]
  if (body.classList.contains('birdseye')) {
    buttonContainer.classList.toggle('board-header-btn-enabled')
  }

  BirdseyeLoadState()
}

// Clicking on the button triggers the class toggling
function clickButton() {
  let button = document.getElementById('BirdseyeToggle')
  setState(!(button.dataset.state == 'true' ? true : false))
}

function setState(state) {
  let button = document.getElementById('BirdseyeToggle')
  let body = document.getElementsByTagName('body')[0]

  if (state == true) {
    body.classList.add('birdseye')
    button.classList.add('board-header-btn-enabled')
  } else {
    body.classList.remove('birdseye')
    button.classList.remove('board-header-btn-enabled')
  }

  button.dataset.state = state
  BirdseyeSaveState(state)
}

function BirdseyeSaveState(state) {
  chrome.storage.sync.set({
    'BirdseyeState': state
  }, () => {})
}

function BirdseyeLoadState() {
  //Get the button state from chrome storage, if its different from what is set, set it to new state
  try {
    chrome.storage.sync.get('BirdseyeState', function (items) {
      if (items.BirdseyeState == true) {
        setState(true)
      } else {
        setState(false)
      }
    })
  } catch (e) {
    chrome.storage.sync.set({
      'BirdseyeState': false
    })
  }
}