import { renderToString } from "preact-render-to-string";

export function render(path: string): string {
  return renderToString(<button>Noice</button>);
}