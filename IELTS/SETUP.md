# Setup — what each file is and what to do with it

Test date 11–13 September. Today is 5 September.

---

## The two piles

**Student pile — publish these, send him one link.**

| File | Rename to | What it is |
|---|---|---|
| `ielts-index.html` | `index.html` | Landing page linking the other three |
| `ielts-reading-room.html` | `reading.html` | Reading brief + timed test + exact marking |
| `ielts-writing-desk.html` | `writing.html` | Writing brief + Task 1/2 + structure check + models |
| `ielts-speaking-room.html` | `speaking.html` | Speaking brief + all three parts + models |

The filenames matter — `index.html` links to `reading.html`, `writing.html` and
`speaking.html` exactly. Rename them or the links break.

**Your pile — do not publish these.**

| File | What it is |
|---|---|
| `ielts-writing-marker.html` | AI marking of his essays. Teacher tool. |
| `ielts-teaching-guide.md` | Day-by-day lesson plans for 6–10 September |
| `ielts-marker-worker.js` | Only if you later want the marker online |

---

## Publishing the student pages

If the Spanish and Russian sites are already on GitHub Pages, this is the same process.

1. Make a repo — call it `ielts` or add a folder to an existing site repo.
2. Put the four renamed files in it. Nothing else needed; no build, no dependencies.
3. Settings → Pages → Deploy from a branch → `main`, folder `/ (root)` → Save.
4. Wait a minute, then open `https://YOURNAME.github.io/ielts/`.
5. Send him that one link.

**It must be the https link, not a file you send him.** The Speaking page needs https for
the microphone, and a file opened from Downloads will not have it.

---

## Testing locally first

Double-clicking the file mostly works, but the microphone will not. To test it properly:

```
cd folder-with-the-files
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Note the microphone still needs https or localhost
specifically — localhost counts as secure, so this works.

---

## The Writing Marker

Three ways to run it, in order of preference.

**1. Inside Claude.** Open the file here, paste his essay, mark it. Nothing to set up, no
key, no cost beyond your normal usage. This is the intended way.

**2. Locally with your own key.** Serve the folder as above, open the marker, paste an
Anthropic API key into the Connection panel. Held in memory for that tab only, never saved.
You will retype it each session — that is deliberate.

**3. Published, through the Worker.** Only if you have a reason to put it online. Follow the
setup comments at the bottom of `ielts-marker-worker.js`. Your key becomes a Cloudflare secret
and never touches the browser.

**Never put a key in a file you push to GitHub.** Anyone who opens the page can read it out
of the source and spend your credit. This is why option 3 exists rather than just pasting a
key into the published page.

---

## What to do today

1. Rename the four student files and push them. Ten minutes.
2. Send him the link with one line: *read the brief on each page before you press start.*
3. Confirm two things with him before the first lesson —
   - **Is the test actually booked?** "I think 11 to 13 September" is not a registration, and
     for a mid-September sitting the deadline has probably passed in most centres. If he has
     not registered, everything below changes.
   - **Academic or General?** Everything here is built for Academic. If he needs General,
     Task 1 is a letter and that page needs rewriting.
4. Open `ielts-teaching-guide.md` and read the Day 1 plan before tomorrow's session.

---

## What is still missing

**A second Reading passage.** Day 5 in the guide asks you to remeasure, but he will remember
the answers to the first one, so you can only time him rather than score him. A second
original passage would fix that — ask and I will write one.

**Listening.** Nothing here covers it. He said it was his strongest skill, so it is the right
thing to have left out, but be aware the set is not a complete test.

**A General Training version.** Everything assumes Academic.
