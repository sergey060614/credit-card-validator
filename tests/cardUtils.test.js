import { luhnCheck, getCardSystem } from "../src/lib/cardUtils";

describe("Payment System Detection", () => {
  test("должен определять Visa", () => {
    expect(getCardSystem("4111 1111 1111 1111")).toBe("visa");
    expect(getCardSystem("4222222222222")).toBe("visa");
  });

  test("должен определять Mastercard", () => {
    expect(getCardSystem("5555 5555 5555 4444")).toBe("mastercard");
    expect(getCardSystem("2223000048400011")).toBe("mastercard"); // Новый диапазон
  });

  test("должен определять МИР", () => {
    expect(getCardSystem("2200 2222 5555 1111")).toBe("mir");
    expect(getCardSystem("2204444444444444")).toBe("mir");
  });

  test("должен определять American Express", () => {
    expect(getCardSystem("378282246310005")).toBe("amex");
  });

  test("должен возвращать null для неизвестных систем", () => {
    expect(getCardSystem("1234567890123456")).toBeNull();
    expect(getCardSystem("")).toBeNull();
  });
});

describe("Luhn Algorithm", () => {
  test("валидные тестовые номера должны проходить проверку", () => {
    // Тестовые номера от платежных систем (всегда валидны по Луну)
    expect(luhnCheck("4111 1111 1111 1111")).toBe(true); // Visa
    expect(luhnCheck("5555 5555 5555 4444")).toBe(true); // Mastercard
    expect(luhnCheck("378282246310005")).toBe(true); // Amex
  });

  test("невалидные номера должны проваливать проверку", () => {
    expect(luhnCheck("4111 1111 1111 1112")).toBe(false); // Изменена последняя цифра
    expect(luhnCheck("5555 5555 5555 4440")).toBe(false);
  });

  test("должен корректно обрабатывать ввод с пробелами и дефисами", () => {
    expect(luhnCheck("4111-1111-1111-1111")).toBe(true);
    expect(luhnCheck("4 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1")).toBe(true);
  });

  test("пустая строка должна быть невалидной", () => {
    expect(luhnCheck("")).toBe(false);
  });
});
