function first(selector) {
  const els = document.querySelectorAll(selector);
  if(els.length > 0) {
    return els[0];
  }
}

function getOrCreateDislikesCountNode() {
  const existingNode = first(".js-stat-dislikes");
  if(existingNode) {
    return existingNode;
  }
  else {
    const similarNode = first(".stat-count");

    if(similarNode) {
      const newNode = similarNode.cloneNode(true);
      newNode.className = "js-stat-count js-stat-dislikes stat-count";

      // Insert new node.
      document.querySelector(".stats").insertBefore(
        newNode,
        document.querySelector(".avatar-row")
      );

      updateCount(newNode, 0);

      // Return new node to be modified.
      return newNode;
    }
  }
}

function updateCount(node, count) {
  const title = '#dislikes';
  node.innerHTML = `<a>${title}<strong>${Number(count).toLocaleString()}</strong></a>`
}

async function getDislikeCount(tweetId, fn) {
  const data = await fetch(`http://localhost:8888/dislikes/${tweetId}`);
  const json = await data.json();
  return json.total;
}

async function showDislikeCount(tweetId) {
  const count = await getDislikeCount(tweetId);
  const countNode = getOrCreateDislikesCountNode();

  if(countNode) {
    updateCount(countNode, count);
  }
}

function handleUrlChange(url) {
  const re = new RegExp(/twitter.com\/[^\/]*\/status\/(\d*)/);
  const matches = url.match(re);

  if(matches !== null) {
    const tweetId = matches[1];
    showDislikeCount(tweetId);
  }
}

var port = chrome.runtime.connect();
port.onMessage.addListener(({url}) => {
  handleUrlChange(url);
});

handleUrlChange(document.location.href);
