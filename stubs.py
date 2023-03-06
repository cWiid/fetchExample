# Everything in this module is a stub cuz cbb w sql rn

def org_resources_dump():
    routines = [
        {
            "key": "11",
            "name": "routine1",
            "tasks": [
                {
                    "key": "01",
                    "name": "TASK1",
                    "day": 1,
                    "start": "12:00",
                    "end": "15:00",
                    "location": "31",
                    "herd": ["41", "42", "43"],
                    "team": ["51", "52"],
                    "equipment": ["61"],
                    "colour": "#0d6efd",
                    "notes": "neigh neigh neigh neigh neigh neigh neigh"
                },
                {
                    "key": "02",
                    "name": "TASK2",
                    "day": 1,
                    "start": "11:30",
                    "end": "13:30",
                    "location": "32",
                    "herd": ["41", "42"],
                    "team": ["51", "52"],
                    "equipment": ["61"],
                    "colour": "#fd7e14",
                    "notes": "neigh neigh neigh neigh neigh neigh neigh"

                }
            ]
        },
        {
            "key": "12",
            "name": "routine2",
            "tasks": [
                {
                    "key": "03",
                    "name": "task1",
                    "day": 2,
                    "start": "08:15",
                    "end": "15:05",
                    "location": "32",
                    "herd": ["41"],
                    "team": ["51", "52"],
                    "equipment": ["61"],
                    "colour": "#dc3545",
                    "notes": "neigh neigh neigh neigh neigh neigh neigh"
                },
                {
                    "key": "04",
                    "name": "task2",
                    "day": 5,
                    "start": "10:00",
                    "end": "10:03",
                    "location": "31",
                    "herd": ["42", "43"],
                    "team": ["51", "52"],
                    "equipment": ["61"],
                    "colour": "#ffc107",
                    "notes": "neigh neigh neigh neigh neigh neigh neigh"

                }
            ]
        }
    ]

    tags = [
        {
            "key": "11",
            "name": "tagA"
        },
        {
            "key": "12",
            "name": "qwerty"
        },
        {
            "key": "13",
            "name": "haram"
        },
        {
            "key": "14",
            "name": "tagB"
        },
    ]

    horses = [
        {
            "key": "41",
            "id": "h123",
            "name": "horsey",
            "tags": ["12", "13"]
        },
        {
            "key": "42",
            "id": "h345",
            "name": "nancy",
            "tags": ["11", "14"]
        },
        {
            "key": "43",
            "id": "h442",
            "name": "prancy",
            "tags": ["12", "13"]
        }
    ]

    personnel = [
        {
            "key": "51",
            "id": "p123",
            "name": "romeo juliet",
            "tags": ["11"]
        },
        {
            "key": "52",
            "id": "p607",
            "name": "siddarth gapgupta",
            "tags": [""]
        },
        {
            "key": "53",
            "id": "p141",
            "name": "kanade tachibana",
            "tags": ["13", "12", "11", "14"]
        }
    ]

    items = [
        {
            "key": "61",
            "id": "i134",
            "name": "jackomatic 3000",
            "tags": ["12"]
        },
        {
            "key": "62",
            "id": "i111",
            "name": "grain feed",
            "tags": [""]
        }
    ]

    locations = [
        {
            "key": "31",
            "name": "ram ranch"
        },
        {
            "key": "32",
            "name": "barn"
        }
    ]

    org_resources_json = {
        "tags": tags,
        "routines": routines,
        "locations": locations,
        "horses": horses,
        "people": personnel,
        "inventory": items,
    }

    return org_resources_json
