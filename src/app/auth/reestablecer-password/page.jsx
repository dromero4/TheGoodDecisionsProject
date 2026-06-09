"use client";

import { Suspense } from "react";
import ResetPasswordPage from "./reestablecerPasswordForm";


export default function ReestablecerPassword() {
    <Suspense fallback={<div>Cargando...</div>}>
        <ResetPasswordPage />
    </Suspense>
}