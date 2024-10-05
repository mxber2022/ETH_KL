import PageContainer from "@/components/PageContainer"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Tomaru: Authentic, Anonymous Hotel Review",
    description: "An authentic, anonymous hotel review platform on Ethereum.",
    icons: { icon: "/tomaru.svg", apple: "/tomaru.png" },
    metadataBase: new URL("https://demo.semaphore.pse.dev"),
    openGraph: {
        type: "website",
        url: "https://demo.semaphore.pse.dev",
        title: "Tomaru",
        description: "An authentic, anonymous hotel review platform on Ethereum.",
        siteName: "Tomaru",
        images: [
            {
                url: "https://demo.semaphore.pse.dev/social-media.png"
            }
        ]
    },
    twitter: { card: "summary_large_image", images: "https://demo.semaphore.pse.dev/social-media.png" }
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning className={inter.className}>
                <PageContainer>{children}</PageContainer>
            </body>
        </html>
    )
}
