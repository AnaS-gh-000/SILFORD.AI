import time
import torch

from cbam import ResNet50_CBAM


print("PyTorch threads:", torch.get_num_threads(), flush=True)

model = ResNet50_CBAM(num_classes=25)

model.load_state_dict(
    torch.load(
        "best_cbam_final.pth",
        map_location="cpu"
    )
)

model.eval()

x = torch.randn(1, 3, 320, 320)

print("Starting inference...", flush=True)

start = time.perf_counter()

with torch.inference_mode():
    y = model(x)

elapsed = time.perf_counter() - start

print(f"Inference time: {elapsed:.3f} seconds", flush=True)
