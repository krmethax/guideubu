import React from "react";
import styles from "@/styles/Navbar.module.css";

export default function Navbar() {
    return (
        <nav className={`navbar navbar-expand-lg ${styles.navbarCustom}`}>
            <div className="container">
                <a className={`navbar-brand fw-bold ${styles.brand}`} href="/">
                    GUIDE UBU
                </a>

                <button
                    className={`navbar-toggler ${styles.noBorder}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className={`nav-link ${styles.navLink}`} href="/">
                                หน้าหลัก
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${styles.navLink}`}
                                href="/guide/mock_schedule"
                            >
                                จัดตารางเรียน
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${styles.navLink}`} href="https://reg.ubu.ac.th/registrar/home.asp" target={"_blank"}>
                                ลงทะเบียนเรียนที่ REG UBU
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${styles.navLink}`} href="https://ubusac.ubu.ac.th/" target="_blank">
                                ทะเบียนกิจกกรรมนักศึกษา
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
