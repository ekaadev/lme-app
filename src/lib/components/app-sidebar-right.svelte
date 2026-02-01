<script lang="ts" module>
	const data = {
		user: {
			name: 'User Name',
			email: 'user@example.com',
			avatar: ''
		},
		sections: []
	};
</script>

<script lang="ts">
	// Components UI
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import * as Sidebar from '@/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';

	import SearchIcon from '@lucide/svelte/icons/search';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
	<Sidebar.Header class="flex flex-row items-center justify-between">
		<div>
			<h2 class="text-lg font-semibold">Cari lagu</h2>
			<p class="text-sm text-muted-foreground">Lagu apa yang sedang kamu cari?</p>
		</div>
	</Sidebar.Header>
	<Sidebar.Content>
		<!-- Search Section -->
		<div class="space-y-4 p-2">
			<InputGroup.Root>
				<InputGroup.Input placeholder="Search..." />
				<InputGroup.Addon>
					<SearchIcon />
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
		<!-- Content Section -->
		<div class="space-y-4 p-2"></div>
	</Sidebar.Content>
	<Sidebar.Footer>
		<div class="p-4 text-xs text-muted-foreground">Right sidebar footer</div>
	</Sidebar.Footer>
</Sidebar.Root>
