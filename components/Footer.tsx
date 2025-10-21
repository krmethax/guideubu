import React from "react";
import styles from "@/styles/Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container text-center py-3">
                <p className={styles.copy}>พัฒนาโดย : GUIDE UBU</p>
            </div>
        </footer>
    );
}
