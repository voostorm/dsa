# Coding Challenges for Technical Interviews

For simplicity, I call this DSA, which stands for Data Structures and Algorithms.

This is a collection of problems in the best order to learn them, along with the best code solution to study and a visualization to help understand the solution effectively.

# Passive Learning

* Read the target problem.
* Try to understand it.
* Try to come up with a solution.
* Fail.
* Ask an LLM: "What is the best Pythonic solution to learn for this problem?"
* Put the solution on a second monitor while passively learning the solution code. Glance over it while doing something else.
* Still do not fully understand the code or remember what you have read.
* Ask/Input into an LLM: "Generate an HTML visualization of this code" + previous HTML code file that has been iterated/refactored to my liking as a style, structure, or template. It may need refactoring or modification. The LLM can do this easily.
* Open the HTML file and step through the code to see what is happening on each line with visualization.
* Ask the LLM any questions regarding the code.
* With various examples, keep stepping through the code and understanding what is happening.
* While not in front of the computer, try to remember what you saw, learned, or read.
* If you have trouble recalling, look back at the HTML page with the code and visualization for review.

# Active Learning

* Try to write the solution code from scratch with no aid.
* While writing, you may get stuck. Try to recall the solution from memory. If you cannot, look at the HTML page with the code and visualization.
* Repeatedly keep trying until you can write the solution without looking back at the code in the HTML page.
* Writing the solution code is not enough.
* You need to explain the time and space complexity of the solution for that problem.
* In addition, explain the optimization or improvement for that solution.

# Overall

* You should start to see patterns within each domain, such as Arrays and Hashing for the first seven problems.
* You should start to feel confident about the specific data structure or algorithm and its group of problems.
* Do this for 75 problems, and you should be solid enough to land a software engineering internship at a mid-to-high-tier company in LA, SD, or SF.

# Purpose

* To review and recall problems and solutions that I have learned while preparing for and mastering Python coding for technical interviews or online assessments.
* To legitimately pass technical interviews or online assessments and get a job without nepotism — only with my skills and dedication, no matter how long it takes.



---

## DSA Puzzle Lab (interactive game)

**Play:** https://voostorm.github.io/dsa/

The original study library is preserved at [reference-library.html](https://voostorm.github.io/dsa/reference-library.html). The game is now the root `index.html`; the existing problem-specific reference pages remain available.

### First playable release

Five curated Python problems: Contains Duplicate, Two Sum, Valid Anagram, Binary Search and Longest Consecutive Sequence.

The game has seven player-selectable learning modes:

1. Reconstruct what the problem asks.
2. Reconstruct the algorithm plan.
3. Arrange meaningful Python blocks.
4. Arrange whole Python lines.
5. Arrange finer Python fragments.
6. Write missing Python lines.
7. Solve independently in an empty editor.

Use **Rescramble** for a fresh arrangement, **Run Python tests** for immediate feedback and **Give me a hint** for non-spoiling guidance. Progress is stored in your browser's local storage, not in a server account.

### Tech and constraints

- Static HTML, CSS and vanilla JavaScript deployed from the `main` branch on GitHub Pages. No build tool or paid API is required.
- Python execution is powered by [Pyodide](https://pyodide.org/) inside a Web Worker. Its first use requires downloading the runtime from a CDN; execution is stopped after a timeout.
- The curated reference solutions and tests are included in client-side source so they are not shown in the game UI, but **cannot be kept secret from developer tools on a static site**.
- Arbitrary problem import, screenshot/URL interpretation, true AI-generated solutions and generative AI coaching require a separate backend and are not implemented in this initial release. No API keys are collected by the current game.
- Local progress proves practice-mode completion; it does not independently certify interview mastery.

### Development

The game source is in `index.html`, `game/app.js`, `game/problems.js`, `game/py-worker.js` and `game/style.css`.

For local testing, serve the repository using a local HTTP server (for example `python3 -m http.server 8000`) and open `http://localhost:8000/`. Opening the files directly with `file://` may block Web Workers.

Product and learning-design decisions are tracked separately in Google Drive at `dsa-puzzle-game/dsa-puzzle-game.md`.
