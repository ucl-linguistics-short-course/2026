"""Find UCL Profiles pages for people, ready to paste into `people` in data.js.

Usage:
    python tools/find_profile.py "Juliette van Steensel" "Youngjin Kim"

Prints one line per name, Linguistics matches first. Only the Python standard
library is needed.
"""
import json
import sys
import urllib.request

API = "https://profiles.ucl.ac.uk/api/users"


def search(name):
    body = {
        "params": {"by": "text", "category": "user", "text": name},
        "pagination": {"startFrom": 0, "perPage": 10},
        "sort": "relevance",
        "filters": [],
    }
    req = urllib.request.Request(
        API,
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json", "User-Agent": "ucl-ling-short-courses-site"},
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.load(r).get("resource", [])


def in_linguistics(person):
    return any(p.get("department") == "Linguistics" for p in person.get("positions", []))


def same_person(name, person):
    # Every word of the name must appear in the profile's name (any order, any case)
    full = person.get("firstNameLastName", "").lower().split()
    return all(word in full for word in name.lower().split())


def main(names):
    sys.stdout.reconfigure(encoding="utf-8")
    for name in names:
        found = [p for p in search(name) if same_person(name, p)]
        found.sort(key=lambda p: not in_linguistics(p))
        if not found:
            print(f'// {name}: no UCL profile found')
            continue
        for i, p in enumerate(found[:3]):
            roles = "; ".join(
                ", ".join(x for x in (pos.get("position"), pos.get("department")) if x)
                for pos in p.get("positions", [])[:2]
            )
            line = f'"{name}": "https://profiles.ucl.ac.uk/{p["discoveryUrlId"]}",  // {p["firstNameLastName"]}: {roles}'
            print(line if i == 0 else "//   or " + line)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1:])
