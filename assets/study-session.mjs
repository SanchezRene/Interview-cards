export const SESSION_SIZE = 10;

export function shuffled(items, random = Math.random) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

export function createStudySession(cards, { size = SESSION_SIZE, random = Math.random } = {}) {
  const studyCards = shuffled(cards, random).slice(0, Math.min(size, cards.length));

  return {
    phase: "study",
    studyCards,
    reviewCards: [],
    position: 0,
  };
}

export function currentCard(session) {
  if (session.phase === "complete") return null;
  const activeCards = session.phase === "study" ? session.studyCards : session.reviewCards;
  return activeCards[session.position] ?? null;
}

export function advanceSession(session, outcome) {
  if (!currentCard(session)) {
    throw new Error("Cannot advance a completed study session.");
  }

  const isStudyPass = session.phase === "study";
  const reviewCards = isStudyPass && outcome === "review"
    ? [...session.reviewCards, currentCard(session)]
    : session.reviewCards;
  const activeCards = isStudyPass ? session.studyCards : reviewCards;
  const nextPosition = session.position + 1;

  if (nextPosition < activeCards.length) {
    return { ...session, reviewCards, position: nextPosition };
  }

  if (isStudyPass && reviewCards.length > 0) {
    return { ...session, phase: "review", reviewCards, position: 0 };
  }

  return { ...session, phase: "complete", reviewCards, position: 0 };
}
