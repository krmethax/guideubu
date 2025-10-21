import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "@/styles/MockSchedule.module.css";
import html2canvas from "html2canvas";

export default function MockSchedule() {
    const [courses, setCourses] = useState<any[]>([]);
    const [form, setForm] = useState({
        name: "",
        day: "",
        start: "",
        end: "",
    });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const tableRef = useRef<HTMLDivElement>(null);
    const days = ["จ.", "อ.", "พ.", "พฤ.", "ศ."];

    // ✅ โหลดข้อมูลจาก LocalStorage เมื่อเปิดหน้า
    useEffect(() => {
        const savedCourses = localStorage.getItem("mockSchedule");
        if (savedCourses) setCourses(JSON.parse(savedCourses));
    }, []);

    // ✅ บันทึกข้อมูลลง LocalStorage ทุกครั้งที่ courses เปลี่ยน
    useEffect(() => {
        localStorage.setItem("mockSchedule", JSON.stringify(courses));
    }, [courses]);

    // ✅ สร้างเวลาอัตโนมัติ (ทุก 30 นาที)
    const generateTimes = () => {
        const times = [];
        for (let h = 8; h <= 18; h++) {
            for (let m = 0; m < 60; m += 30) {
                const hh = String(h).padStart(2, "0");
                const mm = String(m).padStart(2, "0");
                times.push(`${hh}:${mm}`);
            }
        }
        return times;
    };
    const allSelectableTimes = generateTimes();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.day || !form.start || !form.end) return;

        if (form.end <= form.start) {
            alert("เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม");
            return;
        }

        const overlap = courses.some((c, i) => {
            if (i === editingIndex) return false;
            if (c.day !== form.day) return false;
            return form.start < c.end && form.end > c.start;
        });
        if (overlap) return alert("เวลานี้มีวิชาอื่นอยู่แล้ว!");

        if (editingIndex !== null) {
            const updated = [...courses];
            updated[editingIndex] = { ...form };
            setCourses(updated);
            setEditingIndex(null);
        } else {
            setCourses([...courses, { ...form }]);
        }

        setForm({ name: "", day: "", start: "", end: "" });
    };

    const handleDelete = (index: number) => {
        if (confirm("ต้องการลบรายวิชานี้หรือไม่?")) {
            setCourses((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleEdit = (index: number) => {
        const course = courses[index];
        if (!course) return;
        setForm({ ...course });
        setEditingIndex(index);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const allTimes = Array.from(
        new Set(courses.flatMap((c) => [c.start, c.end])).values()
    ).sort((a, b) => (a < b ? -1 : 1));

    // ✅ บันทึกตารางเป็นรูป PNG (ซ่อนปุ่มก่อนถ่าย)
    const handleSaveSchedule = async () => {
        if (!tableRef.current) return alert("ไม่พบตารางเรียน");
        if (courses.length === 0) return alert("ยังไม่มีรายวิชาในตาราง");

        const actionButtons = tableRef.current.querySelectorAll(`.${styles.courseActions}`);
        actionButtons.forEach((btn) => ((btn as HTMLElement).style.display = "none"));

        const canvas = await html2canvas(tableRef.current, { scale: 2 });
        const dataUrl = canvas.toDataURL("image/png");

        actionButtons.forEach((btn) => ((btn as HTMLElement).style.display = ""));

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "timetable.png";
        link.click();
    };

    // ✅ ล้างข้อมูลทั้งหมด
    const handleClearSchedule = () => {
        if (confirm("ต้องการล้างตารางเรียนทั้งหมดหรือไม่?")) {
            setCourses([]);
            localStorage.removeItem("mockSchedule");
        }
    };

    return (
        <>
            <Navbar />

            {/* ✅ กล่องแจ้งเตือนด้านบน */}
            <div className={styles.alertBox}>
                ไม่ใช่ระบบลงทะเบียนเรียนอย่างเป็นทางการ<br />
                สามารถลงทะเบียนเรียนจริงได้ที่{" "}
                <a
                    href="https://reg.ubu.ac.th/registrar/home.asp"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    REG UBU
                </a>
            </div>

            <div className={styles.page}>
                <div className={styles.container}>
                    {/* ---- ฟอร์ม ---- */}
                    <div className={styles.formSection}>
                        <h5 className={styles.formTitle}>
                            {editingIndex !== null ? "แก้ไขรายวิชา" : "เพิ่มวิชาเรียน"}
                        </h5>

                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>ชื่อวิชา</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>วัน</label>
                                <select name="day" value={form.day || ""} onChange={handleChange} required>
                                    <option value="">เลือกวัน</option>
                                    {days.map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>เวลาเริ่ม</label>
                                <select name="start" value={form.start || ""} onChange={handleChange} required>
                                    <option value="">เลือกเวลาเริ่ม</option>
                                    {allSelectableTimes.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>เวลาสิ้นสุด</label>
                                <select name="end" value={form.end || ""} onChange={handleChange} required>
                                    <option value="">เลือกเวลาสิ้นสุด</option>
                                    {allSelectableTimes.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className={styles.btn}>
                                {editingIndex !== null ? "บันทึกการแก้ไข" : "เพิ่มวิชา"}
                            </button>

                            {editingIndex !== null && (
                                <button
                                    type="button"
                                    className={styles.cancelBtn}
                                    onClick={() => {
                                        setForm({ name: "", day: "", start: "", end: "" });
                                        setEditingIndex(null);
                                    }}
                                >
                                    ยกเลิก
                                </button>
                            )}
                        </form>
                    </div>

                    {/* ---- ตาราง ---- */}
                    <div className={styles.tableSection} ref={tableRef}>
                        <h5 className={styles.tableTitle}>ตารางเรียน</h5>
                        <div className={styles.schedule}>
                            {courses.length === 0 ? (
                                <p className={styles.noData}>ยังไม่มีรายวิชาในตาราง</p>
                            ) : (
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Day/Time</th>
                                        {allTimes.slice(0, -1).map((t, i) => (
                                            <th key={t}>
                                                {t} - {allTimes[i + 1]}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {days.map((day) => (
                                        <tr key={day}>
                                            <td className={styles.dayCell}>{day}</td>
                                            {allTimes.slice(0, -1).map((time, i) => {
                                                const course = courses.find(
                                                    (c) => c.day === day && c.start === time
                                                );
                                                if (course) {
                                                    const startIndex = allTimes.indexOf(course.start);
                                                    const endIndex = allTimes.indexOf(course.end);
                                                    const span = endIndex - startIndex;
                                                    const index = courses.findIndex(
                                                        (c) =>
                                                            c.day === course.day &&
                                                            c.start === course.start &&
                                                            c.end === course.end
                                                    );
                                                    return (
                                                        <td key={i} colSpan={span} className={styles.cell}>
                                                            <div className={styles.courseBox}>
                                                                <strong>{course.name}</strong>
                                                                <div className={styles.timeText}>
                                                                    {course.start} - {course.end}
                                                                </div>
                                                                <div className={styles.courseActions}>
                                                                    <button
                                                                        onClick={() => handleEdit(index)}
                                                                        className={styles.iconBtn}
                                                                    >
                                                                        <i className="bi bi-pencil"></i>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(index)}
                                                                        className={styles.iconBtnDel}
                                                                    >
                                                                        <i className="bi bi-trash"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    );
                                                } else if (
                                                    courses.some(
                                                        (c) =>
                                                            c.day === day &&
                                                            time > c.start &&
                                                            time < c.end
                                                    )
                                                ) {
                                                    return null;
                                                } else {
                                                    return <td key={i} className={styles.cell}></td>;
                                                }
                                            })}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* ✅ ปุ่มดาวน์โหลด + ล้างตาราง */}
                    <div className={styles.saveSection}>
                        <button type="button" className={styles.saveBtn} onClick={handleSaveSchedule}>

                            ดาวน์โหลดตาราง
                        </button>

                        <button type="button" className={styles.clearBtn} onClick={handleClearSchedule}>
                           
                            ล้างตาราง
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
