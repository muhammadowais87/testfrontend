import json, re

entries = []
current_class = current_subject = current_series = ""
current_chapter = ""
current_topics = []
result = {}

with open(r"D:\brighttestsolution\frontend\afaq syllabes topics.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

for line in lines:
    raw = line.rstrip("\n")
    stripped = raw.strip()

    m = re.match(r"^->\s+(.+?)\s+(.+?)\s+(sun series|iqbal series)$", stripped, re.I)
    if m:
        if current_chapter and current_topics:
            entries.append({"class": current_class, "subject": current_subject, "series": current_series, "name": current_chapter, "chapters": list(current_topics)})
        elif current_chapter:
            entries.append({"class": current_class, "subject": current_subject, "series": current_series, "name": current_chapter, "chapters": [current_chapter]})
        current_chapter = ""
        current_topics = []
        current_class = m.group(1).strip().lower()
        current_subject = m.group(2).strip()
        current_series = m.group(3).strip()
        continue

    u = stripped.upper()
    if u.startswith("SELECT ALL CHAPTERS") or not stripped:
        if current_chapter and current_topics:
            entries.append({"class": current_class, "subject": current_subject, "series": current_series, "name": current_chapter, "chapters": list(current_topics)})
            current_topics = []
        elif current_chapter:
            entries.append({"class": current_class, "subject": current_subject, "series": current_series, "name": current_chapter, "chapters": [current_chapter]})
            current_chapter = ""
            current_topics = []
        continue

    heading_patterns = [
        r"^(Lesson|LESSON)\s+\d+",
        r"^(Unit|UNIT)\s+\d+",
        r"^(CHAP|Ch|Chap)\s+\d+",
        r"^UUnit\s+\d+",
        r"^(Unit|UNIT)\s+No\s+\d+",
        r"^(Unit|UNIT)#\d+",
        r"^(Review)\s+\d+",
        r"^(سبق نمبر)\s*\d+",
        r"^(باب)\s",
        r"^(باب نمبر)\s*\d+",
        r"^(پہلا|دوسرا|تیسرا|چوتھا)\s*(جائزہ)",
        r"^(جائزہ)\s*\d*",
        r"^(English Grammar|English B)",
        r"^(اردو\(ب\)|اردو گرائمر|خطوط|درخواستیں|مکالمے|کہانیاں|مضامین)",
    ]

    is_heading = False
    for pat in heading_patterns:
        if re.match(pat, stripped):
            is_heading = True
            break

    if is_heading:
        if current_chapter and current_topics:
            entries.append({"class": current_class, "subject": current_subject, "series": current_series, "name": current_chapter, "chapters": list(current_topics)})
            current_topics = []
        elif current_chapter:
            entries.append({"class": current_class, "subject": current_subject, "series": current_series, "name": current_chapter, "chapters": [current_chapter]})
        current_chapter = stripped
        current_topics = []
    else:
        current_topics.append(stripped)

if current_chapter and current_topics:
    entries.append({"class": current_class, "subject": current_subject, "series": current_series, "name": current_chapter, "chapters": list(current_topics)})
elif current_chapter:
    entries.append({"class": current_class, "subject": current_subject, "series": current_series, "name": current_chapter, "chapters": [current_chapter]})

class_map = {"two": "TWO", "three": "THREE", "4th": "FOUR", "5th": "5TH", "6th": "6TH"}
subject_rename = {
    "english": "English", "mathematics": "Mathematics", "computer": "Computer",
    "urdu": "اردو", "islamiyat": "اسلامیات", "social studies": "Social Studies",
    "general science": "General Science",
    "maloomat e ama": "معلومات عامہ", "malomaat e ama": "معلومات عامہ",
    "mutalaya islam": "مطالعہ اسلام", "mutala e islam": "مطالعہ اسلام",
    "waqfiyat e ama": "واقعیت عامہ",
    "math": "Math",
}

output = {}
for e in entries:
    cls = class_map.get(e["class"], e["class"].upper())
    subj = subject_rename.get(e["subject"].lower().strip(), e["subject"].strip())
    series = e["series"]
    key = f"{subj}-{series}-{cls}-AFAQ"
    if key not in output:
        output[key] = []
    output[key].append({"name": e["name"], "chapters": e["chapters"]})

with open(r"D:\brighttestsolution\frontend\src\data\afaqTopicChapters.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Generated {len(output)} subject entries")
for k in sorted(output.keys()):
    print(f"  {k}: {len(output[k])} chapters")
