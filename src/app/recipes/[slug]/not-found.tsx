import Link from 'next/link';
import { ArrowLeft } from 'react-bootstrap-icons';
import styles from '../page.module.css';

export default function NotFound() {
  return (
    <main
      className={styles.rpPage}
      style={{ background: 'rgb(236, 255, 239)' }}
    >
      <div className={styles.rpMain}>
        <div className={styles.rpMainInner}>

          {/* Back Button */}
          <Link href="/recipes" className={styles.rpBackBtn}>
            <ArrowLeft className={styles.rpBackIcon} />
            Back to Recipes
          </Link>

          {/* Card */}
          <div className={styles.rpCard}>
            <div className={styles.rpBlock}>
              <h1 className={styles.rpH2}>
                Oops… this recipe is missing!
              </h1>
              <p className={styles.rpMedium}>
                We couldn&apos;t find this recipe. It might have been moved, renamed,
                or the link may be a little off.
              </p>
            </div>

            <div className={styles.rpBlock}>
              <p className={styles.rpMedium}>
                Don&apos;t worry! You can browse all recipes or search for something new! 🧑‍🍳✨
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
