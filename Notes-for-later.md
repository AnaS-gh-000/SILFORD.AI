###### for the NN model note that:

* Model: **ResNet-50** pretrained
* Input size: **320×320**
* Batch size: Start with **32** (reduce to 24->16 if needed)
* **Epochs 1–5: Freeze the ResNet** backbone; train only the new classifier.
* **Epochs 6–30 (or longer): Unfreeze** the backbone and continue training with a learning rate about 10× smaller than during the freeze phase.
* Freeze epoch **(10^-3 lr)**, normal epoch **(10^-4 lr)**
* Also turn on **mixed precision** from the start.



##### if the plant is not in toxic plant database

output: This plant does not match any toxic species in the current database with high confidence. This is not a guarantee that the plant is non-toxic or safe to eat.





#### 4 OUTPUTS POSSIBLE

1\.

Not a plant:

"Please upload a clear photo containing a plant."



\------------------------



2\.

Known toxic plant:

"Likely Poison Hemlock (96%)"



\------------------------



3\.

Known non-toxic plant:

"Likely Wild Carrot (94%)"



\------------------------



4\.

Unknown / Low confidence:

"This plant could not be confidently identified."





##### For identification between if a plant/not



###### Plant:

* leaves
* flowers
* stems
* whole plants
* outdoor photos

###### Not plant:

* animals
* people
* cars
* buildings
* objects
* soil-only photos
* blurry images





##### WHICH PLANTS FOR PROTOTYPE?





###### Group 1: Apiaceae

**Toxic:**

* Poison hemlock
* Water hemlock
* Giant hogweed
* Wild parsnip

**Similar:**

* Wild carrot (Queen Anne's lace)
* Cow parsnip
* Wild celery
* Angelica
* Wild parsley
* Yarrow (not Apiaceae, but commonly confused)



###### Group 2: Nightshade family

**Toxic:**

* Deadly nightshade
* Black henbane
* Jimsonweed / Datura

**Similar:**

* Tomato
* Eggplant
* Black nightshade (optional)



###### Group 3: Lily-like plants

**Toxic:**

* Lily of the valley
* Death camas (if you want a high-risk addition)

**Similar:**

* Wild garlic
* Ramps / wild onion



###### Group 4: Tall flowering toxic plants

**Toxic:**

* Foxglove
* Larkspur / Delphinium
* Wolfsbane / Monkshood

**Similar:**

* Comfrey
* Mullein (optional)



###### Group 5: Contact-toxic plants

**Toxic:**

* Poison ivy
* Poison oak (if relevant to your region)
* Castor bean
* Oleander

**Similar:**

* Virginia creeper
* Grape vine
* Blackberry leaves



###### Common "normal plants"

* Grass
* Rose
* Dandelion
* Fern
* Clover
* Maple/oak leaf
* Holy basil
* Mint





**BUT START ONLY WITH THESE:**

1. **Poison hemlock**
2. **Water hemlock**
3. **Giant hogweed**
4. **Wild carrot**
5. **Cow parsnip**
6. **Yarrow**



**Other toxic**



1. **Foxglove**
2. **Lily of the valley**
3. **Deadly nightshade**
4. **Jimsonweed**
5. **Poison ivy**
6. **Wolfsbane**



**Common plants**



1. **Dandelion**
2. **Grass**
3. **Rose**
4. **Tomato**
5. **Mint**

