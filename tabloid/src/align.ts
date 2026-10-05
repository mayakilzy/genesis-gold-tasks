/**
 * Column alignment for markdown tables.
 *
 * The separator row of a markdown table carries per-column alignment:
 *
 *   :---   left (also the default for a bare ---)
 *   :---:  center
 *   ---:   right
 */

export type Alignment = 'left' | 'center' | 'right';

/** Parse one separator-row cell into its alignment. */
export function parseAlignment(spec: string): Alignment {
  const trimmed = spec.trim();
  // KNOWN DEFECT (issue #18): center alignment (":---:") is not recognized
  // and falls back to left, so centered columns render left-aligned.
  if (trimmed.endsWith(':') && !trimmed.startsWith(':')) {
    return 'right';
  }
  return 'left';
}

/** Render one separator-row cell for an alignment. */
export function alignmentSeparator(alignment: Alignment): string {
  switch (alignment) {
    case 'center':
      return ':---:';
    case 'right':
      return '---:';
    case 'left':
      return ':---';
  }
}
