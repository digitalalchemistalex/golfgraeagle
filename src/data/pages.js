// Landing pages for llms.txt and sitemap
// Add a new entry here when creating a new landing page — both files update automatically on next deploy

export const landingPages = [
  // Core booking
  { slug: '/request-a-quote/',           label: 'Request a Quote',                    desc: 'Free custom quote in 24 hours — tee times, lodging, dining, full itinerary',  priority: '1.0', changefreq: 'monthly' },
  { slug: '/golf-packages/',             label: 'Golf Packages',                      desc: 'Stay-and-play golf packages from $299/golfer',                                  priority: '0.9', changefreq: 'monthly' },
  { slug: '/stay-and-play/',             label: 'Stay & Play Packages',               desc: 'Bundled tee times + lodging packages at all 5 courses',                         priority: '0.9', changefreq: 'monthly' },
  { slug: '/tee-times-graeagle/',        label: 'Tee Times Graeagle',                 desc: 'Guaranteed tee times at all 5 courses including semi-private Grizzly Ranch and Nakoma Dragon', priority: '0.9', changefreq: 'monthly' },
  { slug: '/group-golf/',                label: 'Group Golf Graeagle',                desc: 'Golf groups 4–200+ players, Reno & Lake Tahoe 90 min away, packages from $299/golfer',       priority: '0.9', changefreq: 'monthly' },

  // Trip types
  { slug: '/bachelor-party-golf-graeagle/', label: 'Bachelor Party Golf',            desc: 'Bachelor party golf packages in Graeagle — semi-private courses, lodging, full coordination', priority: '0.9', changefreq: 'monthly' },
  { slug: '/corporate-golf-outing-graeagle/', label: 'Corporate Golf Outings',       desc: 'Corporate golf outings in Graeagle — group tee times, catering, lodging for 10–200+',        priority: '0.9', changefreq: 'monthly' },
  { slug: '/graeagle-golf-weekend-packages/', label: 'Weekend Golf Packages',        desc: 'Weekend golf packages in Graeagle — 2 nights, 2–3 rounds from $299/golfer',                   priority: '0.9', changefreq: 'monthly' },

  // Destination / hub pages
  { slug: '/all-golf-courses/',          label: 'All Graeagle Golf Courses',          desc: 'All 5 championship courses: Grizzly Ranch, Graeagle Meadows, Whitehawk Ranch, Plumas Pines, Nakoma Dragon', priority: '0.9', changefreq: 'monthly' },
  { slug: '/graeagle-golf-itinerary/',   label: 'Graeagle Golf Itinerary',            desc: 'Sample 3-day and 4-day Graeagle golf itineraries',                              priority: '0.9', changefreq: 'monthly' },
  { slug: '/golf-trip-from-sacramento/', label: 'Golf Trip from Sacramento',          desc: 'Graeagle is 2.5 hours from Sacramento — day trip or overnight golf packages',   priority: '0.9', changefreq: 'monthly' },
  { slug: '/summer-golf-graeagle/',      label: 'Summer Golf Graeagle',               desc: 'Summer golf in Graeagle — peak season July–August, all 5 courses open',        priority: '0.9', changefreq: 'monthly' },
  { slug: '/graeagle-golf-resort/',      label: 'Graeagle Golf Resort',               desc: 'Graeagle as a golf resort destination — courses, lodging, dining in one valley', priority: '0.9', changefreq: 'monthly' },
  { slug: '/graeagle-golf-vacation/',    label: 'Graeagle Golf Vacation',             desc: 'Plan a Graeagle golf vacation — complete stay-and-play trips',                  priority: '0.9', changefreq: 'monthly' },
  { slug: '/stay-and-play-golf-california/', label: 'Stay & Play Golf California',   desc: 'Best stay-and-play golf destinations in Northern California — Graeagle top pick', priority: '0.9', changefreq: 'monthly' },
  { slug: '/golf-packages-northern-california/', label: 'Golf Packages Northern California', desc: 'Northern California golf packages — Graeagle valley, 5 courses, from $299/golfer', priority: '0.9', changefreq: 'monthly' },
  { slug: '/trips/',                     label: 'Golf Trips',                         desc: 'Browse real Graeagle golf trips — verified group packages with actual pricing',  priority: '0.8', changefreq: 'weekly'  },
  { slug: '/graeagle-vacation-rentals/', label: 'Graeagle Vacation Rentals',          desc: 'Vacation rentals and cabins in Graeagle for golf groups — Townhomes at Plumas Pines and more', priority: '0.8', changefreq: 'monthly' },
  { slug: '/graeagle-golf-hotels/',      label: 'Graeagle Golf Hotels',               desc: 'Hotels and resorts near Graeagle golf courses — River Pines, Chalet View, Inn at Nakoma',    priority: '0.8', changefreq: 'monthly' },
  { slug: '/lodging/',                   label: 'Lodging',                            desc: 'All lodging options near Graeagle golf courses',                                priority: '0.8', changefreq: 'monthly' },
  { slug: '/dining/',                    label: 'Dining',                             desc: 'Restaurants and dining near Graeagle golf courses',                             priority: '0.8', changefreq: 'monthly' },
  { slug: '/graeagle-course-guide/',     label: 'Course Guide',                       desc: 'Full guide to all 5 Graeagle golf courses — yardage, slope, rating, access',   priority: '0.8', changefreq: 'monthly' },

  // Info pages
  { slug: '/faq/',                       label: 'FAQ',                                desc: 'Frequently asked questions about Graeagle golf packages and tee times',         priority: '0.7', changefreq: 'monthly' },
  { slug: '/about-us/',                  label: 'About GolfGraeagle',                 desc: 'About GolfGraeagle.com — golf trip specialists operating since 2004',           priority: '0.7', changefreq: 'monthly' },
  { slug: '/about/mike-eskuchen/',       label: 'Mike Eskuchen — Golf Trip Specialist', desc: 'Mike Eskuchen bio — lead golf trip planner at GolfGraeagle.com',             priority: '0.6', changefreq: 'monthly' },

  // Legacy root-level WP pages (kept for GSC continuity)
  { slug: '/best-golf-courses-graeagle/', label: 'Best Golf Courses Graeagle',       desc: 'Complete guide to the best golf courses in Graeagle, California',              priority: '0.5', changefreq: 'yearly'  },
  { slug: '/ultimate-guide-to-golfing-in-graeagle/', label: 'Ultimate Guide to Golfing in Graeagle', desc: 'Everything you need to know about golfing in Graeagle CA',    priority: '0.5', changefreq: 'yearly'  },
  { slug: '/mountain-dining-near-lake-tahoe-graeagles-best-kept-restaurant-secrets/', label: 'Mountain Dining Near Graeagle', desc: 'Best restaurants near Graeagle and Lake Tahoe golf courses', priority: '0.5', changefreq: 'yearly'  },
];
