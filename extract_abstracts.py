import json
import getpass
from pathlib import Path
import openreview

# --------------------------------------------------
# Configuration
# --------------------------------------------------
VENUE_ID = "ECCV/2026/Workshop/CVPPA"   # Change this
BASE_PATH = Path("./public/content") # Change this

# --------------------------------------------------
# Login
# --------------------------------------------------
username = input("OpenReview username: ")
password = getpass.getpass("Password: ")

client = openreview.api.OpenReviewClient(
    baseurl="https://api.openreview.net",
    username=username,
    password=password,
)

# --------------------------------------------------
# Index all JSON files recursively by filename
# --------------------------------------------------
json_index = {p.stem: p for p in BASE_PATH.rglob("*.json")}

print(f"Indexed {len(json_index)} JSON files.")

# --------------------------------------------------
# Retrieve submissions
# --------------------------------------------------
submissions = openreview.tools.iterget_notes(
    client,
    invitation=f"{VENUE_ID}/-/Submission",
    details="directReplies",
)

updated = 0
missing = []

for paper in submissions:
    decision = None

    for reply in paper.details["directReplies"]:
        if reply["invitation"].endswith("/-/Decision"):
            decision = reply["content"]["decision"]["value"]
            break

    if not (decision and decision.lower().startswith("accept")):
        continue

    paper_id = str(paper.number)
    abstract = paper.content["abstract"]["value"]

    json_path = json_index.get(paper_id)

    if json_path is None:
        missing.append(paper_id)
        continue

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    data["abstract"] = abstract

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Updated {paper_id}: {json_path}")
    updated += 1

print(f"\nDone. Updated {updated} accepted papers.")

if missing:
    print("Missing JSON files for paper IDs:")
    print(", ".join(sorted(missing)))