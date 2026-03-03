import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import type { TextDirective } from "mdast-util-directive";

/**
 * MDXでテキストサイズや色を指定するremarkプラグイン
 *
 * サイズ:
 *   :large[大きなテキスト]
 *   :xl[さらに大きなテキスト]
 *   :sm[小さいテキスト]
 *
 * 色:
 *   :red[赤いテキスト]
 *   :blue[青いテキスト]
 *   :green[緑のテキスト]
 *   :yellow[黄色いテキスト]
 *   :orange[オレンジのテキスト]
 *   :pink[ピンクのテキスト]
 *   :purple[紫のテキスト]
 *   :gray[グレーのテキスト]
 */
const TEXT_SIZE_DIRECTIVES = ["large", "xl", "sm"] as const;
const TEXT_COLOR_DIRECTIVES = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "pink",
  "purple",
  "gray",
] as const;

const ALL_DIRECTIVES = [
  ...TEXT_SIZE_DIRECTIVES,
  ...TEXT_COLOR_DIRECTIVES,
] as const;

export function remarkTextSize() {
  return (tree: Root) => {
    visit(tree, "textDirective", (node: TextDirective) => {
      if (!(ALL_DIRECTIVES as readonly string[]).includes(node.name)) return;

      const data = node.data || (node.data = {});
      data.hName = "span";
      data.hProperties = {
        ...data.hProperties,
        className: [`directive-${node.name}`],
      };
    });
  };
}
