# -*- coding: utf-8 -*-
"""Content data for the Appliance Repairs Tasmania static site.
Edit this file, then run `python3 build/generate.py` to rebuild the HTML.
"""

BUSINESS = {
    "name": "Appliance Repairs Tasmania",
    "short_name": "Appliance Repairs TAS",
    "tagline": "Hobart's Trusted Local Appliance Repair Experts",
    "phone_display": "1300 XXX XXX",
    "phone_local_display": "(03) 6XXX XXXX",
    "phone_href": "#contact",
    "email": "info@appliancerepairstasmania.com.au",
    "hours": "Mon–Fri 7:00am–6:00pm, Sat 8:00am–2:00pm",
    "address_area": "Servicing Hobart & Greater Hobart, TAS",
    "year": 2026,
    "socials": {
        "facebook": "#",
        "instagram": "#",
        "google": "#",
    },
}

NAV_RESIDENTIAL = [
    ("fridge", "Refrigerator Repair", "/services/refrigerator-repair.html"),
    ("washer", "Washing Machine Repair", "/services/washing-machine-repair.html"),
    ("dryer", "Clothes Dryer Repair", "/services/dryer-repair.html"),
    ("oven", "Oven, Stove & Range Repair", "/services/oven-stove-range-repair.html"),
    ("dishwasher", "Dishwasher Repair", "/services/dishwasher-repair.html"),
    ("grill", "Outdoor Kitchen & BBQ Repair", "/services/outdoor-kitchen-bbq-repair.html"),
]

NAV_COMMERCIAL = [
    ("building", "Commercial Appliance Repair", "/services/commercial-appliance-repair.html"),
    ("leaf", "Dryer Vent Cleaning", "/services/dryer-vent-cleaning.html"),
    ("sparkles", "Appliance Wellness Program", "/services/appliance-wellness-program.html"),
]

NAV_MAIN = [
    {"label": "Home", "href": "/index.html"},
    {
        "label": "Services",
        "href": "/services.html",
        "mega": True,
    },
    {"label": "Service Areas", "href": "/service-areas.html"},
    {"label": "About Us", "href": "/about.html"},
    {"label": "FAQ", "href": "/faq.html"},
    {"label": "Contact", "href": "/contact.html"},
]

# ---------------------------------------------------------------------------
# Full service catalogue
# ---------------------------------------------------------------------------

RESIDENTIAL_SERVICES = [
    {
        "slug": "refrigerator-repair",
        "icon": "fridge",
        "title": "Refrigerator Repair",
        "short": "Not cooling, leaking, or making noise? We diagnose and fix all major fridge brands fast.",
    },
    {
        "slug": "freezer-repair",
        "icon": "freezer",
        "title": "Freezer Repair",
        "short": "From chest freezers to built-in units, we stop the frost build-up and temperature swings.",
    },
    {
        "slug": "dishwasher-repair",
        "icon": "dishwasher",
        "title": "Dishwasher Repair",
        "short": "Leaks, poor cleaning, or a dishwasher that won't drain — we get it back to spotless.",
    },
    {
        "slug": "washing-machine-repair",
        "icon": "washer",
        "title": "Washing Machine Repair",
        "short": "Front and top loaders, all brands. Stop leaks and water damage before they get worse.",
    },
    {
        "slug": "dryer-repair",
        "icon": "dryer",
        "title": "Clothes Dryer Repair",
        "short": "Electric and gas dryer repairs for units that won't heat, won't tumble, or take too long.",
    },
    {
        "slug": "oven-stove-range-repair",
        "icon": "oven",
        "title": "Oven, Stove & Range Repair",
        "short": "Gas and electric ovens, cooktops and freestanding ranges, repaired by trained techs.",
    },
    {
        "slug": "microwave-repair",
        "icon": "microwave",
        "title": "Microwave Repair",
        "short": "Built-in and benchtop microwaves that won't heat, spark, or turn on — sorted safely.",
    },
    {
        "slug": "range-hood-repair",
        "icon": "vent",
        "title": "Range Hood & Vent Repair",
        "short": "Keep smoke and grease under control with a properly working extraction fan and hood.",
    },
    {
        "slug": "ice-maker-repair",
        "icon": "ice-cube",
        "title": "Ice Maker & Ice Machine Repair",
        "short": "Fridge ice makers and standalone ice machines that won't produce or dispense ice.",
    },
    {
        "slug": "wine-cooler-repair",
        "icon": "wine",
        "title": "Wine Cooler Repair",
        "short": "Protect your collection with reliable temperature and humidity control repairs.",
    },
    {
        "slug": "garbage-disposal-repair",
        "icon": "disposal",
        "title": "Garbage Disposal Repair",
        "short": "Jammed, humming, or leaking waste disposal units repaired or replaced quickly.",
    },
    {
        "slug": "trash-compactor-repair",
        "icon": "compactor",
        "title": "Trash Compactor Repair",
        "short": "Ram jams, odour issues, and power faults fixed to keep your compactor running smoothly.",
    },
    {
        "slug": "outdoor-kitchen-bbq-repair",
        "icon": "grill",
        "title": "Outdoor Kitchen & BBQ Repair",
        "short": "Built-in grills, side burners, outdoor fridges and sinks — keep summer entertaining alive.",
    },
    {
        "slug": "dryer-vent-cleaning",
        "icon": "leaf",
        "title": "Dryer Vent Cleaning",
        "short": "Reduce fire risk and drying times with a full lint and debris clear-out of your vent line.",
    },
    {
        "slug": "appliance-wellness-program",
        "icon": "sparkles",
        "title": "Appliance Wellness Program",
        "short": "An annual multi-point check-up that catches small issues before they become expensive ones.",
    },
]

