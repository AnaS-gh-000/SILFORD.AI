import json
import os
import torch
import torch.nn as nn

from torchvision import models
from torchvision import transforms

from PIL import Image



BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# -------------------------------
# Load class mapping
# -------------------------------

with open(os.path.join(BASE_DIR, "class_mapping.json"), "r") as f:
    class_to_idx = json.load(f)


idx_to_class = {
    value: key
    for key, value in class_to_idx.items()
}


print("Class mapping:")
print(idx_to_class)



# -------------------------------
# Create ResNet-50 architecture
# -------------------------------

model = models.resnet50(weights=None)


# Replace classifier
model.fc = nn.Linear(
    in_features=2048,
    out_features=len(class_to_idx)
)



# Load trained weights
model.load_state_dict(
    torch.load(
        os.path.join(BASE_DIR, "best_resnet50_plant.pth"),
        map_location="cpu"
    )
)



# Evaluation mode
model.eval()


print("Model loaded successfully")



# -------------------------------
# Same preprocessing as training
# -------------------------------

transform = transforms.Compose([
    transforms.Resize((320,320)),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[
            0.485,
            0.456,
            0.406
        ],

        std=[
            0.229,
            0.224,
            0.225
        ]
    )
])



# -------------------------------
# Prediction function
# -------------------------------

def predict(image_file):

    # Open image directly from uploaded file
    image = Image.open(image_file).convert("RGB")


    # Apply preprocessing
    image = transform(image)


    # Add batch dimension
    image = image.unsqueeze(0)



    # Inference
    with torch.inference_mode():

        output = model(image)


        probabilities = torch.softmax(
            output,
            dim=1
        )


        confidence, predicted = torch.max(
            probabilities,
            dim=1
        )

        


    class_id = predicted.item()

    class_name = idx_to_class[class_id]


#IF MODEL IS CONFIDENT ABOUT ITS PREDICTION THEN SHOW RESULTS, ELSE SHOW UNKNOWN
    if confidence.item() < 0.70:
            return {
                "plant":"unknown",
                "confidence":round(confidence.item(), 4)
            }
    else:
        return {
            "plant": class_name,
            "confidence": round(confidence.item(), 4)
        }
