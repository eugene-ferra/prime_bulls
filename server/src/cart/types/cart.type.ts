import { CartItem } from './cartItem.type.js';

export type Cart = {
  items: CartItem[];
  actualSum: number;
  oldSum: number;
};
