<script lang="ts" module>
	import BotIcon from '@lucide/svelte/icons/bot';
</script>

<script lang="ts">
	import NavMain from './nav-main.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import CommandIcon from '@lucide/svelte/icons/command';
	import type { ComponentProps } from 'svelte';
	import type { UserResponse } from '$lib/types/auth';
	import type { PlaylistResponse } from '$lib/types/playlist';

	// Props dari component termasuk user data dan playlists dari layout
	let {
		ref = $bindable(null),
		user,
		playlists = [],
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		user?: UserResponse | null;
		playlists?: PlaylistResponse[];
	} = $props();

	// Format user data untuk NavUser component
	const navUser = $derived({
		name: user?.username ?? 'Guest',
		email: user?.email ?? '',
		avatar: '' // Avatar URL jika ada
	});
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a href="/new" {...props}>
							<div
								class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
							>
								<CommandIcon class="size-4" />
							</div>
							<div class="grid flex-1 text-start text-sm leading-tight">
								<span class="truncate font-medium">Harmoni</span>
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain {playlists} username={user?.username} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={navUser} />
	</Sidebar.Footer>
</Sidebar.Root>
