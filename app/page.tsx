"use client";

import { useState } from "react";
import styles from "./page.module.css";

type HelloResponse = {
  message: string;
  path: string;
  time: string;
};

export default function Home() {
  const [response, setResponse] = useState("Ответ backend появится здесь.");
  const [isLoading, setIsLoading] = useState(false);

  async function askBackend() {
    setIsLoading(true);

    try {
      const res = await fetch("/api/hello");
      const data = (await res.json()) as HelloResponse;
      setResponse(`${data.message} Путь: ${data.path}. Время: ${data.time}`);
    } catch {
      setResponse("Не получилось получить ответ от backend.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <h1 className={styles.title}>Привет</h1>
        <p className={styles.lead}>
          Это базовая страница на Next.js. Кнопка ниже отправляет запрос в Nest-слой
          backend и показывает ответ.
        </p>

        <div className={styles.panel}>
          <button className={styles.button} disabled={isLoading} onClick={askBackend}>
            {isLoading ? "Запрашиваю..." : "Спросить backend"}
          </button>
          <p className={styles.response}>{response}</p>
        </div>
      </section>
    </main>
  );
}
