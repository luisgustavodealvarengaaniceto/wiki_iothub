// Tipos de blocos para o Page Builder

export interface BaseBlock {
  id: string;
  type: string;
  order: number;
}

export interface TextBlock extends BaseBlock {
  type: "text";
  data: {
    content: string;
    align: "left" | "center" | "right";
  };
}

export interface RawHtmlBlock extends BaseBlock {
  type: "raw-html";
  data: string;
}

export type BlockType = TextBlock | RawHtmlBlock;

export type BlockData = TextBlock["data"] | RawHtmlBlock["data"];
