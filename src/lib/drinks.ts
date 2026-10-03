import { request } from "./api";
import type { DrinkOption, NewDrinkInput } from "./types";

export const drinksKey = ["drinks"] as const;

export const fetchDrinks = () => request<DrinkOption[]>("/drinks");

export const createDrink = (input: NewDrinkInput) =>
  request<DrinkOption>("/drinks", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const updateDrink = (type: string, input: NewDrinkInput) =>
  request<DrinkOption>(`/drinks/${encodeURIComponent(type)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

export const deleteDrink = (type: string) =>
  request<void>(`/drinks/${encodeURIComponent(type)}`, { method: "DELETE" });
