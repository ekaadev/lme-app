<!-- Sidebar Layout -->
<script lang="ts">
	// Components UI
	import AppSidebar from '@/components/app-sidebar.svelte';
	import * as Sidebar from '@/components/ui/sidebar/index.js';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '@/components/ui/button/index.js';
	import { Separator } from '@/components/ui/separator/index.js';

	// Icon
	import { SunIcon } from 'lucide-svelte';
	import { MoonIcon } from 'lucide-svelte';

	// Props
	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2">
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ms-1" />
				<Separator orientation="vertical" class="h-6" />
				<!-- Dark Mode -->
				<Button onclick={toggleMode} variant="ghost" size="icon">
					<SunIcon
						class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
					/>
					<MoonIcon
						class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</div>
		</header>
		<!-- Child Page -->
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
