import { cards, levels } from "./cards.js";

const byId = (id) => document.getElementById(id);
const elements = {
  topic: byId("card-topic"),
  position: byId("card-position"),
  count: byId("round-count"),
  question: byId("question-title"),
  reveal: byId("reveal-button"),
  next: byId("next-button"),
  answer: byId("answer-panel"),
  memorize: byId("memorize-answer"),
  technical: byId("technical-answer"),
  extra: byId("extra-answer"),
  plain: byId("plain-answer"),
  example: byId("sql-example"),
  exampleCode: document.querySelector("#sql-example code"),
  docs: byId("docs-link"),
  status: byId("live-status"),
};

const buttons = [...document.querySelectorAll("[data-level]")];
const deckByLevel = new Map(levels.map((level) => [level, cards.filter((item) => item.level === level)]));

if (levels.some((level) => deckByLevel.get(level).length !== 24)) {
  throw new Error("Each SQL difficulty level must have exactly 24 cards.");
}

const state = {
  level: 1,
  queues: new Map(),
  shown: new Map(levels.map((level) => [level, 0])),
  lastId: new Map(),
  current: null,
};

function shuffled(items) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function refillQueue(level) {
  const fresh = shuffled(deckByLevel.get(level));
  const previousId = state.lastId.get(level);
  if (fresh.length > 1 && fresh[0].id === previousId) {
    const swapIndex = fresh.findIndex((item) => item.id !== previousId);
    [fresh[0], fresh[swapIndex]] = [fresh[swapIndex], fresh[0]];
  }
  state.queues.set(level, fresh);
  state.shown.set(level, 0);
}

function nextCard(level) {
  if (!state.queues.has(level) || state.queues.get(level).length === 0) {
    refillQueue(level);
  }
  const next = state.queues.get(level).shift();
  state.lastId.set(level, next.id);
  state.shown.set(level, state.shown.get(level) + 1);
  return next;
}

function hideAnswer() {
  elements.answer.hidden = true;
  elements.reveal.textContent = "Show answer";
  elements.reveal.setAttribute("aria-expanded", "false");
}

function renderCard(card) {
  state.current = card;
  elements.topic.textContent = card.topic;
  elements.question.textContent = card.question;
  elements.memorize.textContent = card.memorize;
  elements.technical.textContent = card.technical;
  elements.extra.textContent = card.extra;
  elements.plain.textContent = card.plain;
  elements.docs.href = card.docsUrl;
  elements.docs.querySelector("span").textContent = `Read: ${card.docsLabel} in the official PostgreSQL documentation`;

  if (card.example) {
    elements.exampleCode.textContent = card.example;
    elements.example.hidden = false;
  } else {
    elements.exampleCode.textContent = "";
    elements.example.hidden = true;
  }

  const total = deckByLevel.get(state.level).length;
  const shown = state.shown.get(state.level);
  elements.position.textContent = `Card ${shown} of ${total}`;
  elements.count.textContent = `${total - shown} left this round`;
  hideAnswer();
  elements.status.textContent = `Level ${state.level}, card ${shown} of ${total}: ${card.question}`;
}

function drawNext({ focusQuestion = true } = {}) {
  renderCard(nextCard(state.level));
  if (focusQuestion) elements.question.focus();
}

function selectLevel(level) {
  state.level = level;
  buttons.forEach((button) => {
    const selected = Number(button.dataset.level) === level;
    button.setAttribute("aria-pressed", String(selected));
  });
  drawNext();
}

buttons.forEach((button) => {
  button.addEventListener("click", () => selectLevel(Number(button.dataset.level)));
});

elements.reveal.addEventListener("click", () => {
  const show = elements.answer.hidden;
  elements.answer.hidden = !show;
  elements.reveal.textContent = show ? "Hide answer" : "Show answer";
  elements.reveal.setAttribute("aria-expanded", String(show));
  elements.status.textContent = show ? "Answer shown." : "Answer hidden.";
});

elements.next.addEventListener("click", () => drawNext());

drawNext({ focusQuestion: false });
