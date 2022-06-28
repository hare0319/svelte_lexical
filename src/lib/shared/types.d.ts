import { LexicalNode } from "lexical";

export type Klass<T extends LexicalNode> = {
  new (...args: unknown[]): T;
} & Omit<LexicalNode, "constructor">;

export type Maybe<T> = T | undefined;
