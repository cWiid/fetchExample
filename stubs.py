# Everything in this module is a stub cuz cbb w sql rn

def org_resources_dump():
    routines = [
        {
            "key": "11",
            "name": "routine1",
            "tasks": [
                {
                    "key": "1",
                    "name": "TASK1",
                    "day": 1,
                    "start": "12:00",
                    "end": "15:00",
                    "location": "1",
                    "herd": ["1", "2", "3"],
                    "people": ["1", "2"],
                    "items": ["1"],
                    "colour": "#0d6efd",
                     "notes": "neigh neigh neigh neigh neigh neigh neigh"
                },
                {
                    "key": "2",
                    "name": "TASK2",
                    "day": 1,
                    "start": "11:30",
                    "end": "13:30",
                    "location": "1",
                    "herd": ["1", "2", "3"],
                    "people": ["1", "2"],
                    "items": ["1"],
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
                    "key": "3",
                    "name": "task1",
                    "day": 2,
                    "start": "08:15",
                    "end": "15:05",
                    "location": "1",
                    "herd": ["1", "2", "3"],
                    "people": ["1", "2"],
                    "items": ["1"],
                    "colour": "#dc3545",
                    "notes": "neigh neigh neigh neigh neigh neigh neigh"
                },
                {
                    "key": "4",
                    "name": "task2",
                    "day": 5,
                    "start": "10:00",
                    "end": "10:03",
                    "location": "1",
                    "herd": ["1", "2", "3"],
                    "people": ["1", "2"],
                    "items": ["1"],
                    "colour": "#ffc107",
                    "notes": "neigh neigh neigh neigh neigh neigh neigh"

                }
            ]
        }
    ]

    # I'm treating array positions like keys for now.
    locations = ["location1", "location2"]
    horses = ["horse1", "horse2", "horse3", "horse4"]
    people = ["person1", "person2", "person3"]
    items = ["item1", "item2"]

    org_resources_json = {
        "routines": routines,
        "locations": locations,
        "horses": horses,
        "people": people,
        "items": items,
    }

    return org_resources_json
