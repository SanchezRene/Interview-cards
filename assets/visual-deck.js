export const diagram = (content, alt, caption = "Visual prompt") => ({
  type: "diagram",
  content,
  alt,
  caption,
});

export const visualEntry = (id, topic, question, visual, answer, details, check, plain, deeper) => ({
  id,
  topic,
  question,
  visuals: Array.isArray(visual) ? visual : [visual],
  answer,
  details,
  check,
  plain,
  deeper,
});

export function createVisualDeck({ topic, source, entries }) {
  if (entries.length !== 30) {
    throw new Error(`${topic} must contain exactly 30 entries.`);
  }

  const makeCard = (item, level) => {
    const levelAnswer = level === 1
      ? item.answer
      : level === 2
        ? `${item.answer} ${item.details}`
        : `${item.answer} ${item.deeper}`;

    return {
      id: item.id,
      level,
      topic: item.topic ?? topic,
      question: item.question,
      memorize: levelAnswer,
      technical: level === 1 ? item.details : `${item.details} ${item.deeper}`,
      extra: item.check,
      plain: item.plain,
      example: "",
      docsLabel: source[0],
      docsUrl: source[1],
      visuals: item.visuals,
    };
  };

  return {
    cards: entries.flatMap((item) => [1, 2, 3].map((level) => makeCard(item, level))),
    levels: [1, 2, 3],
    expectedCardCounts: new Map([[1, 30], [2, 30], [3, 30]]),
  };
}
