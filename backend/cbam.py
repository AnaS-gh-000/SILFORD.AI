import torch
import torch.nn as nn
from torchvision import models

class ChannelAttention(nn.Module):
  def __init__(self, in_channels, reduction=16):

    # in_channels (int): Number of input channels.
    # reduction (int): Reduction ratio for the hidden layer.

    super(ChannelAttention, self).__init__()

    #Global Pooling
    self.avg_pool = nn.AdaptiveAvgPool2d(1)
    self.max_pool = nn.AdaptiveMaxPool2d(1)

    #Shared multi-layer perceptron with 1x1 convolutions
    self.mlp = nn.Sequential(
        nn.Conv2d(in_channels, in_channels//reduction, kernel_size=1, bias=False),
        nn.ReLU(inplace=True),
        nn.Conv2d(in_channels//reduction, in_channels,  kernel_size=1, bias=False)
    )

    self.sigmoid = nn.Sigmoid()

  def forward(self, x):
    #avg pooling branch
    avg_out = self.mlp(self.avg_pool(x))

    #max pooling branch
    max_out = self.mlp(self.max_pool(x))

    #combine both branches
    attention = self.sigmoid(avg_out + max_out)

    #apply attention
    return x * attention



class SpatialAttention(nn.Module):
  def __init__(self, kernel_size=7):

    #kernel_size: Size of convolution kernel. CBAM uses 7x7 by default.

    super(SpatialAttention, self).__init__()

    assert kernel_size in (3,7), \
      "kernel size must be 3 or 7"

    padding = 3 if kernel_size ==7 else 1

    self.conv = nn.Conv2d(
        in_channels= 2,
        out_channels =1,
        kernel_size=kernel_size,
        padding = padding,
        bias =False
    )

    self.sigmoid = nn.Sigmoid()

  def forward(self, x):
    #channel-wise avg pooling
    avg_out = torch.mean(x, dim=1, keepdim=True)

    #channel-wise max pooling
    max_out = torch.max(x, dim=1, keepdim=True).values

    #concatenate along channel dimensions
    combined = torch.cat(
        [avg_out, max_out],
        dim=1
    )

    #generate spatial attention map
    attention = self.sigmoid(
        self.conv(combined)
    )

    #apply attention
    return x *attention


#CREATE A CBAM CLASS

class CBAM(nn.Module):
  def __init__(self, in_channels, reduction=16, kernel_size=7):
    # reduction: Channel reduction ratio
    # kernel_size: Spatial attention kernel size

    super(CBAM, self).__init__()

    self.channel_attention = ChannelAttention(
        in_channels= in_channels,
        reduction = reduction
    )

    self.spatial_attention = SpatialAttention(
        kernel_size = kernel_size
    )

  def forward(self, x):
    #channel attention
    x = self.channel_attention(x)

    #spatial attention
    x = self.spatial_attention(x)

    return x



class ResNet50_CBAM(nn.Module):

  def __init__(self, num_classes):
    super().__init__()

    #load resnet
    self.backbone = models.resnet50(
        weights = None
    )

    #remove og classifier
    self.backbone.fc = nn.Identity()

    #CBAM after final convo layer
    self.cbam = CBAM(
        in_channels = 2048
    )

    #new classifier
    self.classifier = nn.Linear(
        2048,
        num_classes
    )

  def forward(self, x):
    #resnet forward manually
    x = self.backbone.conv1(x)
    x = self.backbone.bn1(x)
    x = self.backbone.relu(x)
    x = self.backbone.maxpool(x)

    x = self.backbone.layer1(x)
    x = self.backbone.layer2(x)
    x = self.backbone.layer3(x)
    x = self.backbone.layer4(x)

    #CBAM attention
    x = self.cbam(x)

    #pooling
    x = self.backbone.avgpool(x)

    #flatten
    x = torch.flatten(x,1)

    # classifier
    x = self.classifier(x)

    return x


