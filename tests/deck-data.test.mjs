import assert from "node:assert/strict";
import test from "node:test";
import * as apiAuth from "../assets/api-auth-cards.js";
import * as advancedElectronics from "../assets/advanced-electronics-cards.js";
import * as dataModeling from "../assets/data-modeling-cards.js";
import * as dockerContainers from "../assets/docker-containers-cards.js";
import * as commonElectronics from "../assets/electronics-cards.js";
import * as industrialCommunications from "../assets/industrial-communications-cards.js";
import * as microcontrollerWiring from "../assets/microcontroller-wiring-cards.js";
import * as testEquipment from "../assets/test-equipment-cards.js";

for (const [name, deck] of Object.entries({
  "API design & authentication": apiAuth,
  "Advanced electronics": advancedElectronics,
  "Data modeling & database design": dataModeling,
  "Docker & containers": dockerContainers,
  "Industrial communications": industrialCommunications,
  "Microcontroller projects & wiring": microcontrollerWiring,
  "Test equipment & troubleshooting": testEquipment,
})) {
  test(`${name} has thirty cards at every level`, () => {
    assert.deepEqual(deck.levels, [1, 2, 3]);
    assert.equal(deck.cards.length, 90);
    assert.deepEqual([...deck.expectedCardCounts.entries()], [[1, 30], [2, 30], [3, 30]]);

    for (const level of deck.levels) {
      assert.equal(deck.cards.filter((card) => card.level === level).length, 30);
    }
  });
}

test("common electronics excludes the advanced-component rotation", () => {
  assert.equal(commonElectronics.cards.length, 60);
  assert.deepEqual([...commonElectronics.expectedCardCounts.entries()], [[1, 20], [2, 20], [3, 20]]);

  for (const level of commonElectronics.levels) {
    assert.equal(commonElectronics.cards.filter((card) => card.level === level).length, 20);
  }

  assert.equal(commonElectronics.cards.some((card) => card.id === "microcontroller"), false);
  assert.equal(commonElectronics.cards.some((card) => card.id === "mosfet"), false);
});
