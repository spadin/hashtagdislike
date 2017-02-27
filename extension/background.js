chrome.runtime.onConnect.addListener(function(port) {
  chrome.webNavigation.onHistoryStateUpdated.addListener(({transitionType, url}) => {
    if(transitionType === "link") {
      port.postMessage({url});
    }
  });
});
