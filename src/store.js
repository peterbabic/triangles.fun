import { writable } from "svelte/store"

const itemName = "completedLevels"
const retrieved = localStorage.getItem(itemName)
const parsed = JSON.parse(retrieved)
export const completed = writable(parsed === null ? [] : parsed)

completed.subscribe(value =>
  localStorage.setItem(itemName, JSON.stringify(value))
)