COMMERCIAL_SERVICES = [
    {
        "slug": "commercial-appliance-repair",
        "icon": "building",
        "title": "Commercial Appliance Repair",
        "short": "Commercial fridges, freezers, dishwashers, ovens, ice machines and laundry equipment — kept running so your business doesn't lose a day of trade.",
    },
]

EXTRA_SERVICES = [
    s for s in RESIDENTIAL_SERVICES if s["slug"] in ("dryer-vent-cleaning", "appliance-wellness-program")
]

# Cards featured on the homepage "We Service All Major Appliances" grid
FEATURED_HOME_SLUGS = [
    "washing-machine-repair",
    "oven-stove-range-repair",
    "refrigerator-repair",
    "dishwasher-repair",
    "dryer-repair",
    "outdoor-kitchen-bbq-repair",
    "commercial-appliance-repair",
    "appliance-wellness-program",
]

ALL_SERVICES_BY_SLUG = {s["slug"]: s for s in (RESIDENTIAL_SERVICES + COMMERCIAL_SERVICES)}

# ---------------------------------------------------------------------------
# Detail page content (9 in-depth service pages)
# ---------------------------------------------------------------------------

SERVICE_DETAILS = [
    {
        "slug": "refrigerator-repair",
        "icon": "fridge",
        "title": "Refrigerator Repair",
        "meta": "Local fridge repair in Hobart for all major brands. Fast diagnosis, upfront pricing, same-week appointments.",
        "lead": "Your fridge runs 24/7 — when it stops cooling properly, food safety and your grocery budget are on the line. Our technicians diagnose the problem fast and carry common parts to fix most fridges in a single visit.",
        "covers": [
            "Fridge not cooling or running warm",
            "Freezer section frosting up or leaking",
            "Unusual noises, buzzing or clicking",
            "Water and ice dispenser faults",
            "Door seals, gaskets and hinge repair",
            "French door, side-by-side and built-in fridges",
        ],
        "problems": [
            "A refrigerator that runs constantly often points to a failing compressor, dirty condenser coils, or a faulty thermostat.",
            "Water pooling under the fridge is often a blocked defrost drain — a quick fix once diagnosed.",
            "Warm spots inside the fridge can mean a failing door seal or an evaporator fan that's stopped spinning.",
        ],
    },
    {
        "slug": "washing-machine-repair",
        "icon": "washer",
        "title": "Washing Machine Repair",
        "meta": "Front and top loader washing machine repairs in Hobart. Stop leaks fast and avoid costly water damage.",
        "lead": "A leaking or unbalanced washing machine can cause real damage to your laundry floor in a hurry. We repair every major brand and load type, and we prioritise leak calls to protect your home.",
        "covers": [
            "Washer leaking or overflowing",
            "Won't spin, drain or agitate",
            "Excessive vibration or loud banging",
            "Error codes and control board faults",
            "Door lock and seal replacement",
            "Front loaders, top loaders and combo units",
        ],
        "problems": [
            "Loud banging during the spin cycle is usually worn suspension springs or a failing drum bearing.",
            "A machine that won't drain is often a blocked pump filter — quick to clear once we're on site.",
            "Persistent leaks around the door are commonly a worn door seal on front loaders.",
        ],
    },
    {
        "slug": "dryer-repair",
        "icon": "dryer",
        "title": "Clothes Dryer Repair",
        "meta": "Electric and gas dryer repair in Hobart. Fix heating faults, long dry times and drum problems.",
        "lead": "A dryer that won't heat, takes multiple cycles to dry a load, or squeals on every spin is working harder than it should — and running up your power bill. We service electric and gas dryers of every brand.",
        "covers": [
            "Dryer not heating or heating poorly",
            "Drum not turning or squealing belts",
            "Overheating and auto shut-off faults",
            "Gas dryer ignition and valve issues",
            "Timer, sensor and control board repairs",
            "Vented and heat-pump condenser dryers",
        ],
        "problems": [
            "No heat is often a blown thermal fuse, caused by restricted airflow in a lint-clogged vent.",
            "Squealing noises usually mean a worn drum belt or glide bearing that needs replacing.",
            "Long dry times are frequently down to a blocked exhaust vent rather than the dryer itself — ask us about our vent cleaning service.",
        ],
    },
    {
        "slug": "oven-stove-range-repair",
        "icon": "oven",
        "title": "Oven, Stove & Range Repair",
        "meta": "Gas and electric oven, cooktop and range repairs in Hobart, done safely by trained technicians.",
        "lead": "Whether it's an electric wall oven, gas cooktop, or a freestanding range, an appliance that won't heat evenly (or won't heat at all) throws off every meal. We repair gas and electric cooking appliances to manufacturer safety standards.",
        "covers": [
            "Oven not heating or heating unevenly",
            "Cooktop burners not igniting or sparking",
            "Faulty thermostats and temperature sensors",
            "Self-clean cycle and door lock faults",
            "Element, igniter and control panel replacement",
            "Freestanding, built-in and induction ranges",
        ],
        "problems": [
            "Uneven baking is often a failing bake element or a temperature sensor reading incorrectly.",
            "A gas burner that won't light usually needs a new igniter or a clean, blocked port.",
            "An oven that trips the safety switch typically has a wiring or element short that needs a qualified repair.",
        ],
    },
    {
        "slug": "dishwasher-repair",
        "icon": "dishwasher",
        "title": "Dishwasher Repair",
        "meta": "Dishwasher repair in Hobart for leaks, poor cleaning and drainage faults, all major brands.",
        "lead": "Dishes coming out dirty, water pooling at the bottom, or a dishwasher that won't drain are the most common calls we get — and most are fixed in a single visit with the right part on the van.",
        "covers": [
            "Not cleaning dishes properly",
            "Leaking from the door or base",
            "Won't drain or fill correctly",
            "Unusual noises during the wash cycle",
            "Spray arm, pump and filter servicing",
            "Built-in, freestanding and drawer dishwashers",
        ],
        "problems": [
            "Cloudy or dirty dishes are often a clogged spray arm or a failing wash pump.",
            "Water left in the base after a cycle usually points to a blocked drain hose or faulty drain pump.",
            "Leaks around the door are commonly a worn door gasket that's easy to replace.",
        ],
    },
    {
        "slug": "outdoor-kitchen-bbq-repair",
        "icon": "grill",
        "title": "Outdoor Kitchen & BBQ Repair",
        "meta": "Outdoor kitchen and built-in BBQ repair in Hobart — grills, side burners, outdoor fridges and more.",
        "lead": "Your outdoor kitchen should mean more time entertaining and less time troubleshooting. We service built-in grills, side burners, outdoor fridges, dishwashers and ice makers so your outdoor space stays ready for guests.",
        "covers": [
            "Built-in grill repair (gas and electric)",
            "Side burner and outdoor stovetop repair",
            "Outdoor oven repair",
            "Outdoor refrigerator and drawer fridge repair",
            "Outdoor dishwasher repair",
            "Outdoor ice maker and ice machine repair",
        ],
        "problems": [
            "A grill that won't ignite or heats unevenly usually needs a new igniter or burner tube clean-out.",
            "Outdoor fridges that won't cool are especially exposed to Hobart's weather swings — seals and compressors take extra strain.",
            "Only outdoor-rated appliances should be used outside; indoor units aren't built for exposure to the elements and fail faster.",
        ],
    },
    {
        "slug": "commercial-appliance-repair",
        "icon": "building",
        "title": "Commercial Appliance Repair",
        "meta": "Commercial kitchen and laundry appliance repair across Hobart. Minimise downtime for cafes, restaurants and businesses.",
        "lead": "Downtime costs you trade. We repair commercial refrigeration, cooking and laundry equipment for cafes, restaurants, aged care, accommodation and retail businesses across Hobart, with priority booking for business customers.",
        "covers": [
            "Commercial refrigerator and freezer repair",
            "Commercial dishwasher repair",
            "Commercial washing machine and dryer repair",
            "Commercial ice machine repair",
            "Commercial oven and cooking equipment repair",
            "Preventative maintenance contracts",
        ],
        "problems": [
            "A commercial fridge holding temperature poorly is a food-safety risk — we prioritise same-day assessment for these calls.",
            "Frequent breakdowns on the same unit usually mean it's time for a full service, not another patch repair.",
            "Ask about a maintenance plan to catch faults before they turn into a closed kitchen.",
        ],
    },
    {
        "slug": "dryer-vent-cleaning",
        "icon": "leaf",
        "title": "Dryer Vent Cleaning",
        "meta": "Professional dryer vent cleaning in Hobart to cut fire risk and reduce drying times.",
        "lead": "A blocked dryer vent is one of the most common (and most preventable) causes of house fires. It also makes your dryer work harder, take longer, and cost more to run. A full vent clean fixes both problems at once.",
        "covers": [
            "Full lint and debris clear-out of the vent line",
            "Inspection of ducting for damage or crushed sections",
            "External vent cap and flap check",
            "Airflow test after cleaning",
            "Recommended for every 12 months of regular use",
        ],
        "problems": [
            "Clothes taking two or more cycles to dry is the clearest sign your vent needs attention.",
            "A dryer that feels hot to touch on the outside cabinet may be struggling against restricted airflow.",
            "A burning smell during drying should be treated as urgent — turn the dryer off and call us.",
        ],
    },
    {
        "slug": "appliance-wellness-program",
        "icon": "sparkles",
        "title": "Appliance Wellness Program",
        "meta": "Annual appliance check-up in Hobart. Catch small faults early and extend the life of your appliances.",
        "lead": "Most appliance failures don't happen overnight — they build up over months. Our Appliance Wellness Program is a scheduled annual check-up across your major appliances, designed to catch wear and tear before it becomes a breakdown.",
        "covers": [
            "Multi-point inspection of your major appliances",
            "Seal, hose and filter condition checks",
            "Early warning on parts showing wear",
            "Priority booking for wellness program members",
            "A written summary after every visit",
        ],
        "problems": [
            "Regular servicing typically costs far less than an emergency repair — and a lot less than early replacement.",
            "Small issues like a worn door seal or a dirty condenser coil quietly increase your power bill until they're addressed.",
            "Ideal for busy households, rental properties and holiday homes where problems can go unnoticed.",
        ],
    },
]

