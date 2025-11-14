// app/membership/layout.tsx
import React from "react";
import Navbar from "@/components/Navbar"; // adjust path
import Footer from "@/components/Footer"; // adjust path

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0718] via-[#20104a] to-[#6046b3] text-white">
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}


// // export default function MembershipLayout({ children }: { children: React.ReactNode }) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-b from-[#0b0718] to-[#1a0f3a] text-white">
// //         <div className="max-w-7xl mx-auto px-6 py-10">
// //           {children}
// //         </div>
// //       </div>
// //     );
// //   }

// // import 'app/globals.css'
// // import { metadata } from 'lib/metadata'

// // export { metadata }

// // export default function RootLayout({
// //   children,
// // }: {
// //   children: React.ReactNode
// // }) {
// //   return (
// //     <html lang="en">
// //       <body suppressHydrationWarning={true}>{children}</body>
// //     </html>
// //   )
// // }
