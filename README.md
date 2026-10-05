# Emotion-Adaptive Menus: Experimental Environment

Five menus, each built for one emotional state, plus a standard drop-down as the control.
All six run on the same fictional store (6 departments × 6 pages = 36 destinations).

This is the first step of the project described in our literature review, *LLM-Based, Emotion-Aware Adaptive Website and UI/UX Navigation: A Structured Review of 41 Papers (2021–2026)*.
That review (Part F, gap 3) found that emotion-adaptive interfaces almost only change colour, tone or content.
It also found that **almost nothing adapts the navigation structure itself: menu depth, information density, step count, or how many choices are shown at once.**
These five menus differ on exactly those dimensions.

---

## Running it

No build step and no install.

- **Quickest:** double-click `index.html` (the launcher), then pick a condition.
- **If the browser blocks local files:** in this folder run `python -m http.server 8000` and open <http://localhost:8000>.

URL parameters for `stage.html`:

| Parameter | Meaning |
|---|---|
| `menu` | `layered`, `palette`, `guided`, `radial`, `mega`, or `standard` (control) |
| `p` | Participant ID written into every log row (optional) |
| `task` | Instruction shown above the page, e.g. `task=Find the returns page` (optional) |
| `r=1` | Shows the researcher panel (event count, last selection time, CSV download). Leave it off for participants. |

Participants only ever see the structural name (`menu=radial`), never the emotion.

---

## The five menus at a glance

| # | Emotion | Menu (pre-established pattern) | What changes structurally | Core justification |
|---|---|---|---|---|
| 1 | **Anxiety / stress** | **Layered focus menu** (Training Wheels; multi-layer UI) | Fewest choices per screen (4), large fixed targets, rest hidden behind one disclosure | Anxiety reduces working-memory and attentional control and creates a drive to reduce uncertainty |
| 2 | **Frustration / anger** | **Search-first command palette** (+ split-menu "Recent") | One step to any page, typed by the user, bypasses the hierarchy | Frustration is a blocked goal plus lost time. Anger comes with a sense of individual control and an urge to act |
| 3 | **Confusion** | **Guided drill-down** (look-ahead help fields; example-described categories) | One level at a time. Every option explains itself and previews its contents | Confusion is an impasse that helps only if it gets resolved. More information scent resolves it |
| 4 | **Boredom** | **Radial (pie) menu** with animated reveal | Same choices and depth as the control, but a spatial, novel, animated interaction | Boredom is under-arousal plus failed engagement, and bored people seek stimulation. Pie menus are rated more enjoyable |
| 5 | **Joy / curiosity** | **Mega menu** | Flattest structure: the whole site in one 2-D panel, with variety cues | Positive emotion broadens attention, encourages exploration and increases variety-seeking |
| – | Neutral (control) | Standard linear drop-down | Conventional menu bar | Baseline for comparison |

