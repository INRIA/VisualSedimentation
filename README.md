VisualSedimentation
===================


![Bar chart](https://raw.github.com/INRIA/VisualSedimentation/master/img/barchart.png)
![Pie chart](https://raw.github.com/INRIA/VisualSedimentation/master/img/sediviz-piechart.png)
![Bubble chart](https://raw.github.com/INRIA/VisualSedimentation/master/img/bubblechart.png)
Visual sedimentation is a javascript visualizations library for streaming data, inspired by the process of physical sedimentation. This process is the result of objects falling due to gravity forces, that aggregate into compact layers over time. The process is well understood since our environment is shaped by sedimentation: mountains, hills or rivers are the visible result of this long process.


## Ressources

* [Introduction](http://visualsedimentation.org)
* [Examples](http://www.visualsedimentation.org/examples/) 
* [Api references](http://www.visualsedimentation.org/documentation/) 
* [Publication](http://hal.inria.fr/index.php?view_this_doc=hal-00846260&extended_view=1&version=1&halsid=b8pagf8u57b3qdurmesutapfa0)
* [Mailing list](https://groups.google.com/forum/?fromgroups#!forum/visualsedimentation)
* [Roadmap and Todo](https://github.com/INRIA/VisualSedimentation/wiki/RoadMap)
* [News on Twitter feed](https://twitter.com/sediviz)

## Browser Support 
Visual Sedimentation is under developement process, actually we are not focus on a production version.
The library work on last version of chrome and firefox.

## Installing

Download the latest version here:

* <https://github.com/INRIA/VisualSedimentation/archive/master.zip>

Or, from the command line:

```bash
git clone git://github.com/INRIA/VisualSedimentation.git
```

When developing locally, note that your browser may enforce strict permissions for reading files out of the local file system.  For example, you can run Python's built-in server:

    python -m SimpleHTTPServer 8888 &

Once this is running, go to <http://localhost:8888/>.


## To cite the project 

    @article{huron:hal-00846260,
        url = {http://hal.inria.fr/hal-00846260},
        title = {{Visual Sedimentation}},
        author = {Huron, Samuel and Vuillemot, Romain and Fekete, Jean-Daniel},
        booktitle = {{IEEE Transactions on Visualization and Computer Graphics}},
        publisher = {IEEE},
        pages = {2446-2455},
        journal = {IEEE Transactions on Visualization and Computer Graphics},
        volume = {19},
        number = {12 },
        doi = {10.1109/TVCG.2013.227 },
        year = {2013},
        month = Dec,
    }


## Dependancy

Already included :
* jquery.js
http://jquery.com/
Copyright 2010, John Resig
Released under Dual licensed under the MIT or GPL Version 2 licenses.
* d3.js
http://d3js.org/
Copyright 2012, Michael Bostock
Released under BSD licenses.
* Box2DWeb
http://www.gphysics.com
Copyright 2006, Erin Catto 
Released under zlib License.
* Sizzle.js
http://sizzlejs.com/
Copyright 2010, The Dojo Foundation

## Licences

Visual Sedimentation is under CeCILL-B licence. "B" means BSD.
Copyright 2013, by Samuel Huron & Romain Vuillemot :
* Licence text in french: <http://www.cecill.info/licences/Licence_CeCILL-B_V1-fr.txt>
* Licence text in english: <http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt>

## Forging 

Visual sedimentation was forging inside : 
* INRIA AVIZ team <http://aviz.fr/>
* IRI Centre Pompidou team <http://www.iri.centrepompidou.fr/>

