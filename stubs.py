# Everything in this module is a stub cuz cbb w sql rn

def org_resources_dump():
    routines = [
        {
            "uid": "11",
            "name": "summer"
        },
        {
            "uid": "12",
            "name": "winter"
        }
    ]

    tasks = [
        {
            "uid": "01",
            "name": "TASK1",
            "routine": "11",
            "days": [1, 4],
            "start": "12:00",
            "end": "15:00",
            "location": "31",
            "horses": ["41", "42", "43"],
            "people": ["51", "52"],
            "inventory": ["61"],
            "colour": "#0d6efd",
            "notes": "neigh neigh neigh neigh neigh neigh neigh"
        },
        {
            "uid": "02",
            "name": "TASK2",
            "routine": "11",
            "days": [1, 5],
            "start": "11:30",
            "end": "13:30",
            "location": "32",
            "horses": ["41", "42"],
            "people": ["51", "52"],
            "inventory": ["61"],
            "colour": "#fd7e14",
            "notes": "neigh neigh neigh neigh neigh neigh neigh"

        },
        {
            "uid": "03",
            "name": "task1",
            "routine": "12",
            "days": [4, 7],
            "start": "08:15",
            "end": "15:05",
            "location": "32",
            "horses": ["41"],
            "people": ["51", "52"],
            "inventory": ["61"],
            "colour": "#dc3545",
            "notes": "neigh neigh neigh neigh neigh neigh neigh"
        },
        {
            "uid": "04",
            "name": "task2",
            "routine": "12",
            "days": [3, 4, 6],
            "start": "10:00",
            "end": "10:03",
            "location": "31",
            "horses": ["42", "43"],
            "people": ["51", "52"],
            "inventory": ["61"],
            "colour": "#ffc107",
            "notes": "neigh neigh neigh neigh neigh neigh neigh"

        }
    ]

    tags = [
        {
            "uid": "11",
            "name": "tagA"
        },
        {
            "uid": "12",
            "name": "qwerty"
        },
        {
            "uid": "13",
            "name": "haram"
        },
        {
            "uid": "14",
            "name": "tagB"
        },
    ]

    horses = [
        {
            "uid": "41",
            "id": "h123",
            "name": "horsey",
            "tags": ["12", "13"]
        },
        {
            "uid": "42",
            "id": "h345",
            "name": "nancy",
            "tags": ["11", "14"]
        },
        {
            "uid": "43",
            "id": "h442",
            "name": "prancy",
            "tags": ["12", "13"]
        }
    ]

    personnel = [
        {
            "uid": "51",
            "id": "p123",
            "name": "romeo juliet",
            "tags": ["11"]
        },
        {
            "uid": "52",
            "id": "p607",
            "name": "siddarth gapgupta",
            "tags": [""]
        },
        {
            "uid": "53",
            "id": "p141",
            "name": "kanade tachibana",
            "tags": ["13", "12", "11", "14"]
        }
    ]

    items = [
        {
            "uid": "61",
            "id": "i134",
            "name": "jackomatic 3000",
            "tags": ["12"]
        },
        {
            "uid": "62",
            "id": "i111",
            "name": "grain feed",
            "tags": [""]
        }
    ]

    locations = [
        {
            "uid": "31",
            "name": "ram ranch"
        },
        {
            "uid": "32",
            "name": "barn"
        }
    ]

    org_resources_json = {
        "tags": tags,
        "routines": routines,
        "tasks": tasks,
        "locations": locations,
        "horses": horses,
        "people": personnel,
        "inventory": items,
    }

    return org_resources_json


uid = 10


def replace_edited_task():
    return "Success", 200


def delete_task():
    return "Success", 200


def store_new_task():
    global uid
    uid += 1
    return str(uid)


def replace_edited_routine():
    return "Success", 200


def delete_routine():
    return "Success", 200


def store_new_routine():
    global uid
    uid += 1
    return str(uid)
