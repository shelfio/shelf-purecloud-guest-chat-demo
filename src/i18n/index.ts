import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      title: "Welcome to Acme Finance Group!",
      subtitle: "Changing lives. One member at a time.",
      articleResponse: "Here are articles that might help you find an answer:",
      agent: "agent",
      endChatMessage: "Thank you for chatting with us and have a great day!",
      agentJoin: "Agent joined the conversation",
      welcome: "Hello and thank you for visiting! How may I help you?",
      connect: "Just a moment, we are getting the right person to help you.",
      placeholder: "Type a message...",
    },
  },
  uk: {
    translation: {
      title: "Ласкаво просимо до Акме Фінанс Груп!",
      subtitle: "Ми змінюємо життя. Один клієнт за раз.",
      articleResponse: "Ось статті, які можуть допомогти вам знайти відповідь:",
      agent: "агент",
      endChatMessage: "Дякуємо за звернненя! Гарного дня!",
      agentJoin: "Агент долучився до розмови",
      welcome: "Вітаю! Чим я можу Вам допомогти?",
      connect: "Одну хвилину, з'єднуємо з людиною, яка вам допоможе.",
      placeholder: "Введіть повідомлення...",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    keySeparator: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
