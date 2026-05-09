/**
 * Photo catalog for the static demo.
 * Uses picsum.photos (public domain, no API key) so the demo works
 * offline of WordPress. Swap for real images when you move to production.
 */
window.Aperture3DData = {
  photos: [
    { id: 1015, title: "Mountain Pass",        tags: "Landscape",  body: "A quiet ridge at first light, where the wind carries the weight of the valley below." },
    { id: 1018, title: "Forest Floor",         tags: "Nature",     body: "The canopy filters the sun into a thousand slow, shifting pieces." },
    { id: 1019, title: "Open Road",            tags: "Travel",     body: "An asphalt line drawn through a world that does not end." },
    { id: 1025, title: "Companion",            tags: "Portrait",   body: "A moment held without words." },
    { id: 1027, title: "Stillness",            tags: "Portrait",   body: "The camera waits. She does not." },
    { id: 1033, title: "Cascade",              tags: "Landscape",  body: "Water writes the only history stone remembers." },
    { id: 1035, title: "Peaks",                tags: "Landscape",  body: "Altitude as a kind of silence." },
    { id: 1040, title: "Cathedral",            tags: "Architecture", body: "Light is the oldest material." },
    { id: 1043, title: "Railway",              tags: "Travel",     body: "Arrivals made of rust and purpose." },
    { id: 1048, title: "Dunes",                tags: "Landscape",  body: "Shapes the wind drafts and erases, over and over." },
    { id: 1050, title: "Coastline",            tags: "Landscape",  body: "Where the edge of everything folds into itself." },
    { id: 1057, title: "Harbor",               tags: "Architecture", body: "Work after the work is done." },
    { id: 1059, title: "Trail",                tags: "Nature",     body: "A path is a question asked in footsteps." },
    { id: 1062, title: "Verdant",              tags: "Nature",     body: "The oldest green in the world." },
    { id: 1069, title: "Forecast",             tags: "Landscape",  body: "Weather is a thing you wear." },
    { id: 1074, title: "Pine",                 tags: "Nature",     body: "Single tree, whole season." },
  ].map(p => ({
    ...p,
    url:   `./photo.html?id=${p.id}`,
    image: `https://picsum.photos/id/${p.id}/1024/1280`,
    thumb: `https://picsum.photos/id/${p.id}/800/1000`,
    full:  `https://picsum.photos/id/${p.id}/1600/2000`,
  })),
};