SERVICE_DETAILS_BY_SLUG = {s["slug"]: s for s in SERVICE_DETAILS}

# ---------------------------------------------------------------------------
# Why choose us
# ---------------------------------------------------------------------------

WHY_US = [
    {
        "icon": "award",
        "title": "Qualified, Experienced Technicians",
        "text": "Every repair is carried out by a trained technician who knows major appliance brands inside out.",
    },
    {
        "icon": "calendar",
        "title": "Scheduled Appointment Times",
        "text": "No all-day waiting windows. We give you a real time and call ahead when we're on our way.",
    },
    {
        "icon": "tag",
        "title": "Upfront, Honest Pricing",
        "text": "You'll know the cost before any work starts — no surprise call-out fees or hidden charges.",
    },
    {
        "icon": "shield",
        "title": "Workmanship Guarantee",
        "text": "Repairs are backed by our workmanship guarantee, so you can book with confidence.",
    },
    {
        "icon": "map-pin",
        "title": "Local to Hobart",
        "text": "We're based in Hobart and know the local area — fast response across the greater Hobart region.",
    },
    {
        "icon": "sparkles",
        "title": "All Major Brands Serviced",
        "text": "From budget-friendly to premium appliance brands, our team is equipped to repair them all.",
    },
]

PROCESS_STEPS = [
    {
        "title": "Book Online or Call",
        "text": "Tell us what's wrong and choose a time that suits you — online in under 2 minutes or by phone.",
    },
    {
        "title": "We Diagnose On-Site",
        "text": "Our technician arrives in the booked window and pinpoints the fault with a full diagnostic check.",
    },
    {
        "title": "Upfront Quote",
        "text": "You'll get a clear, upfront price before any repair work begins — no surprises.",
    },
    {
        "title": "Fast, Guaranteed Repair",
        "text": "Most repairs are completed in the same visit, backed by our workmanship guarantee.",
    },
]

