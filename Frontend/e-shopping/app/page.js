
import styles from "./page.module.css";
import HomeArticles from "./components/home/HomeArticles";
export default function Home() {
  return (
    <>
      <main className={styles.main}>
        {/* Le reste de la page ici */}
        <HomeArticles />
      </main>
    </>
  );
}
