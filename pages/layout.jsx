import {Suspense} from "react";

export default function RootLayout({children, params}) {
  return (
      <Suspense>
        {children}
      </Suspense>
  );
}