# ---------------------------------------------------------------------------
# Testimonials
# ---------------------------------------------------------------------------

TESTIMONIALS = [
    {
        "name": "Sarah M.",
        "area": "Sandy Bay, Hobart",
        "initials": "SM",
        "text": "Called in the morning about our fridge not cooling and had a technician out the same afternoon. Fixed on the spot and explained everything clearly. Highly recommend.",
    },
    {
        "name": "David T.",
        "area": "Glenorchy, Hobart",
        "initials": "DT",
        "text": "Our washing machine was leaking all over the laundry floor. Quick response, upfront price, and it's been running perfectly since. Great local service.",
    },
    {
        "name": "Priya R.",
        "area": "Kingston, Tasmania",
        "initials": "PR",
        "text": "Booked the Appliance Wellness Program for our rental property and it picked up a worn seal before it became a real problem. Really thorough and professional.",
    },
    {
        "name": "Mark H.",
        "area": "North Hobart",
        "initials": "MH",
        "text": "Oven wouldn't heat past 120 degrees. Technician diagnosed it in minutes and had the part on the van. Back to baking that same day.",
    },
    {
        "name": "Lisa W.",
        "area": "Bellerive, Hobart",
        "initials": "LW",
        "text": "Our cafe's commercial dishwasher went down on a Saturday morning. They got someone out fast and we barely lost any trading time. Lifesavers.",
    },
    {
        "name": "James P.",
        "area": "Claremont, Tasmania",
        "initials": "JP",
        "text": "Dryer was taking three cycles to dry a single load. Turned out to be a blocked vent — cleaned it out and it's like a new machine now.",
    },
]

