var button = document.getElementById('generateBtn');
var card = document.getElementById('card-container');

card.src = chrome.runtime.getURL('images/colorlesscard.png');

button.addEventListener('click', function(event){
    var url = document.getElementById('urlInput').value;
    const container = document.getElementById('imageContainer');

    var img = document.getElementById('img');
    img.src = url;

    container.appendChild(img);
});
