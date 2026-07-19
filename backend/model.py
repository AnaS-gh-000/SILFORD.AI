import json
import os
import torch
import torch.nn as nn
from torchvision import models
from torchvision import transforms
from PIL import Image


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

#Making class mapping
with open(os.path.join(BASE_DIR, "class_mapping.json"), "r") as f:
    class_to_idx = json.load(f)

idx_to_class = {
    value: key
    for key, value in class_to_idx.items()
}

print(idx_to_class)




#Creating ResNet-50 architecture 
model = models.resnet50(weights=None)

#Replace classifier
model.fc = nn.Linear(
    in_features= 2048,
    out_features=9
)

#Load saved weights
model.load_state_dict(
    torch.load(
        os.path.join(BASE_DIR, "best_resnet50_plant.pth"),
        map_location="cpu"
    )
)

#Evalutaion mode
model.eval()

print("Model loaded successfully")

transform = transforms.Compose([
    transforms.Resize((320,320)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean= [
            0.485,
            0.456,
            0.406
        ],
        std= [
            0.229,
            0.224,
            0.225
        ]
    )
])


def predict(image_path):
    #open image
    image = Image.open(image_path).convert("RGB")

    #apply preprocessing
    image = transform(image)

    #add batch dimension
    image = image.unsqueeze(0)

    #disable gradients
    with torch.inference_mode():
        output = model(image)

        #logits -> pred probs
        probabilities = torch.softmax(output, dim=1)

        #highest probability
        confidence, predicted = torch.max(probabilities, dim=1)

    class_id = predicted.item()
    class_name = idx_to_class[class_id]

    return{
        "plant": class_name,
        "confidence": round(confidence.item(), 4)
    }




if __name__ == "__main__":

    result = predict(
        "img-assets/foxglove-flower.jpg"
    )

    print(result)


