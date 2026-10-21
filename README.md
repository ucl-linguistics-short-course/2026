# UCL Linguistics Short Courses 26/27

Live site: https://ucl-linguistics-short-course.github.io/2026/

## Updating the site

**Edit [`data.js`](data.js). That's it.** Every page (Home, Courses, Schedule, About) is generated from it, so each fact lives in exactly one place. You can edit it directly on GitHub (open the file → pencil icon → *Commit changes*); the live site updates a minute or two later.

### Quick edits

| I want to… | In `data.js`, change… |
| --- | --- |
| Use a new mailing-list Google Form | `mailingList` (section 1) |
| Hide all sign-up links until the form is ready | set `mailingList: ""` |
| Show a notice on every page (e.g. room change) | `announcement` (section 1); `""` hides it |
| Change the contact person | `contact` (section 1) |
| Set a room for a whole course | the course's `room` (section 2) |
| Add a building's address (shown with a map link) | `places` (section 2) |
| Change one session's date, time or room | that session's `date` / `time` / `room` |
| Add a session topic, readings or slides | that session's `title` / `readings` / `materials` |
| Move a course to another term | the course's `term` |
| Add a course | copy the template at the end of `courses` |
| Link a tutor or staff member to their UCL profile | add them to `people` (section 2) |
| Thank-you message at the end of the year | `complete: true` (section 1) |
| Swap a photo | put it in `images/`, then edit `images` (section 3) |

**Profile links:** list a name once in `people` and it becomes a link to that person's UCL profile everywhere on the site (tutor lists, guest speakers, faculty, descriptions). To find someone's link, run:

```bash
python tools/find_profile.py "First Last"
```

It prints a line you can paste into `people`. If a tutor isn't in `people` yet, the preview reminds you.

**Getting the mailing-list link:** in Google Forms press **Send**, choose the link icon, and copy the link (`https://forms.gle/…`). Don't copy the address bar while editing the form; that edit link only works for organisers. The preview warns you if you paste it by mistake.

The comments at the top of `data.js` explain the text formatting (`**bold**`, `_italic_`, `[link](url)`, `{contact}`, `{mailingList}`).

Things that update automatically, with no editing:
- the "Next" session marker, past sessions greyed out, and the home page status line (based on today's date)
- the course tables on the home page, the schedule, and the contents list on the Courses page

### Slides and handouts

Put files in `docs/` and reference them from a session:

```js
materials: [ { label: "Slides", file: "docs/psych-verbs-1.pdf" } ],
```

## Previewing

Open `index.html` in a browser. A red box means a typo in `data.js` (usually a missing comma or quote). A yellow box lists data problems such as an unknown term, a bad date or a wrong mailing-list link. It only appears on your own computer, never on the live site.

## How it's built

Plain HTML, no build step. GitHub Pages serves the files as they are (`.nojekyll` turns off Jekyll).

```
data.js            ← all content (edit this)
index.html …       ← page shells; only say which page to render
assets/site.js     ← turns data.js into pages
assets/site.css    ← styles (colours are variables at the top)
images/            ← photos (credits are in data.js)
tools/             ← find_profile.py: looks up UCL profile links
docs/              ← slides and handouts
```

Visitors can switch between light and dark mode with the button in the navigation bar; their choice is remembered.

## Next year

Copy this repo to a new one (e.g. `2027`), then in `data.js` update `year` and `academicYear`, clear `courses`, set a new `mailingList`, and add 26/27 to `previousYears`. Finally, add the new link to the [root site](https://github.com/ucl-linguistics-short-course/ucl-linguistics-short-course.github.io).
