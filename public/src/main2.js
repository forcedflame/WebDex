const generateBtn = document.getElementById("generateBtn");
const urlInput = document.getElementById("urlInput");
const cardImage = document.getElementById("img");
const description = document.getElementById("description");
const card = document.getElementById("card");

const cardName = document.getElementById("card-name");
const cardEffect = document.getElementById("card-effect");
const level = document.getElementById("card-level");
const atk = document.getElementById("card-atk");
const def = document.getElementById("card-def");
const attribute = document.getElementById("attribute");

const poke = document.getElementById("pokemon");
const yugi = document.getElementById("yugioh");

let cardNameM = "";
let cardEffectM = "";
let cardLevelM = "";
let cardATKM = "";
let cardDEFM = "";
let cardAttributeM = "";

let pokeBool = true;
let yugiBool = false;

document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    if(button.id === 'pokemon'){
      pokeBool = true;
      yugiBool = false;
      card.src = "colorlesscard.png";

      cardImage.style.top = "37px"; /* position from the top */
      cardImage.style.left = "23px"; /* position from the left */
      cardImage.style.width = "204px"; /* size of the overlay image */
      cardImage.style.height = "136px";
      cardImage.style.position = "absolute";


    }else if(button.id === 'yugioh'){
      pokeBool = false;
      yugiBool = true;
      card.src = "yugiohcard.jpg";

      cardImage.style.top = "67px"; /* position from the top */
      cardImage.style.left = "30px"; /* position from the left */
      cardImage.style.width = "190px"; /* size of the overlay image */
      cardImage.style.height = "190px";
      cardImage.style.position = "absolute";

    }
  });
});

function traitScrape(text, prefix, ending){
  const startIndex = text.indexOf(prefix);
  if (startIndex === -1) return null;

  const afterPrefix = text.substring(startIndex + prefix.length);
  const endIndex = afterPrefix.indexOf(ending);
  let result = afterPrefix.substring(0, endIndex).trim();

  if (result.endsWith(',')) {
    result = result.slice(0, -1).trim();
  }

  return result;

}

generateBtn.addEventListener("click", async () => {
  const imageUrl = urlInput.value.trim();
  const userPrompt = promptInput.value.trim();

  if (!imageUrl) {
    alert("Please enter an image URL.");
    return;
  }

  try {
    description.textContent = "Generating card...";
    cardImage.src = imageUrl;

    const selectedMode = pokeBool ? "pokemon" : "yugioh";

    const res = await fetch("http://localhost:3000/api/from-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: imageUrl, mode: selectedMode, userPrompt}),
    });

    const data = await res.json();

    if (data.success) {
      description.textContent = data.card;

      const rawText = data.card;

      if(rawText.includes('Card Name: ')){
        cardNameM = traitScrape(rawText, 'Card Name: ', ', Card Type: ');
        cardName.textContent = cardNameM;
      }

      if(yugiBool){
        if(rawText.includes('Effect: ')){
          cardEffectM = traitScrape(rawText, 'Effect: ', ' End: N/A');
          cardEffect.textContent = cardEffectM;
        }

        if (rawText.includes('Card Type: Spell')) {
          card.src = "spellcard.jpg";
          cardEffect.style.top = "266px";
          cardName.style.color = "black";
        } else if (rawText.includes('Card Type: Trap')) {
          card.src = "trapcard.jpg";
          cardEffect.style.top = "266px";
          cardName.style.color = "black";
        } else if (rawText.includes('Card Type: Effect')) {
          card.src = "yugiohcard.jpg";
          cardName.style.color = "black";
          level.style.left = "192px";
        } else if(rawText.includes('Card Type: Fusion')){
          card.src = "fusioncard.jpg";
          cardName.style.color = "black";
          level.style.left = "192px";
        }else if(rawText.includes('Card Type: Synchro')){
          card.src = "synchrocard.jpg";
          cardName.style.color = "black";
          level.style.left = "192px";
        }else if(rawText.includes('Card Type: Xyz')){
          card.src = "xyzcard.jpg";
          cardName.style.color = "white";
          level.style.left = "41px";
        }
        
        if(rawText.includes('Card Type: Trap') || rawText.includes('Card Type: Spell')){
          level.textContent = "";
          atk.textContent = "";
          def.textContent = "";
          attribute.style.display = "none";
        }

        if(rawText.includes('Card Type: Fusion') || rawText.includes('Card Type: Effect') || rawText.includes('Card Type: Synchro') || rawText.includes('Card Type: Xyz')){
          cardEffect.style.top = "276px";
          if(rawText.includes('Level: ')){
            cardLevelM = traitScrape(rawText, 'Level: ', ',');
            level.textContent = cardLevelM;
          }
          if(rawText.includes('ATK: ')){
            cardATKM = traitScrape(rawText, 'ATK: ', ',');
            atk.textContent = cardATKM;
          }
          if(rawText.includes('DEF: ')){
            cardDEFM = traitScrape(rawText, 'DEF: ', ',');
            def.textContent = cardDEFM;
          }
          if(rawText.includes('Attribute: ')){
            cardAttributeM = traitScrape(rawText, 'Attribute: ', ',');
            if(cardAttributeM.toLowerCase().includes('dark')){
              attribute.style.display = "none";
            }else if(cardAttributeM.toLowerCase().includes('wind')){
              attribute.style.display = "";
              attribute.src = "windyugioh.png";
            }else if(cardAttributeM.toLowerCase().includes('water')){
              attribute.style.display = "";
              attribute.src = "wateryugioh.png";
            }else if(cardAttributeM.toLowerCase().includes('light')){
              attribute.style.display = "";
              attribute.src = "lightyugioh.png";
            }else if(cardAttributeM.toLowerCase().includes('earth')){
              attribute.style.display = "";
              attribute.src = "earthyugioh.png";
            }else if(cardAttributeM.toLowerCase().includes('fire')){
              attribute.style.display = "";
              attribute.src = "fireyugioh.png";
            }
          }
        }
      }
    } else {
      description.textContent = "Something went wrong: " + data.error;
    }


  } catch (err) {
    console.error(err);
    description.textContent = "Error contacting server.";
  }
});
