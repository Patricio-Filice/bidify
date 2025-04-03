import * as React from 'react'
const NextThemesProvider = dynamic(
	() => import('next-themes').then((e) => e.ThemeProvider),
	{
		ssr: false,
	}
)

import dynamic from 'next/dynamic'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	return (
	<NextThemesProvider attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange
	>
		{children}
	</NextThemesProvider>
	)
}
