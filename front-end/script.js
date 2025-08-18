const drawingBoard = document.getElementById('drawingBoard')
const predictionPanelBottom = document.getElementById('predictionPanelBottom')
const clearButton = document.getElementById('clearButton')

const userInputList = new Array(28*28).fill(0)
const gridSize = 28

const url = 'http://127.0.0.1:8000/predict'

const throttleDelay = 150 

function throttle(fun,delay){
    let lastCall = 0
    return function(...args){
        const now = Date.now()
        if (now - lastCall < delay) {
            return
        }
        last = now
        return fun(...args)}
}

const throttledPostData = throttle(postData, throttleDelay)

function createInputGrid(){
    for (let index = 0; index < gridSize*gridSize; index++) {
        const pixel = document.createElement('div')
        pixel.classList.add('pixel',String(index))

        pixel.addEventListener('mouseover',(event) => {
            
            if (event.buttons ===1 ){
                pixel.style.backgroundColor = '#000000'
                userInputList[Number(pixel.classList[1])] = 1
                throttledPostData(userInputList)
            }
    })    
        drawingBoard.appendChild(pixel)  
    }
}

function createPredictionPanelBottom(){
    for (let index = 0; index < 10; index++) {
        const digitPanel = document.createElement('div')
        const digitInsidePanel = document.createElement('div')
        const barInsidePanel = document.createElement('div')

        digitPanel.classList.add('digitPanelDiv')
        digitInsidePanel.classList.add('digitInsidePanelDiv')
        barInsidePanel.classList.add('barInsidePanel')
        barInsidePanel.id = String(index)

        digitInsidePanel.innerText = String(index)

        digitPanel.appendChild(digitInsidePanel)
        digitPanel.appendChild(barInsidePanel)

        predictionPanelBottom.appendChild(digitPanel)
    }
}

function postData(userInputList){
    const options = {
        method: 'POST',
        headers: {accept : 'application/json' , 'content-type' : 'application/json'},
        body : JSON.stringify({
            flattenList : userInputList
    })
    }

    fetch(url,options).then((res)=>(res.json())).then((data)=>{
        data.predictions.map((prob,index) => (document.getElementById(String(index))).style.height = String(Math.round(prob*100))+"%")
        document.getElementById("predictedDigit").innerText = data.predictedDigit
    })
}

clearButton.addEventListener('click',()=>{
    const pixels = document.querySelectorAll(".pixel")
    pixels.forEach( pixel => {
        pixel.style.backgroundColor = '#ffffff'
        userInputList[Number(pixel.classList[1])] = 0
    })
    document.getElementById("predictedDigit").innerText = ""

    const bars = document.querySelectorAll(".barInsidePanel")
    bars.forEach(bars => (bars.style.height = "100%"))

})


createInputGrid()
createPredictionPanelBottom()