**Why these five emotions.** Confusion, frustration and boredom are the states that actually occur during computer tasks, and they are the ones that persist and hurt performance (Baker et al., 2010; D'Mello & Graesser, 2012).
Basic emotions such as disgust or fear of a physical threat are rare at a screen.
Anxiety/stress and joy/curiosity complete the valence-arousal space: negative high-arousal and positive high-arousal.
Anxiety and frustration are both negative and high-arousal, but appraisal research shows they push behaviour in opposite directions (Lerner & Keltner, 2001), so they get different menus.

**How "pre-established" applies here.** Every menu is an existing, published pattern, and every emotion's effect on attention, motivation or choice is an established finding.
No published study has tested "menu X for emotion Y" directly. That pairing is the hypothesis your experiment tests, and your literature review shows the gap is real.
Present it that way and the justification holds: *established menu + established emotion effect → derived prediction*.

---

## Detailed justification per menu

### 1. Anxiety / stress → Layered focus menu (`menu=layered`)

**What the psychology says**
- Anxiety impairs the goal-directed attention system and uses up working-memory resources, so processing gets less efficient (Attentional Control Theory: Eysenck, Derakshan, Santos & Calvo, 2007).
- Anxiety primes an implicit goal of **uncertainty reduction**: anxious people prefer low-risk, predictable options (Raghunathan & Pham, 1999). Fear/anxiety is defined by appraisals of uncertainty and low personal control (Lerner & Keltner, 2001).
- Norman (2002): under stress, people are less flexible and less able to cope with difficulty, so products used under stress need especially simple, clear design.
- Hick-Hyman law: decision time rises with the number of alternatives (Hick, 1952), so fewer options means a cheaper decision.

**What the menu does**
- The first layer has only 4 large buttons (60px tall) in a fixed order, and nothing moves or animates.
- Everything else is still reachable, but behind one "More options" disclosure, and only one department opens at a time. No screen shows more than about 7 choices.

**Pre-established pattern**
- *Training Wheels* interfaces block advanced functions so new users learn faster and make fewer errors (Carroll & Carrithers, 1984).
- *Multi-layer interfaces* start users on a limited first layer and let them move up (Shneiderman, 2003).

**Trade-off to measure**
- Pages outside the first layer take more steps (3 instead of 2). The prediction is that anxious users accept the extra step in exchange for lower load. Calm users may find it slower.

### 2. Frustration / anger → Search-first command palette (`menu=palette`)

**What the psychology says**
- In HCI, frustration comes from obstructed goals. Its severity correlates with time lost and task importance, and users lose a third to half of their time to frustrating episodes (Ceaparu, Lazar, Bessiere, Robinson & Shneiderman, 2004).
- Anger, unlike anxiety, carries appraisals of **certainty and individual control** (Lerner & Keltner, 2001) and is an **approach** emotion (Carver & Harmon-Jones, 2009). An angry user wants to act directly, not be led.

**What the menu does**
- The user types the goal and jumps to any of the 36 pages in one step, skipping the hierarchy that just blocked them.
- It can be opened from anywhere with Ctrl/Cmd+K or "/", and the keyboard-first design keeps the user in charge.
- Synonyms in `data.js` mean "refund", "where is my order" or "bike" still match. This addresses the vocabulary problem: people rarely use the designer's word for a thing (Furnas, Landauer, Gomez & Dumais, 1987).
- With an empty query it is a plain grouped list, so typing is never forced. A "Recent" section sits on top.

**Pre-established pattern**
- The type-to-jump command palette.
- The "Recent" section follows *split menus*: frequently used items copied to the top were significantly faster and preferred (Sears & Shneiderman, 1994).

**Caveat to state openly**
- Katz & Byrne (2003) found site search was **not** faster or more accurate than browsing in general.
- The claim here is narrower and testable: when the menu has already failed the user (frustration), handing control to search reduces time-to-goal and further frustration.

### 3. Confusion → Guided drill-down menu (`menu=guided`)

**What the psychology says**
- Confusion is cognitive disequilibrium after an impasse. It helps only if it is **resolved** (D'Mello, Lehman, Pekrun & Graesser, 2014).
- Left unresolved, it oscillates into frustration and then boredom (D'Mello & Graesser, 2012), so an interface for confused users must resolve the impasse quickly.
- Navigation choices depend on *information scent*: how well a label signals what lies behind it (Pirolli & Card, 1999). Bare category labels are low-scent.
- Your own review (paper #34) found that emotional reactivity correlates with a higher need for explanations in software.

**What the menu does**
- One level at a time, with "Step 1 of 2" shown.
- Each department shows a plain-language description and **previews its contents** ("Inside: Phones, Laptops, …").
- Each page has its own one-line description.
- The path is shown ("All departments › Clothing") with an explicit Back button.
- Everything opens on click, with no hover submenus that vanish unexpectedly.

**Pre-established pattern**
- *Look-ahead help fields* show the next level's options. They significantly improved search accuracy in hierarchical menus, for novices and for practised users (Snowberry, Parkinson & Sisson, 1985).
- Describing menu categories with *examples* is an established way to make ill-defined categories understandable (Dumais & Landauer, 1984).

**Caveat**
- Breadcrumbs alone have weak evidence: they are rarely clicked and gave no time savings in Lida et al. (2003) and Rogers & Chaparro (2003). So the path here is orientation only. The work is done by the look-ahead previews and descriptions.

### 4. Boredom → Radial (pie) menu (`menu=radial`)

**What the psychology says**
- Boredom is "wanting, but being unable, to engage in satisfying activity": a failure to engage attention (Eastwood, Frischen, Fenske & Smilek, 2012).
- In the classic mood-management experiment, bored participants chose **exciting** stimuli and stressed participants chose soothing ones (Bryant & Zillmann, 1984).
- Among the states seen during computer tasks, boredom is the most persistent and the most harmful (Baker et al., 2010). Re-engagement matters more than anything else.

**What the menu does**
- An animated pie opens in the middle of the screen. Wedges fan out with icons, and the hub echoes whatever the pointer is over.
- It raises stimulation through novelty, motion and spatial interaction **without adding choices or steps**: 6 departments → 6 pages, the same depth as the control.

**Pre-established pattern**
- Pie menus were about 15% faster with fewer errors than linear menus (Callahan, Hopkins, Weiser & Shneiderman, 1988).
- Participants significantly preferred pie menus subjectively, even where time and errors did not differ (Murano & Khan, 2015).
- A 2024 study of mid-air (gesture) interaction found pie menus gave a more enjoyable user experience than panel menus (Mao, Ono, Qi, Watanabe & Huang, 2024).

**Caveat**
- Of the five pairings, this one leans hardest on the subjective-preference and enjoyment evidence. The engagement claim should be measured (e.g. self-reported arousal, time-on-task), not assumed.

### 5. Joy / curiosity → Mega menu (`menu=mega`)

**What the psychology says**
- Positive emotions **broaden** the momentary thought-action repertoire and the urge to explore (broaden-and-build theory: Fredrickson, 2001).
- Positive affect favours creative, breadth-first thinking and more tolerance for minor difficulties (Norman, 2002).
- Positive affect increases **variety-seeking** among safe, enjoyable options (Kahn & Isen, 1993).

**What the menu does**
- The whole store is shown at once in one wide two-dimensional panel, and every page is one click after opening.
- "New" and "Popular" tags and a "Surprise me" button give the variety-seeking urge somewhere to go.

**Pre-established pattern**
- Mega drop-down menus (Nielsen, 2009, Nielsen Norman Group): large 2-D panels that show many options at once without scrolling.

**Caveat**
- The same density that suits a broadened, positive state is predicted to overload an anxious user. That makes this menu and the layered menu the clearest contrast pair for a crossover test.
- "Surprise me" navigations are logged with `detail = surprise me`. Exclude them from task-time analysis, or delete the button for timed trials.

---

## What is held constant (and why)

- **Same content.** All menus render `js/data.js`, so the information architecture never changes.
- **Same visual theme.** One fixed light theme, font and accent colour. Colour-based emotion adaptation was already covered by UIFlex 2.0 and EmoWeb (review papers #2–#3). Keeping colour constant means any effect is due to structure.
- **Same invocation.** Every menu opens from the same header position with one click (or a key).
- **No second navigation route.** The page breadcrumb is plain text, so the only way to move is the menu under test.
- **Neutral naming.** Participants see `menu=radial`, never "boredom menu" (avoids demand characteristics).

---

## The event log

Every menu reports the same events. The log is kept in the browser's `localStorage` across page loads until you clear it. Download it as CSV from the researcher panel.

| Column | Meaning |
|---|---|
| `timestamp` | ISO time of the event |
| `participant` | From the `p` URL parameter |
| `menu` | Condition |
| `event` | `open`, `expand` (went a level deeper), `back`, `query` (palette search text), `select` (reached a page), `close` (dismissed without choosing), `home` |
| `category`, `item` | Where the event happened |
| `ms_since_open` | Milliseconds since the menu was opened. On a `select` row this is the **selection time** |
| `detail` | Extra context, e.g. the search text, `primary layer`, `more options`, `surprise me` |

Useful derived measures: selection time, `back` count (a proxy for navigation errors), `close` without `select` (abandonment), and number of `expand` events per selection.

The palette's "Recent" list resets on page reload. To stop it from favouring later trials, reload between trials.

---

## Files

```
emotion-menus/
  index.html            launcher (researcher-facing: names the emotions)
  stage.html            the store page participants use
  css/base.css          theme + page shell + researcher panel
  css/menus.css         styles for all six menus
  js/data.js            the 36-page information architecture (edit here)
  js/core.js            DOM helpers + event logger
  js/app.js             page shell, URL params, researcher panel
  js/menus/*.js         one file per menu, each with its rationale in the header comment
```

To change which pages the anxiety menu promotes, edit `EM.primary` in `js/data.js`.

---

## Suggested next steps (not built yet)

- **Emotion induction per condition**, using validated methods:
  - Boredom and stress: the boring and time-pressured tasks of Bryant & Zillmann (1984).
  - Frustration: a deliberately slow or failing interface (Scheirer, Fernandez, Klein & Picard, 2002).
  - Confusion: contradictory information (D'Mello et al., 2014).
  - Joy and sadness: standardised film clips (Gross & Levenson, 1995).
- **Design:** each induced emotion × matched menu vs. control menu (vs. a mismatched menu), counterbalanced.
- **Measures:** the log above, plus a manipulation check (e.g. Self-Assessment Manikin valence/arousal) before and after.
- **Later:** replace the URL parameter with an emotion detector that picks the menu. That is the LLM-mediated loop in the review's Part F.

---

## References

- Baker, R. S., D'Mello, S. K., Rodrigo, M. M. T., & Graesser, A. C. (2010). Better to be frustrated than bored: The incidence, persistence, and impact of learners' cognitive–affective states during interactions with three different computer-based learning environments. *International Journal of Human-Computer Studies, 68*(4), 223–241.
- Bryant, J., & Zillmann, D. (1984). Using television to alleviate boredom and stress: Selective exposure as a function of induced excitational states. *Journal of Broadcasting, 28*(1), 1–20.
- Callahan, J., Hopkins, D., Weiser, M., & Shneiderman, B. (1988). An empirical comparison of pie vs. linear menus. *Proceedings of CHI '88*, 95–100.
- Carroll, J. M., & Carrithers, C. (1984). Training wheels in a user interface. *Communications of the ACM, 27*(8), 800–806.
- Carver, C. S., & Harmon-Jones, E. (2009). Anger is an approach-related affect: Evidence and implications. *Psychological Bulletin, 135*(2), 183–204.
- Ceaparu, I., Lazar, J., Bessiere, K., Robinson, J., & Shneiderman, B. (2004). Determining causes and severity of end-user frustration. *International Journal of Human-Computer Interaction, 17*(3), 333–356.
- D'Mello, S., & Graesser, A. (2012). Dynamics of affective states during complex learning. *Learning and Instruction, 22*(2), 145–157.
- D'Mello, S., Lehman, B., Pekrun, R., & Graesser, A. (2014). Confusion can be beneficial for learning. *Learning and Instruction, 29*, 153–170.
- Dumais, S. T., & Landauer, T. K. (1984). Describing categories of objects for menu retrieval systems. *Behavior Research Methods, Instruments, & Computers, 16*, 242–248.
- Eastwood, J. D., Frischen, A., Fenske, M. J., & Smilek, D. (2012). The unengaged mind: Defining boredom in terms of attention. *Perspectives on Psychological Science, 7*(5), 482–495.
- Eysenck, M. W., Derakshan, N., Santos, R., & Calvo, M. G. (2007). Anxiety and cognitive performance: Attentional control theory. *Emotion, 7*(2), 336–353.
- Fredrickson, B. L. (2001). The role of positive emotions in positive psychology: The broaden-and-build theory of positive emotions. *American Psychologist, 56*(3), 218–226.
- Furnas, G. W., Landauer, T. K., Gomez, L. M., & Dumais, S. T. (1987). The vocabulary problem in human-system communication. *Communications of the ACM, 30*(11), 964–971.
- Gross, J. J., & Levenson, R. W. (1995). Emotion elicitation using films. *Cognition and Emotion, 9*(1), 87–108.
- Hick, W. E. (1952). On the rate of gain of information. *Quarterly Journal of Experimental Psychology, 4*(1), 11–26.
- Kahn, B. E., & Isen, A. M. (1993). The influence of positive affect on variety seeking among safe, enjoyable products. *Journal of Consumer Research, 20*(2), 257–270.
- Katz, M. A., & Byrne, M. D. (2003). Effects of scent and breadth on use of site-specific search on e-commerce Web sites. *ACM Transactions on Computer-Human Interaction, 10*(3), 198–220.
- Lerner, J. S., & Keltner, D. (2001). Fear, anger, and risk. *Journal of Personality and Social Psychology, 81*(1), 146–159.
- Lida, B., Hull, S., & Pilcher, K. (2003). Breadcrumb navigation: An exploratory study of usage. *Usability News, 5*(1).
- Mao, L., Ono, K., Qi, M., Watanabe, M., & Huang, J. (2024). Comparison of panel and pie menus for mid-air interaction in a photo booth: Muscle activity, performance, and user experience. *International Journal of Human–Computer Interaction, 40*(23).
- Murano, P., & Khan, I. N. (2015). Pie menus or linear menus, which is better? *Journal of Emerging Trends in Computing and Information Sciences, 6*(9), 476–481.
- Nielsen, J. (2009). Mega drop-down navigation menus work well. *Nielsen Norman Group* (Alertbox). https://www.nngroup.com/articles/mega-menus-work-well/
- Norman, D. A. (2002). Emotion & design: Attractive things work better. *interactions, 9*(4), 36–42.
- Pirolli, P., & Card, S. (1999). Information foraging. *Psychological Review, 106*(4), 643–675.
- Raghunathan, R., & Pham, M. T. (1999). All negative moods are not equal: Motivational influences of anxiety and sadness on decision making. *Organizational Behavior and Human Decision Processes, 79*(1), 56–77.
- Rogers, B. L., & Chaparro, B. (2003). Breadcrumb navigation: Further investigation of usage. *Usability News, 5*(2).
- Scheirer, J., Fernandez, R., Klein, J., & Picard, R. W. (2002). Frustrating the user on purpose: A step toward building an affective computer. *Interacting with Computers, 14*(2), 93–118.
- Sears, A., & Shneiderman, B. (1994). Split menus: Effectively using selection frequency to organize menus. *ACM Transactions on Computer-Human Interaction, 1*(1), 27–51.
- Shneiderman, B. (2003). Promoting universal usability with multi-layer interface design. *Proceedings of the 2003 Conference on Universal Usability (CUU '03)*.
- Snowberry, K., Parkinson, S., & Sisson, N. (1985). Effects of help fields on navigating through hierarchical menu structures. *International Journal of Man-Machine Studies, 22*(4), 479–491.
