// parser.ts
export type ParseResult = {
    numPoints: number | null;
    numLines: number | null;
    points: number[];
    warnings: string[];
  };
  
  export function parseStringArt(content: string): ParseResult {
    const warnings: string[] = [];
  
    // Extract counts
    const numPointsMatch = content.match(/Number of points:\s*(\d+)/i);
    const numLinesMatch  = content.match(/Number of lines:\s*(\d+)/i);
  
    const numPoints = numPointsMatch ? parseInt(numPointsMatch[1], 10) : null;
    const numLines  = numLinesMatch  ? parseInt(numLinesMatch[1], 10)  : null;
  
    // Extract destination points for each "Line n:"
    // Handles:
    //  - "Line 1: point 1 -> point 127"
    //  - "Line 2: -> point 212"
    //  - (tolerant) "Line 3: point 129"
    const lineRegex =
      /Line\s+\d+:\s*(?:point\s+\d+\s*->\s*)?(?:->\s*)?point\s+(\d+)/gi;
  
    const points: number[] = [];
    for (const m of content.matchAll(lineRegex)) {
      points.push(parseInt(m[1], 10));
    }
  
    // Basic sanity checks
    if (points.length === 0) {
      warnings.push("No points were parsed. Check the text format or regex.");
    }
    if (numLines !== null && points.length !== numLines) {
      warnings.push(
        `Parsed ${points.length} lines, but header says ${numLines}.`
      );
    }
  
    return { numPoints, numLines, points, warnings };
  }
  