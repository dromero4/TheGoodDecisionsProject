"use client";

import { Suspense } from "react";
import ResetPasswordPage from "./reestablecerPasswordForm";


export default function ReestablecerPassword() {
    return (
    <Suspense fallback={<div>Cargando...</div>}>
        <ResetPasswordPage />
    </Suspense>
    )
}