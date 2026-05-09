/**
 * Photo catalog for the static demo.
 *
 * Images courtesy of Unsplash photographers (Unsplash License:
 * free to use, attribution appreciated, not required).
 * The footer credit on the live site reads "Photos via Unsplash".
 *
 * Each Unsplash URL is stable and directly hotlink-safe via
 * the `images.unsplash.com` CDN.
 */
(function () {
  const u = (id, w) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`;

  const photos = [
    { id: 1, slug: '1506905925346-21bda4d32df4', title: 'Alpine Silence',    tags: 'Landscape',    body: 'A quiet ridge at first light, where the wind carries the weight of the valley below.' },
    { id: 2, slug: '1470071459604-3b5ec3a7fe05', title: 'Cathedral of Trees', tags: 'Nature',       body: 'The canopy filters the sun into a thousand slow, shifting pieces.' },
    { id: 3, slug: '1501785888041-af3ef285b470', title: 'Aurora',             tags: 'Landscape',    body: 'Sky writing, legible only to those who wait.' },
    { id: 4, slug: '1441974231531-c6227db76b6e', title: 'Woodland Path',      tags: 'Nature',       body: 'A path is a question asked in footsteps.' },
    { id: 5, slug: '1469474968028-56623f02e42e', title: 'Mirror',             tags: 'Landscape',    body: 'Altitude as a kind of silence.' },
    { id: 6, slug: '1439853949127-fa647821eba0', title: 'Harbor Nights',      tags: 'Architecture', body: 'Work after the work is done.' },
    { id: 7, slug: '1506744038136-46273834b3fb', title: 'Quiet Lake',         tags: 'Landscape',    body: 'Where the edge of everything folds into itself.' },
    { id: 8, slug: '1494526585095-c41746248156', title: 'Desert Geometry',    tags: 'Landscape',    body: 'Shapes the wind drafts and erases, over and over.' },
    { id: 9, slug: '1447752875215-b2761acb3c5d', title: 'Pines',              tags: 'Nature',       body: 'Single tree, whole season.' },
    { id:10, slug: '1433086966358-54859d0ed716', title: 'Cascade',            tags: 'Nature',       body: 'Water writes the only history stone remembers.' },
    { id:11, slug: '1500382017468-9049fed747ef', title: 'Autumn',             tags: 'Landscape',    body: 'The year turning its last card.' },
    { id:12, slug: '1472396961693-142e6e269027', title: 'Ridgeline',          tags: 'Landscape',    body: 'A horizon kept honest by stone.' },
    { id:13, slug: '1447752875215-b2761acb3c5d', title: 'Evergreen',          tags: 'Nature',       body: 'A needle pattern older than empires.' },
    { id:14, slug: '1490750967868-88aa4486c946', title: 'Coastline',          tags: 'Landscape',    body: 'The sea rehearses the same line for millennia.' },
    { id:15, slug: '1470252649378-9c29740c9fa8', title: 'River Bend',         tags: 'Landscape',    body: 'Where the current writes its own map.' },
    { id:16, slug: '1418065460487-3e41a6c84dc5', title: 'Storm Coming',       tags: 'Landscape',    body: 'Weather is a thing you wear.' },
  ];

  window.Aperture3DData = {
    photos: photos.map((p) => ({
      ...p,
      url:   `./photo.html?id=${p.id}`,
      image: u(p.slug, 1024),
      thumb: u(p.slug, 800),
      full:  u(p.slug, 1600),
    })),
  };
})();
