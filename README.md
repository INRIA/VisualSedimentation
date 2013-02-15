VisualSedimentation
===================

Visual sedimentation is a novel design metaphor that progressively generates and updates visualizations of streaming data, inspired by the process of physical sedimentation. This process is the result of objects falling due to gravity forces, that aggregate into compact layers over time. The process is well understood since our environment is shaped by sedimentation: mountains, hills or rivers are the visible result of this long process.

## Ressources

* [Introduction](http://visualsedimentation.org)
* [Exemples](http://www.visualsedimentation.org/examples/) 
* [Api references](http://www.visualsedimentation.org/documentation/) 
* [Mailing liste](https://groups.google.com/forum/?fromgroups#!forum/visualsedimentation)

## Installing

Download the latest version here:

* <https://github.com/INRIA/VisualSedimentation/archive/master.zip>

Or, from the command line:

```bash
git clone git://github.com/INRIA/VisualSedimentation.git
```

When developing locally, note that your browser may enforce strict permissions for reading files out of the local file system. **If you use [d3.xhr](wiki/Requests) locally (including d3.json et al.), you must have a local web server.** For example, you can run Python's built-in server:

    python -m SimpleHTTPServer 8888 &

Once this is running, go to <http://localhost:8888/>.


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

Visual Sedimentation is under CeCILL-B licence.
Copyright 2013, by Samuel Huron & Romain Vuillemot
"B" means BSD :
* Licence texte in french: <http://www.cecill.info/licences/Licence_CeCILL-B_V1-fr.txt>
* Licence texte in english: <http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt>
