from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import keras

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# For connecting with front-end without CORS error i would not recommend using this for deploying online though 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HandDrawnDigit(BaseModel):
    flattenList : list = []

# model = tf.keras.models.load_model("./model/mnist_model.h5")  # type: ignore (this is for pylance showing error for keras which do not exist apparently)
model = keras.saving.load_model("./model/my_model.keras")

@app.post("/predict")
async def predict(userInput : HandDrawnDigit) :

    userDigit = np.array(userInput.flattenList)
    
    if userDigit.shape != (28*28,) :
        return {
            "error" : "Only 28*28 image or 784 length list is allowed "
        }
    
    shapedUserDigit = userDigit.reshape(1,28,28,1).astype(float)

    prediction = model.predict(shapedUserDigit) # type: ignore (this is for pylance showing error for keras which do not exist apparently)
    probablities = prediction[0].tolist()

    return {
        "success" : True ,
        "predictions" : [round(x,2) for x in probablities],
        "predictedDigit" : int(np.argmax(probablities))
    }
    
