<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Button } from '@/components/ui/button/index.js';
	import Plus from '@lucide/svelte/icons/plus';

	let {
		playlists
	}: {
		playlists: {
			id: string;
			name: string;
			imageUrl: string;
			songCount: number;
			owner: string;
		}[];
	} = $props();

	function getInitial(name: string): string {
		return name.charAt(0).toUpperCase();
	}
</script>

<Sidebar.Group>
	<div class="flex flex-row items-center justify-between">
		<Sidebar.GroupLabel class="text-base font-semibold">Your Library</Sidebar.GroupLabel>
		<Button size="icon" variant="ghost" class="h-8 w-8">
			<Plus class="size-4" />
		</Button>
	</div>
	<Sidebar.Menu class="mt-2">
		{#each playlists as playlist (playlist.id)}
			<Sidebar.MenuItem class="hover:bg-muted p-1 rounded-md">
				<Sidebar.MenuButton class="h-auto">
					{#snippet child({ props })}
						<a href="/playlist/{playlist.id}" {...props} class="flex items-center gap-3">
							<!-- Playlist Image/Avatar -->
							{#if playlist.imageUrl}
								<Avatar.Root class="h-16 w-16 rounded-md">
									<Avatar.Image src={playlist.imageUrl} alt={playlist.name} />
									<Avatar.Fallback class="rounded-md bg-muted">
										{getInitial(playlist.name)}
									</Avatar.Fallback>
								</Avatar.Root>
							{:else}
								<div class="flex h-16 w-16 items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700">
									<span class="text-lg font-semibold text-muted-foreground">
										{getInitial(playlist.name)}
									</span>
								</div>
							{/if}

							<!-- Playlist Info -->
							<div class="flex flex-col items-start overflow-hidden">
								<span class="truncate text-sm font-medium">
									{playlist.name}
								</span>
								<span class="truncate text-xs text-muted-foreground">
									Playlist • {playlist.owner} • {playlist.songCount} songs
								</span>
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
