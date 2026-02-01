<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Button } from '@/components/ui/button/index.js';
	import Plus from '@lucide/svelte/icons/plus';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import LoaderIcon from '@lucide/svelte/icons/loader';
	import { createPlaylist, getPlaylistById } from '$lib/api/playlist';
	import { playlistStore } from '$lib/stores/playlist.svelte';
	import { explainStore } from '$lib/stores/explain.svelte';
	import { invalidateAll } from '$app/navigation';
	import type { PlaylistResponse } from '$lib/types/playlist';

	let {
		playlists,
		username = 'User'
	}: {
		playlists: PlaylistResponse[];
		username?: string;
	} = $props();

	// State untuk loading saat membuat playlist
	let isCreating = $state(false);

	// State untuk loading saat menambah playlist ke explain
	let addingPlaylistId = $state<number | null>(null);

	// Hitung nomor playlist berikutnya
	function getNextPlaylistNumber(): number {
		const existingNumbers = playlists
			.map((p) => {
				const match = p.title.match(/^My Playlist #(\d+)$/);
				return match ? parseInt(match[1], 10) : 0;
			})
			.filter((n) => n > 0);

		if (existingNumbers.length === 0) return 1;
		return Math.max(...existingNumbers) + 1;
	}

	// Handler untuk membuat playlist baru
	async function handleCreatePlaylist() {
		if (isCreating) return;

		isCreating = true;
		try {
			const nextNumber = getNextPlaylistNumber();
			const newPlaylist = await createPlaylist({
				title: `My Playlist #${nextNumber}`,
				description: `A new playlist created by ${username}`
			});

			// Tambah ke store dan refresh data
			playlistStore.addPlaylist(newPlaylist);
			await invalidateAll();
		} catch (error) {
			console.error('Failed to create playlist:', error);
		} finally {
			isCreating = false;
		}
	}

	// Handler untuk menambahkan semua lagu di playlist ke explain
	async function handleAddPlaylistToExplain(playlistId: number, event: MouseEvent) {
		event.preventDefault(); // Prevent navigation
		event.stopPropagation();

		if (addingPlaylistId !== null) return;

		addingPlaylistId = playlistId;
		try {
			// Fetch playlist detail dengan songs
			const playlistDetail = await getPlaylistById(playlistId);

			// Add semua songs ke explain store
			if (playlistDetail.songs && playlistDetail.songs.length > 0) {
				playlistDetail.songs.forEach((song) => {
					explainStore.addSong({
						id: song.id,
						title: song.song_title,
						artist: song.song_artist
					});
				});
			}
		} catch (error) {
			console.error('Failed to add playlist to explain:', error);
		} finally {
			addingPlaylistId = null;
		}
	}

	// Get initial dari nama playlist
	function getInitial(name: string): string {
		return name.charAt(0).toUpperCase();
	}
</script>

<Sidebar.Group>
	<div class="flex flex-row items-center justify-between">
		<Sidebar.GroupLabel class="text-base font-semibold">Your Library</Sidebar.GroupLabel>
		<Button
			size="icon"
			variant="ghost"
			class="h-8 w-8"
			onclick={handleCreatePlaylist}
			disabled={isCreating}
		>
			<Plus class="size-4" />
		</Button>
	</div>
	<Sidebar.Menu class="mt-2">
		{#each playlists as playlist (playlist.id)}
			<Sidebar.MenuItem class="group rounded-md p-1 hover:bg-muted">
				<Sidebar.MenuButton class="h-auto">
					{#snippet child({ props })}
						<a href="/playlist/{playlist.id}" {...props} class="flex flex-1 items-center gap-3">
							<!-- Playlist Avatar -->
							<div
								class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-purple-600 to-blue-500"
							>
								<span class="text-lg font-semibold text-white">
									{getInitial(playlist.title)}
								</span>
							</div>

							<!-- Playlist Info -->
							<div class="flex flex-1 flex-col items-start overflow-hidden">
								<span class="truncate text-sm font-medium">
									{playlist.title}
								</span>
								<span class="truncate text-xs text-muted-foreground">
									Playlist • {playlist.description || 'No description'}
								</span>
							</div>

							<!-- Add to Explain Button -->
							<Button
								size="icon"
								variant="ghost"
								class="h-8 w-8 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
								onclick={(e) => handleAddPlaylistToExplain(playlist.id, e)}
								disabled={addingPlaylistId === playlist.id}
								title="Add all songs to Explain"
							>
								{#if addingPlaylistId === playlist.id}
									<LoaderIcon class="size-4 animate-spin" />
								{:else}
									<SparklesIcon class="size-4" />
								{/if}
							</Button>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{:else}
			<div class="px-2 py-4 text-center text-sm text-muted-foreground">
				No playlists yet. Click + to create one.
			</div>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
