<!-- Sidebar Layout -->
<script lang="ts">
	import type { LayoutData } from './$types';

	// Components UI
	import AppSidebar from '@/components/app-sidebar.svelte';
	import AppSidebarRight from '@/components/app-sidebar-right.svelte';
	import * as Sidebar from '@/components/ui/sidebar/index.js';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '@/components/ui/button/index.js';
	import { Separator } from '@/components/ui/separator/index.js';

	// Icon
	import { SunIcon } from 'lucide-svelte';
	import { MoonIcon } from 'lucide-svelte';
	import { PanelRightIcon } from 'lucide-svelte';

	// Props termasuk data dari server load
	let { children, data }: { children: any; data: LayoutData } = $props();
</script>

<!-- Left Sidebar Provider -->
<Sidebar.Provider id="left" shortcutKey="b">
	<AppSidebar side="left" id="left" class="" user={data.user} playlists={data.playlists} />
	<!-- Right Sidebar Provider -->
	<Sidebar.Provider id="right" shortcutKey="B">
		<!-- Main Content Area with Inset Styling -->
		<main
			class="relative flex w-full flex-1 flex-col bg-background md:m-2 md:ms-2 md:me-2 md:rounded-xl md:shadow-sm"
		>
			<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<div class="flex items-center gap-2">
					<Sidebar.Trigger id="left" class="-ms-1" />
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
				<div class="ms-auto">
					<Sidebar.Trigger id="right" variant="ghost" size="icon">
						<PanelRightIcon class="h-[1.2rem] w-[1.2rem]" />
						<span class="sr-only">Toggle right sidebar</span>
					</Sidebar.Trigger>
				</div>
			</header>
			<!-- Child Page -->
			<div class="flex-1">
				{@render children()}
			</div>
		</main>
		<AppSidebarRight side="right" id="right" />
	</Sidebar.Provider>
</Sidebar.Provider>
