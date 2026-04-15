# Challenges

CVPPA will provide the opportunity to participate in two diverse challenges. People can participate by submitting their results using the dedicated challenge website (this may vary depending on the institution organizing the challenge).

## PHENET Challenge

In this edition, in collaboration with the PHENET European project (<https://www.phenet.eu>) under the supervision of PHENOME EMPHASIS, a large-scale dataset of apple orchards is proposed (five sites across Europe testing varieties with the same genotypes). This challenge brings horticulture-focused tasks to the CVPPA workshop, a domain that has been largely unexplored despite its strong relevance to real-world plant phenotyping. 

The dataset features high-resolution RGB images taken under controlled lighting in working apple orchards, with expert annotations covering multiple phenological stages from dormancy to fruit maturity. Its multi-site design captures wide variability in appearance, canopy structure, and environmental conditions, reflecting the complexity of horticultural systems and presenting challenges different from those in annual crops or controlled environments. 

From a computer vision perspective, this dataset enables research on fine-grained phenological object detection under occlusion, significant temporal appearance changes, and notable domain shifts between sites. Baseline results show that early phenological stages are particularly tough for standard detection models, highlighting the need for better representations, robustness, and generalisation strategies.

<div class="not-prose flex my-10">
  <a href="https://www.codabench.org/competitions/14963/" target="_blank" rel="noopener noreferrer" class="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded">
    🏆 Participate in this Challenge
  </a>
</div>


Authors are encouraged to submit a full paper or extended abstract accompanying their challenge results. For more information, visit the [Call for Papers](/CfP) page.

## Bonn Challenge

Pollinators play a vital role in ecosystem stability and agricultural productivity, yet their populations are under increasing pressure. Automated monitoring of pollinators offers valuable insights into their behavioural patterns and species diversity, and when combined with farmland data, can reveal important ecological relationships between pollinator activity and agricultural land use. 

This challenge addresses the detection of small objects (pollinators) on cluttered, visually complex backgrounds, which may be partially occluded or motion-blurred, pushing the limits of standard object detection approaches. 

The challenge dataset consists of 10k annotated instances of 1920x1080 RGB video frames, covering four pollinator categories (bees, bumblebees, hoverflies, and other insects) recorded across five farmland types (Phacelia, Maize, Pasture, and mixtures) on 11 different days, capturing a range of environmental and lighting conditions. Alongside each annotated detection frame, the dataset includes the five preceding video frames, enabling participants to incorporate temporal context into their models.
