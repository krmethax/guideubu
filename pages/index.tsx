import { useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/guide/mock_schedule");
    }, [router]);

    return (
        <>
            <Navbar />
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h3>กำลังไปยังหน้าจัดตารางเรียน...</h3>
            </div>
            <Footer />
        </>
    );
}
