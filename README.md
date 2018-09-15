# tf-route-planner
Route planning tool for Transport Fever

[Try it out!](https://mpalmer685.github.io/tf-route-planner)

## Current Features

* [x] Upload map data from the [Map Export](https://steamcommunity.com/sharedfiles/filedetails/?id=1445899052) mod
* [x] View map of towns and industries
* [x] Add and edit routes that connect the towns and industries

## Planned Features

* [ ] Interactivity: zoom and pan the map
* [ ] Add, move, and rename stations
* [ ] Start from an empty map
* [ ] Uplaod map data from a `map.lua` file
* [ ] Improved display of routes:
  * [ ] Multiple lines that connect the same stations run in parallel instead of overlapping
  * [ ] "Intelligently" choose the order of lines as they pass through a station to minimize crossings as they enter/exit
  * [ ] Display routes as continuous curves rather than line segments, with all lines running through a station in parallel
* [ ] Improved display of stations
  * [ ] Adjust size of station indicator to accommodate all lines that pass through it
  * [ ] Ability to rotate station to adjust curves
  * [ ] "Intelligently" choose the station's rotation in order to minimize line curves
* [ ] Improved interactions
  * [ ] Hover over a station to highlight all routes that run through it and all stations that are connected to it
  * [ ] Hover over a route to highlight all stations along the route
* [ ] Save and rename maps, open saved maps
