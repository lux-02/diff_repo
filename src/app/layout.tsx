import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitHub Diff Analyzer - AI 기반 커밋 분석 도구",
  description:
    "GitHub 커밋의 변경사항을 AI로 자동 분석하고 시각화해주는 도구입니다. Google Gemini AI를 사용하여 코드 변경의 목적, 영향도, 개선사항을 한국어로 분석합니다.",
  keywords: [
    "GitHub",
    "diff",
    "commit",
    "AI",
    "code analysis",
    "Gemini",
    "코드 분석",
    "커밋 분석",
  ],
  authors: [{ name: "GitHub Diff Analyzer" }],
  openGraph: {
    title: "GitHub Diff Analyzer",
    description: "AI 기반 GitHub 커밋 변경사항 분석 도구",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
