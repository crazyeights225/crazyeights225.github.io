---
layout: single
classes: wide
author_profile: true
title: Projects
permalink: /about/
toc: true

row1:
  - image_path: /assets/images/projects/cuACS/staff5.png
    alt: "Pet Adoption App"
    title: "Pet Adoption App"
    excerpt: "An Animal shelter desktop app. Matching pets to owners with compatibility algorithm."
  - image_path: /assets/images/projects/avectors/av3.png
    alt: "AVectors"
    title: "AVectors"
    excerpt: "Creating a map of attack vectors, and making notes while doing a box. Exports to html, or pdf"
  - image_path: /assets/images/projects/projects_imgs/sample3.png
    title: "Classifying browsing history"
    excerpt: "Clustering and Categorizing Browsing History"

row2:
  - image_path: /assets/images/projects/mincrypto/im6.png
    title: "mincrypto"
    excerpt: "Tool that allows the user to apply a series of consecutive encode and decode operations."
  - image_path: /assets/images/projects/i1.png
    title: "RBNN, MAENN for Movie Recommendation"
    excerpt: "Neural Networks for Movie Recommendations, with tensorflow v1"
  - image_path: /assets/images/projects/projects_imgs/sample2.png
    title: "Basic Image Classification"
    excerpt: "Basic Image Classification"

c1:
  - image_path: /assets/images/projects/control/c2-cropped.png
  - image_path: /assets/images/projects/control/c7.png
  - image_path: /assets/images/projects/control/c4.png

c2:
  - image_path: /assets/images/projects/control/c5.png
  - image_path: /assets/images/projects/control/c6.png
  - image_path: /assets/images/projects/control/c3.png
---

Switching to this format because the other was too hard to maintain. Here is a summary of some of the projects I have done.

# This Year

## AI: Predator Prey

A simple predator-prey simulation with Q-Learning and Deep Q-Learning.

In the single-agent environment, we have prey and food. The goal of the prey is to eat the food:

![/assets/images/portskan/5btvde.gif](/assets/images/projects/5btvde.gif){: .align-center}

In the multi-agent environment, we have prey (green), predator (blue), and food (red). Below shows predators chasing prey:

![/assets/images/portskan/5bwc6q.gif](/assets/images/projects/5bwc6q.gif){: .align-center}


# Last Year

## GIS: Fossil Clustering

**An analysis of the clustering of Canadian Fossil Data**
        
> Started: Oct 2020, Finished: Dec 2020
Used: dash, numpy, geopandas
        
Implemeneted and analysed the following algorithms: Graham Scan, k-means, CLARANS, BIRCH, Agglomerative Hierarchical
Clustering: Average, and Minimum Linkages, and DBScan
        
![/assets/images/projects/fossilgis/fg1.png](/assets/images/projects/fossilgis/fg1.png)

The algorithms implemented were simple and fast enough that they could be interactively, allowing the user to experiment with different parameters

![/assets/images/projects/fossilgis/fg3.png](/assets/images/projects/fossilgis/fg3.png)

Some sample data:
![/assets/images/projects/fossilgis/fg4.png](/assets/images/projects/fossilgis/fg4.png)

Not a particularly complicated mystery, as the highest quantities of fossils are located around the Western Interior Seaway

![/assets/images/projects/fossilgis/fg2.png](/assets/images/projects/fossilgis/fg2.png)

Some clustering examples:

![/assets/images/projects/fossilgis/fg5.png](/assets/images/projects/fossilgis/fg5.png)

![/assets/images/projects/fossilgis/fg6.png](/assets/images/projects/fossilgis/fg6.png)

In with higher dimensional input the clusters appear as overlapping polygons:

![/assets/images/projects/fossilgis/fg7.png](/assets/images/projects/fossilgis/fg7.png)
          
This is because the 2-d fails to capture the 3-d space/topography
For example: for this canyon/ravine
          
![/assets/images/projects/fossilgis/fg8.png](/assets/images/projects/fossilgis/fg8.png)

We get the following clusters, where the smaller polygons correspond to denser clusters at lower elevation (ie. at the bottom of the canyon), and the larger polygon corresponds to less dense cluster that contains entries at higher elevations (ie. on the edges of the canyon)

![/assets/images/projects/fossilgis/fg9.png](/assets/images/projects/fossilgis/fg9.png)

## Honors Project: ebph testsuite

> ebpH TestSuite and Automation Server
  Done for my Honors Project, Fall 2020.
 
Will provide a more detailed description at a later date.

Involved repeatedly training and testing the ebpH Intrusion Detection System. Learned alot of valuable skills, the most important being how to approach defensive security from an offensive perspective. It was a very interesting project, the ebpH IDS is pretty neat. I also wrote a jenkins-like application for scheduling and logging. Below are some snapshots:
     
![/assets/images/projects/control/c1.png](/assets/images/projects/control/c1.png)

{% include feature_row id="c1" %}

{% include feature_row id="c2" %}

# Older

## QA: Test Automation Tool

> s-robot Automated Testing Tool

One day I am going to explain this properly

Application which can edit and run Automated tests for web applications

Started: June 2019, Finished: August 2019

Specs: Java, Serenity BDD, JBehave, Apache POI, sqlite3, Server: Java Spring, handlebars, Web Application Frontend: Tabulator, JQuery

Tool to create and run Automated Tests on any Web Application without configuration. Client Requirements: Tests must be able to be written in Excel. The server runs and edits the tests, and calls the automated testing module which reads in the tests and runs them
         
![/assets/images/projects/projects_imgs/sbot1.png](/assets/images/projects/projects_imgs/sbot1.png)

Create scenarios and reuse steps:
![/assets/images/projects/projects_imgs/sbot2.png](/assets/images/projects/projects_imgs/sbot2.png)

Search for steps:
![/assets/images/projects/projects_imgs/sbot3.png](/assets/images/projects/projects_imgs/sbot3.png)

Run tests and get results from the tool:

![/assets/images/projects/projects_imgs/sbot4.png](/assets/images/projects/projects_imgs/sbot4.png){: .align-center}



## Noob: Deal Finder: Web Crawler with Django


> Deal Finding Spider - Webservice

Not very good looking back now, but my first real project, so it will always be included.
Started: June 2018, Finished: June 2018
Specs: Spider written in Python with Beautiful Soup, Findings stored in mySQL database, and displayed using Django
        
![/assets/images/projects/projects_imgs/sample1.png](/assets/images/projects/projects_imgs/sample1.png){: .align-center}


# Misc: Hardly Worth Mentioning


Misc projects from long ago...

{% include feature_row id="row1" %}



The real bottom of the barrel:

{% include feature_row id="row2" %}
