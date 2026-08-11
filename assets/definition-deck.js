export const entry = (id, question, definition, technical, practice, plain, advanced) => ({
  id, question, definition, technical, practice, plain, advanced,
});

export function createDefinitionDeck({ topic, source, entries }) {
  if (entries.length !== 30) {
    throw new Error(`${topic} must contain exactly 30 entries.`);
  }

  const card = (item, level, memorize, technical, extra) => ({
    id: item.id,
    level,
    topic,
    question: item.question,
    memorize,
    technical,
    extra,
    plain: item.plain,
    example: "",
    docsLabel: source[0],
    docsUrl: source[1],
  });

  const cards = entries.flatMap((item) => [
    card(item, 1, item.definition, item.technical, item.practice),
    card(item, 2, item.definition, `${item.technical} ${item.advanced}`, item.practice),
    card(item, 3, `${item.definition} ${item.advanced}`, `${item.technical} ${item.advanced}`, item.practice),
  ]);

  return {
    cards,
    levels: [1, 2, 3],
    expectedCardCounts: new Map([[1, 30], [2, 30], [3, 30]]),
  };
}
