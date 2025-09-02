import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p>Welcome to FreshKeep! Your modern solution for pantry management.</p>
        <button className={styles.button}>Get Started</button>
      </main>
    </div>
  );
}
