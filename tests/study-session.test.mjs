import assert from "node:assert/strict";
import test from "node:test";
import { advanceSession, createStudySession, currentCard } from "../assets/study-session.mjs";

const cards = Array.from({ length: 12 }, (_, index) => ({ id: `card-${index + 1}` }));
const first = () => 0.999999;

test("a session draws ten unique cards when more are available", () => {
  const session = createStudySession(cards, { random: first });

  assert.equal(session.studyCards.length, 10);
  assert.equal(new Set(session.studyCards.map((card) => card.id)).size, 10);
});

test("reviewed cards form one final review pass", () => {
  let session = createStudySession(cards.slice(0, 3), { random: first });

  session = advanceSession(session, "got-it");
  session = advanceSession(session, "review");
  session = advanceSession(session, "review");

  assert.equal(session.phase, "review");
  assert.deepEqual(session.reviewCards.map((card) => card.id), ["card-2", "card-3"]);
  assert.equal(currentCard(session).id, "card-2");

  session = advanceSession(session, "done");
  assert.equal(session.phase, "review");
  assert.equal(currentCard(session).id, "card-3");

  session = advanceSession(session, "done");
  assert.equal(session.phase, "complete");
  assert.equal(currentCard(session), null);
});

test("a clean first pass completes without a review phase", () => {
  let session = createStudySession(cards.slice(0, 2), { random: first });

  session = advanceSession(session, "got-it");
  session = advanceSession(session, "got-it");

  assert.equal(session.phase, "complete");
  assert.equal(session.reviewCards.length, 0);
});

test("starting a new session for another level is independent", () => {
  const levelOne = createStudySession(cards.slice(0, 4), { random: first });
  const levelTwo = createStudySession(cards.slice(4, 8), { random: first });

  assert.notEqual(currentCard(levelOne).id, currentCard(levelTwo).id);
  assert.equal(levelOne.phase, "study");
  assert.equal(levelTwo.phase, "study");
});
