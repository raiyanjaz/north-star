"""Allowlisted workspace geography; no credentials or operational state."""
CITIES = {
    'toronto': {'id': 'toronto', 'name': 'Toronto', 'timezone': 'America/Toronto',
                'center': [43.657, -79.387], 'bounds': [43.4, -80, 44, -79],
                'zoom': 14, 'basemap': 'toronto-map.geojson',
                'basemap_credit': 'City of Toronto centreline · cached extract',
                'fire_name': 'Toronto Fire Services', 'police_name': 'Toronto Police Service'},
    'seattle': {'id': 'seattle', 'name': 'Seattle', 'timezone': 'America/Los_Angeles',
                'center': [47.610, -122.333], 'bounds': [47.48, -122.46, 47.75, -122.23],
                'zoom': 13, 'basemap': 'seattle-map.geojson',
                'basemap_credit': '© OpenStreetMap contributors · cached Seattle streets',
                'fire_name': 'Seattle Fire Department', 'police_name': None},
}


def city_config(city):
    if city not in CITIES:
        raise ValueError('Unknown city workspace')
    return CITIES[city]
