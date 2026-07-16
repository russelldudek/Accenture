from pathlib import Path
import hashlib
import json
from pypdf import PdfReader
from weasyprint import HTML

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
DOCS.mkdir(exist_ok=True)

JOBS = {
    "resume.html": ("Russell-Dudek-Accenture-Resume.pdf", 2),
    "cover-letter.html": ("Russell-Dudek-Accenture-Cover-Letter.pdf", 1),
    "interview-brief.html": ("Russell-Dudek-Accenture-Interview-Brief.pdf", 4),
    "90-day-plan.html": ("Russell-Dudek-Accenture-90-Day-Plan.pdf", 3),
    "agent-load-path-review.html": ("Russell-Dudek-Agent-Load-Path-Review.pdf", 2),
    "contribution-case.html": ("Russell-Dudek-Accenture-Contribution-Case.pdf", 2),
}

counts = {}
hashes = {}
for source, (filename, expected_pages) in JOBS.items():
    output = DOCS / filename
    HTML(filename=str(ROOT / source), base_url=str(ROOT)).write_pdf(str(output))
    actual_pages = len(PdfReader(str(output)).pages)
    if actual_pages != expected_pages:
        raise SystemExit(f"{filename}: expected {expected_pages} pages, rendered {actual_pages}")
    if output.stat().st_size < 3_000:
        raise SystemExit(f"{filename}: suspiciously small PDF ({output.stat().st_size} bytes)")
    counts[filename] = actual_pages
    hashes[filename] = hashlib.sha256(output.read_bytes()).hexdigest()
    print(f"PASS {filename}: {actual_pages} pages")

manifest_path = ROOT / "artifact-manifest.json"
manifest = json.loads(manifest_path.read_text())
manifest["pdf_page_counts"] = counts
manifest["pdf_sha256"] = hashes
manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")

validation_path = ROOT / "qa" / "validation.json"
validation = json.loads(validation_path.read_text())
validation["pdf_page_counts"] = counts
validation_path.write_text(json.dumps(validation, indent=2) + "\n")
