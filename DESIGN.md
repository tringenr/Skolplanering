# Skolplanering — designsystem

Tema: **Project Hail Mary** — "stämning, inte kostym". Alltid mörkt rymdläge. Alla tokens ligger i `theme.css` under `:root`; ändra aldrig färger direkt i komponenter.

## Färgtokens

### Grund
| Token | Värde | Användning |
|---|---|---|
| `--bg` | #0a0d14 | Sidbakgrund (djup blåsvart rymd) |
| `--card` | #131824 | Kort |
| `--card2` | #1a2130 | Sekundär yta (helgdagar, justeringspanel) |
| `--text` | #e8ebf2 | Brödtext |
| `--muted` | #94a0b4 | Sekundär text |
| `--faint` | #5f6a7d | Svag text, hintar |
| `--line` | #232c3e | Linjer och ramar |
| `--accent` | #f2a33c | Astrophage-amber: rubriker, länkar, fokus |

### Barnfärger (identitet — används konsekvent överallt)
| Token | Värde | |
|---|---|---|
| `--gustav` | #e0678e | Rosa |
| `--syno` | #3fc0cf | Turkos |

Barnets färg används i: prick vid namn, rörets kontur, bollarna, veckoskalan vid filtrering, Nästa prov-kortets ram + svag bakgrund (10 % opacitet).

### Astrophage-skalan (veckobelastning, läge "Båda")
`--w0` #1a2130 (tomt) → `--w1` #3d3524 → `--w2` #6e5620 → `--w3` #b3831f → `--w4` #f2a33c. Mörkt→glödande amber. Etiketter: tomt · Amaze! · lagom · intensivt · WTF?
Per barn används motsvarande ramp i barnets färg: `--g1..g4` (rosa), `--s1..s4` (turkos).

### Händelsetyper
| Token | Värde | Typ |
|---|---|---|
| `--prov` | #d94a44 | Prov |
| `--np` | #c2356b | Nationellt prov |
| `--muntlig` | #8a6ff0 | Muntligt/redovisning |
| `--inl` | #dd7626 | Inlämning |
| `--lax` | #c9931c | Läxa/förhör/diagnos |
| `--lov` | #3d9250 | Lov |
| `--info` | #657185 | Studiedag, samtal, prao, övrigt |

## Typografi
- Brödtext: systemsans (-apple-system osv.), 16px, radavstånd 1.6
- Rubriker (h1, h2): `ui-monospace` (SF Mono/Menlo), VERSALER, letter-spacing .12–.14em — "skeppspanel". h1 i amber med ◉-prefix, h2 i muted
- Undertitel/etiketter: monospace .72rem

## Effekter
- Stjärnfält: canvas fixed bakom allt, prickar i vitt/amber/blått med låg opacitet. Alltid diskret — får aldrig konkurrera med innehållet
- Glöd: svag amber-boxshadow på kort, drop-shadow på rören. Inga gradienter
- Hörnradier: 12–14px kort, 9px kalenderdagar, 999px knappar/piller

## Komponentregler
- **Knappgrupper (.seg):** pillerformade, aktiv = inverterad (ljus text på mörk)
- **Händelsepiller i kalendern:** typfärg som bakgrund, vit text, fetstilt "G/S · Ämne" på första raden
- **Typfilter:** klickbara chips med 16px färgikon; avstängd = 35 % opacitet
- **Detaljkort (overlay):** max 520px, mörk yta, stängs via ✕ eller klick utanför
- **Nästa prov-kort:** ämne störst i barnfärg, datum fetstilt under, barnfärgad ram 1.5px + 10 % bakgrund
- **Vikt i UI:** bollstorlek = r0 + vikt × 1.6 px; "om X dagar" alltid i amber

## Principer
1. Händelser är perioder, inte punkter — pluggstart visas, vikt fördelas över arbetsperioden
2. Effort, inte resultat — inga betyg eller provresultat i gränssnittet
3. Firande utan larv — milstolpar (lov) hellre än konfetti
4. Barnfärgen är identitet — den får aldrig användas för något annat än barnet
5. Belastningsvyerna räknar alltid på allt — filter påverkar bara vad som visas, aldrig vad som mäts

## Filstruktur
- `index.html` — struktur (ändras sällan)
- `theme.css` — allt utseende (detta dokuments hem)
- `data.js` — händelser (D), material (MATLIB), kalenderaktiviteter (ACT) + konfig (vikter W, etiketter, färgmappning). Byts ut av den nattliga uppdateringen
- `app.js` — logik (rendering, filter, beräkningar)
