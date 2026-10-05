# tabloid

A tiny markdown table toolkit: escape, align, render.

## Usage

```js
import { renderTable } from 'tabloid';

renderTable(
  ['name', 'qty', 'price'],
  [['nut', '4', '0.25']],
  [':---', ':---:', '---:'],
);
```

## API

### `escapeCell(text)`

Prepares one cell for embedding in a table row: trims outer whitespace,
flattens newlines to spaces, and escapes characters that could break the
table structure. Cells containing pipes or backslashes are made safe with
backslash escapes (`\|`, `\\`).

### `renderTable(header, rows, alignments?)`

Renders `header` and `rows` as a markdown table. The optional
`alignments` array takes separator syntax per column: `:---` (left,
the default), `:---:` (center), `---:` (right).

### `parseAlignment(spec)`

Parses one separator cell into `'left' | 'center' | 'right'`.

## Demo

```bash
npm run build
node demo/serve.mjs 4173
# open http://127.0.0.1:4173/
```

## Known issues

- #12: literal pipes in cell content are not escaped and break column
  counts.
- #18: center alignment (`:---:`) is not recognized; centered columns
  render left-aligned.