# ---------------------------------------------------------------------------
# FAQs
# ---------------------------------------------------------------------------

FAQS = [
    {
        "q": "What areas of Hobart do you service?",
        "a": "We service Hobart CBD and the greater Hobart region, including Sandy Bay, Glenorchy, Kingston, Bellerive, Claremont, New Town, Moonah and surrounding suburbs. See our full Service Areas page for the complete list, or get in touch if you're not sure we cover your suburb.",
    },
    {
        "q": "How quickly can you get a technician to me?",
        "a": "Most bookings are offered a scheduled appointment within 24–48 hours, with priority slots available for urgent issues like leaks or a fridge that's stopped cooling.",
    },
    {
        "q": "Do you charge a call-out fee?",
        "a": "We provide an upfront quote before any work begins, so you always know the full cost in advance — there are no hidden charges once we're on site.",
    },
    {
        "q": "What appliance brands do you repair?",
        "a": "We service all major appliance brands, including Whirlpool, Samsung, LG, Bosch, Fisher & Paykel, Electrolux, Westinghouse and more. If you're not sure whether we cover your brand, give us a call.",
    },
    {
        "q": "Do you offer a warranty on repairs?",
        "a": "Yes. All repairs are backed by our workmanship guarantee, giving you peace of mind that the job has been done right.",
    },
    {
        "q": "Do you service both residential and commercial appliances?",
        "a": "Yes, we repair appliances for homes as well as commercial kitchens, laundries, cafes and businesses across Hobart.",
    },
    {
        "q": "Should I repair or replace my appliance?",
        "a": "In many cases repair is faster and far more cost-effective than replacement, especially for appliances under 8–10 years old. Our technician will always give you an honest recommendation on-site.",
    },
]

# ---------------------------------------------------------------------------
# Service areas — Greater Hobart suburbs
# ---------------------------------------------------------------------------

SERVICE_AREAS = [
    "Hobart CBD", "Sandy Bay", "Battery Point", "North Hobart", "West Hobart",
    "South Hobart", "New Town", "Lenah Valley", "Mount Stuart", "Glenorchy",
    "Moonah", "Berriedale", "Claremont", "Austins Ferry", "Bridgewater",
    "Kingston", "Blackmans Bay", "Taroona", "Bellerive", "Rosny Park",
    "Howrah", "Lindisfarne", "Rose Bay", "Cambridge", "Sorell",
]
