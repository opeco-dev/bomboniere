import { EventEmitter } from "events";

const globalForEvents = global;

export const paymentEvents =
  globalForEvents.paymentEvents || new EventEmitter();

if (process.env.NODE_ENV !== "production") {
  globalForEvents.paymentEvents = paymentEvents;
}