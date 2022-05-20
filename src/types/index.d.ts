import { Contract } from "crossbell.js";

declare global {
  interface Window {
    contract?: Contract;
    address?: string;
  }
}

export {};
